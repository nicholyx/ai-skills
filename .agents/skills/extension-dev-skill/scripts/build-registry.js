/**
 * build-registry.js
 * 从 resources/references/ 目录的 markdown 文档中提取 EDA API 注册表
 * 输出 api-registry.json 供 lint-eda-api.js 使用
 */

const fs = require('fs');
const path = require('path');

const REFS_DIR = path.resolve(__dirname, '..', 'resources', 'references');
const OUTPUT = path.resolve(__dirname, 'api-registry.json');

// ── 工具函数 ──

function readMd(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

/** 从签名代码块中提取内容 */
function extractSignature(md) {
  const m = md.match(/```typescript\n([\s\S]*?)```/);
  return m ? m[1].trim() : '';
}

/** 从 _quick-reference.md 提取类 → 方法映射 */
function parseQuickReference(md) {
  const classes = {};
  let currentClass = null;

  for (const line of md.split('\n')) {
    // ## ClassName
    const classMatch = line.match(/^## (\w+)/);
    if (classMatch) {
      currentClass = classMatch[1];
      if (!classes[currentClass]) {
        classes[currentClass] = { methods: [] };
      }
      continue;
    }
    // - **methodname**: `signature`
    if (currentClass) {
      const methodMatch = line.match(/^- \*\*(\w+)\*\*:\s*`(.+)`/);
      if (methodMatch) {
        const methodKey = methodMatch[1];
        const signature = methodMatch[2];
        // 提取真实方法名（签名中的函数名）
        const nameMatch = signature.match(/^(\w+)\s*[\(<]/);
        const realName = nameMatch ? nameMatch[1] : methodKey;
        classes[currentClass].methods.push({
          key: methodKey,
          name: realName,
          signature,
        });
      }
      // 属性行: - **propname**: `type`
      const propMatch = line.match(/^- \*\*(\w+)\*\*:\s*`(\w+[\w\s:;<>|,\[\]]*);?`/);
      if (propMatch && !methodMatch) {
        // 这是属性而非方法
        const propKey = propMatch[1];
        const propType = propMatch[2];
        classes[currentClass].methods.push({
          key: propKey,
          name: propKey,
          signature: propType,
          isProperty: true,
        });
      }
    }
  }
  return classes;
}

// ── EDA 挂载路径 ──

function parseEdaMounts(md) {
  const mounts = {};
  // 匹配 "propertyName: ClassName;" 格式的签名
  const propRegex = /(\w+)\s*:\s*([\w|<>\s,]+);/g;
  let m;
  while ((m = propRegex.exec(md)) !== null) {
    const propName = m[1].trim();
    const typeName = m[2].trim().split('|')[0].trim(); // 取第一个类型
    mounts[propName] = typeName;
  }
  return mounts;
}

// ── 枚举解析 ──

function parseEnumFile(filePath) {
  const md = readMd(filePath);
  const name = path.basename(filePath, '.md');
  const members = [];

  // 匹配表格行: | MEMBER\_NAME | `value` | desc |
  // 注意: markdown 中下划线可能被转义为 \_
  const tableRegex = /\|\s*([\w\\]+)\s*\|\s*`([^`]*)`\s*\|/g;
  let m;
  while ((m = tableRegex.exec(md)) !== null) {
    // 去除 markdown 转义的反斜杠
    const memberName = m[1].replace(/\\/g, '');
    members.push({ name: memberName, value: m[2] });
  }

  return { name, members };
}

// ── 接口解析 ──

function parseInterfaceFile(filePath) {
  const md = readMd(filePath);
  const name = path.basename(filePath, '.md');
  const properties = [];

  // 匹配属性表格行: | [propName](link) | modifier | type | desc |
  // 属性名可能包含 markdown 转义的 \_
  const propRegex = /\|\s*\[([\w\\]+)\??]\([^)]*\)\s*\|\s*[^|]*\|\s*([^|]+)\|/g;
  let m;
  while ((m = propRegex.exec(md)) !== null) {
    properties.push({ name: m[1], type: m[2].trim() });
  }

  return { name, properties };
}

// ── 主流程 ──

function main() {
  console.log('Building EDA API registry...');

  const registry = {
    _meta: {
      generatedAt: new Date().toISOString(),
      source: 'resources/references/',
    },
    edaMounts: {},      // eda.xxx → ClassName
    classes: {},        // ClassName → { methods: [...] }
    enums: {},          // EnumName → { members: [...] }
    interfaces: {},     // InterfaceName → { properties: [...] }
    typeAliases: [],    // [TypeName, ...]
  };

  // 1. 解析 EDA 挂载路径
  const edaMd = readMd(path.join(REFS_DIR, 'classes', 'EDA.md'));
  registry.edaMounts = parseEdaMounts(edaMd);
  console.log(`  eda mounts: ${Object.keys(registry.edaMounts).length}`);

  // 2. 解析 _quick-reference.md 获取所有类和方法
  const qrMd = readMd(path.join(REFS_DIR, '_quick-reference.md'));
  registry.classes = parseQuickReference(qrMd);
  console.log(`  classes: ${Object.keys(registry.classes).length}`);

  // 3. 解析枚举
  const enumDir = path.join(REFS_DIR, 'enums');
  if (fs.existsSync(enumDir)) {
    for (const file of fs.readdirSync(enumDir)) {
      if (!file.endsWith('.md')) continue;
      const enumData = parseEnumFile(path.join(enumDir, file));
      registry.enums[enumData.name] = { members: enumData.members };
    }
  }
  console.log(`  enums: ${Object.keys(registry.enums).length}`);

  // 4. 解析接口
  const ifaceDir = path.join(REFS_DIR, 'interfaces');
  if (fs.existsSync(ifaceDir)) {
    for (const file of fs.readdirSync(ifaceDir)) {
      if (!file.endsWith('.md')) continue;
      const ifaceData = parseInterfaceFile(path.join(ifaceDir, file));
      registry.interfaces[ifaceData.name] = { properties: ifaceData.properties };
    }
  }
  console.log(`  interfaces: ${Object.keys(registry.interfaces).length}`);

  // 5. 类型别名
  const typesDir = path.join(REFS_DIR, 'types');
  if (fs.existsSync(typesDir)) {
    registry.typeAliases = fs.readdirSync(typesDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''));
  }
  console.log(`  type aliases: ${registry.typeAliases.length}`);

  // 写入
  fs.writeFileSync(OUTPUT, JSON.stringify(registry, null, 2), 'utf-8');
  console.log(`\nRegistry written to ${OUTPUT}`);
}

main();
