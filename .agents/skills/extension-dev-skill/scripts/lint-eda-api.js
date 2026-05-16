/**
 * lint-eda-api.js
 * EasyEDA Pro 扩展 API 用法检查器
 *
 * 用法:
 *   node scripts/lint-eda-api.js <file.ts> [--json] [--fix-hint]
 *
 * 检查规则:
 *   1. eda.xxx 挂载路径是否存在
 *   2. eda.xxx.method() 方法名是否存在于对应类
 *   2a. 方法调用参数个数是否匹配签名
 *   2b. 枚举类型参数是否传入了正确的枚举类型
 *   3. 枚举名和枚举成员是否合法
 *   4. SCH setState_* 误用检测（SCH 图元不能直接 setState 提交）
 *   5. 已知常见错误模式检测
 */

const fs = require('fs');
const path = require('path');

// ── 加载注册表 ──

const REGISTRY_PATH = path.resolve(__dirname, 'api-registry.json');

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('[ERROR] api-registry.json not found. Run "node scripts/build-registry.js" first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
}

// ── 诊断类型 ──

const Severity = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

function createDiagnostic(line, col, severity, message, rule, suggestion) {
  return { line, col, severity, message, rule, suggestion: suggestion || null };
}

// ── 检查器 ──

class EdaApiLinter {
  constructor(registry) {
    this.registry = registry;
    this.diagnostics = [];

    // 构建反向映射: className → mountName
    this.classToMount = {};
    for (const [mount, cls] of Object.entries(registry.edaMounts)) {
      this.classToMount[cls] = mount;
    }

    // 构建方法查找表: className → Set<methodName(lowercase)>
    this.classMethodsLower = {};
    for (const [cls, data] of Object.entries(registry.classes)) {
      this.classMethodsLower[cls] = new Set(
        (data.methods || []).map(m => m.key.toLowerCase())
      );
    }

    // 构建 mountName → className 映射
    this.mountToClass = { ...registry.edaMounts };

    // 所有合法的 mount 名（小写用于模糊匹配）
    this.validMounts = new Set(Object.keys(registry.edaMounts));
    this.validMountsLower = {};
    for (const m of this.validMounts) {
      this.validMountsLower[m.toLowerCase()] = m;
    }

    // 枚举名集合
    this.validEnums = new Set(Object.keys(registry.enums));

    // 枚举成员映射: EnumName → Set<MemberName>
    this.enumMembers = {};
    for (const [name, data] of Object.entries(registry.enums)) {
      this.enumMembers[name] = new Set((data.members || []).map(m => m.name));
    }

    // 方法签名解析: className → { methodKey → { minArgs, maxArgs, params, returnsPromise } }
    this.methodSignatures = {};
    for (const [cls, data] of Object.entries(registry.classes)) {
      const sigMap = {};
      for (const method of (data.methods || [])) {
        if (!method.signature) continue;
        const parsed = this._parseSignature(method.signature);
        if (parsed) {
          sigMap[method.key.toLowerCase()] = parsed;
        }
      }
      this.methodSignatures[cls] = sigMap;
    }
  }

  /** 从 signature 字符串解析参数信息 */
  _parseSignature(sig) {
    // 提取括号内的参数部分: methodName(params): ReturnType
    const parenMatch = sig.match(/\w+\s*\(([^)]*)\)/);
    if (!parenMatch) return null;

    const paramStr = parenMatch[1].trim();
    if (!paramStr) return { minArgs: 0, maxArgs: 0, params: [], returnsPromise: /\)\s*:\s*Promise\b/.test(sig) };

    // 按逗号分割参数（注意泛型中的逗号）
    const params = [];
    let depth = 0;
    let current = '';
    for (const ch of paramStr) {
      if (ch === '<' || ch === '(') depth++;
      else if (ch === '>' || ch === ')') depth--;
      else if (ch === ',' && depth === 0) {
        params.push(current.trim());
        current = '';
        continue;
      }
      current += ch;
    }
    if (current.trim()) params.push(current.trim());

    const parsed = [];
    let minArgs = 0;
    for (const p of params) {
      const optional = p.includes('?');
      // 提取参数名和类型: name?: Type 或 name: Type
      const typeMatch = p.match(/(\w+)\??\s*:\s*(.+)/);
      const paramName = typeMatch ? typeMatch[1] : p.replace('?', '').trim();
      const paramType = typeMatch ? typeMatch[2].trim() : '';
      // 检测枚举类型参数（E 开头的标识符）
      const enumMatch = paramType.match(/^(E[A-Z]\w+)$/);
      parsed.push({
        name: paramName,
        type: paramType,
        optional,
        enumType: enumMatch ? enumMatch[1] : null,
      });
      if (!optional) minArgs++;
    }

    return { minArgs, maxArgs: parsed.length, params: parsed, returnsPromise: /\)\s*:\s*Promise\b/.test(sig) };
  }

  lint(source, filePath) {
    this.diagnostics = [];
    this.filePath = filePath || '<stdin>';
    const lines = source.split('\n');

    // 全文级检查：未定义函数调用
    this._checkUndefinedFunctions(source, lines);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      this._checkEdaMountAccess(line, lineNum);
      this._checkEdaMethodCall(line, lineNum);
      this._checkEnumUsage(line, lineNum);
      this._checkSchSetStateMisuse(line, lineNum, lines, i);
      this._checkCommonPitfalls(line, lineNum);
    }

    return this.diagnostics;
  }

  /** 规则1: eda.xxx 挂载路径检查 */
  _checkEdaMountAccess(line, lineNum) {
    // 匹配 eda.someProperty
    const regex = /\beda\.(\w+)/g;
    let m;
    while ((m = regex.exec(line)) !== null) {
      const mountName = m[1];
      const col = m.index + 5;

      if (!this.validMounts.has(mountName)) {
        const suggestion = this._findClosestMount(mountName);
        this.diagnostics.push(createDiagnostic(
          lineNum, col, Severity.ERROR,
          `eda.${mountName} does not exist; no "${mountName}" property on EDA class`,
          'invalid-mount',
          suggestion ? `Did you mean eda.${suggestion}?` : null
        ));
      }
    }
  }

  /** 规则2: eda.xxx.method() 方法调用检查 + 传参检查 */
  _checkEdaMethodCall(line, lineNum) {
    const regex = /\beda\.(\w+)\.(\w+)\s*\(/g;
    let m;
    while ((m = regex.exec(line)) !== null) {
      const mountName = m[1];
      const methodName = m[2];
      const col = m.index;

      if (!this.validMounts.has(mountName)) continue;

      const className = this.mountToClass[mountName];
      if (!className) continue;

      const classData = this.registry.classes[className];
      if (!classData) continue;

      const methodsLower = this.classMethodsLower[className];
      if (!methodsLower) continue;

      if (!methodsLower.has(methodName.toLowerCase())) {
        let msg = `Method "${methodName}" does not exist on ${className}`;
        let hint = null;
        const closest = this._findClosestMethod(className, methodName);
        if (closest) {
          hint = `Did you mean "${closest}"?`;
        }
        this.diagnostics.push(createDiagnostic(
          lineNum, col, Severity.ERROR, msg, 'invalid-method', hint
        ));
        continue;
      }

      // ── Param checks ──
      const sigInfo = (this.methodSignatures[className] || {})[methodName.toLowerCase()];
      if (!sigInfo) continue;

      const argsStr = this._extractCallArgs(line, m.index + m[0].length - 1);
      if (argsStr === null) continue;

      const argList = this._splitArgs(argsStr);
      const argCount = (argList.length === 1 && argList[0].trim() === '') ? 0 : argList.length;

      // 规则2a: 参数个数检查
      if (argCount < sigInfo.minArgs) {
        const sigDisplay = sigInfo.params.map(p => p.optional ? `${p.name}?` : p.name).join(', ');
        this.diagnostics.push(createDiagnostic(
          lineNum, col, Severity.ERROR,
          `${className}.${methodName}() requires at least ${sigInfo.minArgs} arg(s), got ${argCount}`,
          'param-count-mismatch',
          `Signature: ${methodName}(${sigDisplay})`
        ));
      } else if (argCount > sigInfo.maxArgs) {
        const sigDisplay = sigInfo.params.map(p => p.optional ? `${p.name}?` : p.name).join(', ');
        this.diagnostics.push(createDiagnostic(
          lineNum, col, Severity.WARNING,
          `${className}.${methodName}() accepts at most ${sigInfo.maxArgs} arg(s), got ${argCount}`,
          'param-count-mismatch',
          `Signature: ${methodName}(${sigDisplay})`
        ));
      }

      // 规则2b: 枚举类型参数检查
      // 规则2c: 基础类型不匹配检查
      for (let i = 0; i < Math.min(argCount, sigInfo.params.length); i++) {
        const paramDef = sigInfo.params[i];
        const argValue = argList[i].trim();
        if (!argValue) continue;

        // 2b: 枚举类型参数检查
        if (paramDef.enumType) {
          const enumUsage = argValue.match(/^(E\w+_\w+)\.(\w+)$/);
          if (enumUsage) {
            const usedEnum = enumUsage[1];
            if (usedEnum !== paramDef.enumType) {
              this.diagnostics.push(createDiagnostic(
                lineNum, col, Severity.WARNING,
                `${className}.${methodName}() param ${i + 1} "${paramDef.name}" expects enum ${paramDef.enumType}, got ${usedEnum}`,
                'param-enum-type',
                `Use ${paramDef.enumType}.xxx`
              ));
            }
          }
          else if (/^['"]/.test(argValue) && this.validEnums.has(paramDef.enumType)) {
            this.diagnostics.push(createDiagnostic(
              lineNum, col, Severity.WARNING,
              `${className}.${methodName}() param ${i + 1} "${paramDef.name}" expects enum ${paramDef.enumType}, got string literal`,
              'param-enum-type',
              `Use ${paramDef.enumType}.xxx instead of string`
            ));
          }
          continue;
        }

        // 2c: 基础类型不匹配检查（仅对字面量值做静态检测）
        const baseType = paramDef.type.toLowerCase().replace(/\s/g, '');
        // 跳过联合类型、泛型、复杂类型
        if (!baseType || /[|<&]/.test(baseType) || baseType === 'any' || baseType === 'unknown') continue;

        const isStringLiteral = /^['"`]/.test(argValue);
        const isNumberLiteral = /^-?\d+(\.\d+)?$/.test(argValue);
        const isBooleanLiteral = /^(true|false)$/.test(argValue);
        const isArrayLiteral = /^\[/.test(argValue);

        if (baseType === 'string' && isNumberLiteral) {
          this.diagnostics.push(createDiagnostic(
            lineNum, col, Severity.WARNING,
            `${className}.${methodName}() param ${i + 1} "${paramDef.name}" expects string, got number ${argValue}`,
            'param-type-mismatch',
            `Pass a string, e.g. "${argValue}"`
          ));
        }
        else if (baseType === 'string' && isBooleanLiteral) {
          this.diagnostics.push(createDiagnostic(
            lineNum, col, Severity.WARNING,
            `${className}.${methodName}() param ${i + 1} "${paramDef.name}" expects string, got boolean ${argValue}`,
            'param-type-mismatch',
            `Pass a string value`
          ));
        }
        else if (baseType === 'number' && isStringLiteral) {
          this.diagnostics.push(createDiagnostic(
            lineNum, col, Severity.WARNING,
            `${className}.${methodName}() param ${i + 1} "${paramDef.name}" expects number, got string`,
            'param-type-mismatch',
            `Pass a number value`
          ));
        }
        else if (baseType === 'number' && isBooleanLiteral) {
          this.diagnostics.push(createDiagnostic(
            lineNum, col, Severity.WARNING,
            `${className}.${methodName}() param ${i + 1} "${paramDef.name}" expects number, got boolean ${argValue}`,
            'param-type-mismatch',
            `Pass a number value`
          ));
        }
        else if (baseType === 'boolean' && isStringLiteral) {
          this.diagnostics.push(createDiagnostic(
            lineNum, col, Severity.WARNING,
            `${className}.${methodName}() param ${i + 1} "${paramDef.name}" expects boolean, got string`,
            'param-type-mismatch',
            `Pass true or false`
          ));
        }
        else if (baseType === 'boolean' && isNumberLiteral) {
          this.diagnostics.push(createDiagnostic(
            lineNum, col, Severity.WARNING,
            `${className}.${methodName}() param ${i + 1} "${paramDef.name}" expects boolean, got number ${argValue}`,
            'param-type-mismatch',
            `Pass true or false`
          ));
        }
        else if (/^(string|number|boolean)$/.test(baseType) && isArrayLiteral) {
          this.diagnostics.push(createDiagnostic(
            lineNum, col, Severity.WARNING,
            `${className}.${methodName}() param ${i + 1} "${paramDef.name}" expects ${paramDef.type}, got array`,
            'param-type-mismatch',
            `Pass a ${paramDef.type} value`
          ));
        }
      }

      // 规则2d: 返回 Promise 的方法缺少 await / .then() 检查
      if (sigInfo.returnsPromise) {
        const beforeCall = line.substring(0, m.index);
        const afterCall = line.substring(m.index + m[0].length);
        const hasAwait = /\bawait\s+$/.test(beforeCall) || /\bawait\s+/.test(beforeCall.split(/[;=(,]/).pop());
        const hasThen = /\)\s*\.then\s*\(/.test(afterCall) || /\)\s*\.catch\s*\(/.test(afterCall);
        const isReturned = /\breturn\s+$/.test(beforeCall.trimEnd()) || /\breturn\s+/.test(beforeCall.split(/[;=(,]/).pop());
        if (!hasAwait && !hasThen && !isReturned) {
          this.diagnostics.push(createDiagnostic(
            lineNum, col, Severity.WARNING,
            `${className}.${methodName}() returns Promise but is not awaited or .then() handled`,
            'missing-await',
            `Add await or use .then() to handle the async result`
          ));
        }
      }
    }
  }

  /** 规则3: 枚举使用检查 */
  _checkEnumUsage(line, lineNum) {
    const regex = /\b(E\w+_\w+)\.(\w+)/g;
    let m;
    while ((m = regex.exec(line)) !== null) {
      const enumName = m[1];
      const memberName = m[2];
      const col = m.index;

      if (!this.validEnums.has(enumName)) {
        const closest = this._findClosestEnum(enumName);
        this.diagnostics.push(createDiagnostic(
          lineNum, col, Severity.ERROR,
          `Enum "${enumName}" does not exist`,
          'invalid-enum',
          closest ? `Did you mean "${closest}"?` : null
        ));
        continue;
      }

      const members = this.enumMembers[enumName];
      if (members && !members.has(memberName)) {
        const validList = [...members].slice(0, 5).join(', ');
        this.diagnostics.push(createDiagnostic(
          lineNum, col, Severity.ERROR,
          `Enum ${enumName} has no member "${memberName}"`,
          'invalid-enum-member',
          `Valid members: ${validList}${members.size > 5 ? '...' : ''}`
        ));
      }
    }
  }

  /** 规则4: SCH setState_* 误用检测 */
  _checkSchSetStateMisuse(line, lineNum, lines, idx) {
    const setStateMatch = line.match(/\.setState_(\w+)\s*\(/);
    if (!setStateMatch) return;

    const context = lines.slice(Math.max(0, idx - 10), idx + 1).join('\n');
    const isSchContext = /\beda\.sch_\w+/.test(context) ||
                         /\bISCH_\w+/.test(context) ||
                         /\bsch_Primitive\w+/.test(context);

    const hasDone = /\.done\s*\(\s*\)/.test(line) ||
                    (idx + 1 < lines.length && /\.done\s*\(\s*\)/.test(lines[idx + 1]));

    if (isSchContext && !hasDone) {
      this.diagnostics.push(createDiagnostic(
        lineNum, setStateMatch.index, Severity.WARNING,
        `SCH primitive setState_* does not commit changes directly; use the modify() method instead`,
        'sch-setstate-misuse',
        `Use eda.sch_PrimitiveXxx.modify(id, { ... }) to modify SCH properties`
      ));
    }
  }

  /** 规则5: 常见错误模式检测 */
  _checkCommonPitfalls(line, lineNum) {
    // 5a: getCurrentDocumentInfo 挂载在错误的类上
    if (/\beda\.sch_Document\.getCurrentDocumentInfo\b/.test(line)) {
      this.diagnostics.push(createDiagnostic(
        lineNum, 0, Severity.ERROR,
        `getCurrentDocumentInfo does not exist on SCH_Document`,
        'wrong-class-mount',
        `Use eda.dmt_SelectControl.getCurrentDocumentInfo()`
      ));
    }

    // 5b: docInfo.type 而非 docInfo.documentType
    if (/\bdocInfo\.type\b/.test(line) || /\.type\s*===?\s*EDMT_EditorDocumentType/.test(line)) {
      this.diagnostics.push(createDiagnostic(
        lineNum, 0, Severity.WARNING,
        `Document type property should be "documentType", not "type"`,
        'wrong-property-name',
        `Use docInfo.documentType`
      ));
    }

    // 5c: window.parent.eda 或 window.eda
    if (/\bwindow\.(parent\.)?eda\b/.test(line)) {
      this.diagnostics.push(createDiagnostic(
        lineNum, 0, Severity.WARNING,
        `Accessing eda via window is not supported; use eda directly`,
        'unnecessary-window-eda',
        `Replace window.eda / window.parent.eda with eda`
      ));
    }

    // 5d: (window as any).__xxx 跨进程传数据
    if (/\(window\s+as\s+any\)\.__\w+/.test(line)) {
      this.diagnostics.push(createDiagnostic(
        lineNum, 0, Severity.WARNING,
        `Main process and iframe have isolated window objects; cannot pass data via window.__xxx`,
        'isolated-window',
        `Use eda.sys_Storage.setExtensionUserConfig() or call eda API directly in iframe`
      ));
    }

    // 5e: console.log 在生产代码中
    if (/\bconsole\.log\s*\(/.test(line)) {
      this.diagnostics.push(createDiagnostic(
        lineNum, 0, Severity.INFO,
        `Avoid console.log in production code; use console.warn or console.error`,
        'no-console-log',
        null
      ));
    }

    // 5f: openIFrame 带查询参数
    if (/openIFrame\s*\([^)]*\?[^)]*\)/.test(line)) {
      this.diagnostics.push(createDiagnostic(
        lineNum, 0, Severity.ERROR,
        `openIFrame path must not contain query parameters`,
        'iframe-query-params',
        `Remove the ? query parameters from the URL`
      ));
    }

    // 5g: getExtensionUserConfig() 不传 key
    if (/getExtensionUserConfig\s*\(\s*\)/.test(line)) {
      this.diagnostics.push(createDiagnostic(
        lineNum, 0, Severity.ERROR,
        `getExtensionUserConfig() requires a key parameter; returns undefined without one`,
        'storage-missing-key',
        `Use getExtensionUserConfig('yourKey')`
      ));
    }

    // 5h: SCH_Primitive / PCB_Primitive 直接调用 getAllPrimitiveId
    if (/\beda\.(sch_Primitive|pcb_Primitive)\.getAllPrimitiveId\b/.test(line)) {
      this.diagnostics.push(createDiagnostic(
        lineNum, 0, Severity.ERROR,
        `SCH_Primitive / PCB_Primitive are abstract classes; getAllPrimitiveId is not available`,
        'abstract-class-method',
        `Use a concrete class, e.g. eda.sch_PrimitiveComponent.getAllPrimitiveId()`
      ));
    }
  }

  /** 规则6: 未定义函数调用检测 */
  _checkUndefinedFunctions(source, lines) {
    // 收集当前文件中定义的函数名

    // function xxx(
    const funcDeclRegex = /\bfunction\s+(\w+)\s*\(/g;
    let m;
    while ((m = funcDeclRegex.exec(source)) !== null) defined.add(m[1]);

    // const/let/var xxx = ( or async (
    const arrowRegex = /\b(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(/g;
    while ((m = arrowRegex.exec(source)) !== null) defined.add(m[1]);

    // const/let/var xxx = async? function
    const funcExprRegex = /\b(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?function/g;
    while ((m = funcExprRegex.exec(source)) !== null) defined.add(m[1]);

    // class xxx
    const classRegex = /\bclass\s+(\w+)/g;
    while ((m = classRegex.exec(source)) !== null) defined.add(m[1]);

    // import 的名称
    const importRegex = /\bimport\s+(?:\{([^}]+)\}|(\w+)|\*\s+as\s+(\w+))/g;
    while ((m = importRegex.exec(source)) !== null) {
      if (m[1]) m[1].split(',').forEach(s => defined.add(s.trim().split(/\s+as\s+/).pop().trim()));
      if (m[2]) defined.add(m[2]);
      if (m[3]) defined.add(m[3]);
    }

    // 内置全局对象和常见 API 白名单
    const builtins = new Set([
      'eda', 'console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
      'Promise', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Math', 'JSON',
      'Date', 'RegExp', 'Map', 'Set', 'Error', 'TypeError', 'parseInt', 'parseFloat',
      'isNaN', 'isFinite', 'encodeURIComponent', 'decodeURIComponent', 'fetch',
      'require', 'module', 'exports', 'alert', 'confirm', 'prompt',
      'document', 'window', 'navigator', 'location', 'history',
      'crypto', 'performance', 'queueMicrotask', 'structuredClone',
      'Blob', 'File', 'FileReader', 'URL', 'URLSearchParams',
      'TextEncoder', 'TextDecoder', 'AbortController', 'FormData',
      'requestAnimationFrame', 'cancelAnimationFrame',
      'addEventListener', 'removeEventListener',
      'Symbol', 'Proxy', 'Reflect', 'WeakMap', 'WeakSet', 'BigInt',
      'Intl', 'globalThis', 'atob', 'btoa',
    ]);

    // 扫描独立函数调用
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*\/\//.test(line) || /^\s*\*/.test(line)) continue;

      const callRegex = /(?<![.\w])(\b[a-zA-Z_]\w*)\s*\(/g;
      let cm;
      while ((cm = callRegex.exec(line)) !== null) {
        const name = cm[1];
        // 跳过关键字
        if (/^(if|else|for|while|switch|catch|return|throw|new|typeof|instanceof|await|async|export|import|from|function|class|const|let|var|try|finally|do|case|break|continue|default|void|delete|in|of|yield|super|this|extends|implements|interface|type|enum|declare|abstract|as|is|keyof|readonly|never|unknown|any|undefined|null|true|false)$/.test(name)) continue;
        // 跳过已定义的和内置的
        if (defined.has(name) || builtins.has(name)) continue;
        // 跳过枚举名（E 开头的大写标识符）
        if (/^E[A-Z]/.test(name)) continue;
        // 跳过类型断言和泛型中的标识符
        if (/^\s*</.test(line.substring(cm.index + cm[0].length))) continue;

        this.diagnostics.push(createDiagnostic(
          i + 1, cm.index, Severity.WARNING,
          `"${name}" is not defined or imported in this file; possibly undefined function call`,
          'undefined-function',
          `Check if "${name}" was removed or needs to be imported`
        ));
      }
    }
  }

  // ── 参数提取辅助 ──

  /** 从调用处的左括号位置提取括号内的参数字符串，返回 null 表示跨行 */
  _extractCallArgs(line, openParenIdx) {
    let depth = 0;
    let start = openParenIdx;
    for (let i = openParenIdx; i < line.length; i++) {
      const ch = line[i];
      if (ch === '(') depth++;
      else if (ch === ')') {
        depth--;
        if (depth === 0) {
          return line.substring(start + 1, i);
        }
      }
    }
    return null; // 括号未闭合（跨行调用）
  }

  /** 按顶层逗号分割参数字符串 */
  _splitArgs(argsStr) {
    const args = [];
    let depth = 0;
    let current = '';
    for (const ch of argsStr) {
      if (ch === '(' || ch === '[' || ch === '{' || ch === '<') depth++;
      else if (ch === ')' || ch === ']' || ch === '}' || ch === '>') depth--;
      else if (ch === ',' && depth === 0) {
        args.push(current);
        current = '';
        continue;
      }
      current += ch;
    }
    args.push(current);
    return args;
  }

  // ── 模糊匹配辅助 ──

  _findClosestMount(name) {
    const lower = name.toLowerCase();
    // 精确小写匹配
    if (this.validMountsLower[lower]) return this.validMountsLower[lower];
    // Levenshtein 距离
    let best = null, bestDist = Infinity;
    for (const m of this.validMounts) {
      const d = levenshtein(lower, m.toLowerCase());
      if (d < bestDist && d <= 3) { bestDist = d; best = m; }
    }
    return best;
  }

  _findClosestMethod(className, methodName) {
    const methods = this.classMethodsLower[className];
    if (!methods) return null;
    const lower = methodName.toLowerCase();
    let best = null, bestDist = Infinity;
    for (const m of methods) {
      const d = levenshtein(lower, m);
      if (d < bestDist && d <= 3) { bestDist = d; best = m; }
    }
    // 返回原始大小写的方法名
    if (best) {
      const classData = this.registry.classes[className];
      const found = (classData.methods || []).find(m => m.key.toLowerCase() === best);
      return found ? found.name : best;
    }
    return null;
  }

  _findMethodInOtherClass(methodName) {
    const lower = methodName.toLowerCase();
    for (const [cls, methods] of Object.entries(this.classMethodsLower)) {
      if (methods.has(lower)) {
        const mount = this.classToMount[cls];
        if (mount) return { className: cls, mount };
      }
    }
    return null;
  }

  _findClosestEnum(name) {
    let best = null, bestDist = Infinity;
    for (const e of this.validEnums) {
      const d = levenshtein(name.toLowerCase(), e.toLowerCase());
      if (d < bestDist && d <= 4) { bestDist = d; best = e; }
    }
    return best;
  }
}

// ── Levenshtein 距离 ──

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ── 输出格式化 ──

function formatDiagnostics(diagnostics, filePath) {
  if (diagnostics.length === 0) {
    return `[PASS] ${filePath}: No EDA API issues found`;
  }

  const errors = diagnostics.filter(d => d.severity === Severity.ERROR);
  const warnings = diagnostics.filter(d => d.severity === Severity.WARNING);
  const infos = diagnostics.filter(d => d.severity === Severity.INFO);

  const lines = [`\n[REPORT] ${filePath}: ${diagnostics.length} issue(s) (${errors.length} error, ${warnings.length} warning, ${infos.length} info)\n`];

  const icons = { error: '[ERROR]', warning: '[WARN]', info: '[INFO]' };

  for (const d of diagnostics) {
    lines.push(`  ${icons[d.severity]} L${d.line}:${d.col}  ${d.message}  [${d.rule}]`);
    if (d.suggestion) {
      lines.push(`     [HINT] ${d.suggestion}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

// ── HTML <script> 提取 ──

/** 从 HTML 中提取所有 <script> 标签的内容及其起始行号 */
function extractScriptsFromHtml(html) {
  const segments = [];
  const regex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const scriptContent = m[1];
    if (!scriptContent.trim()) continue;
    // 计算 <script> 标签所在行号
    const beforeScript = html.substring(0, m.index);
    const lineOffset = beforeScript.split('\n').length;
    segments.push({ source: scriptContent, lineOffset });
  }
  return segments;
}

// ── HTML 标记级检查 ──

/** 检查 HTML 标记中的资源路径等问题（仅 iframe/ 目录下的文件） */
function lintHtmlMarkup(html, filePath) {
  const diagnostics = [];

  // 只检查 iframe/ 目录下的 HTML 文件
  const normalized = filePath.replace(/\\/g, '/');
  if (!/(^|\/)iframe\//.test(normalized)) return diagnostics;

  const lines = html.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // 检查 href/src 使用相对路径 (./ 或 ../)
    const relPathRegex = /(href|src)\s*=\s*["'](\.\.?\/[^"']+)["']/g;
    let relPathMatch;
    while ((relPathMatch = relPathRegex.exec(line)) !== null) {
      const relPath = relPathMatch[2];
      const fileName = relPath.split('/').pop();
      diagnostics.push(createDiagnostic(
        lineNum, relPathMatch.index, Severity.ERROR,
        `Relative path "${relPath}" is not allowed in iframe resources; use absolute path`,
        'iframe-relative-path',
        `Use absolute path, e.g. /iframe/${fileName}`
      ));
    }
  }

  return diagnostics;
}

// ── 递归扫描目录 ──

/** 递归收集目录下所有 .ts / .html 文件 */
function collectFiles(dir, result) {
  result = result || [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'build' || entry.name === 'dist') continue;
      collectFiles(full, result);
    } else if (/\.(ts|html?)$/i.test(entry.name)) {
      result.push(full);
    }
  }
  return result;
}

/** 将参数列表中的目录展开为文件列表 */
function resolveInputs(inputs) {
  const files = [];
  for (const input of inputs) {
    if (!fs.existsSync(input)) {
      console.error(`Path not found: ${input}`);
      continue;
    }
    if (fs.statSync(input).isDirectory()) {
      collectFiles(input, files);
    } else {
      files.push(input);
    }
  }
  return files;
}

// ── CLI 入口 ──

function main() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes('--json');
  const inputs = args.filter(a => !a.startsWith('--'));

  if (inputs.length === 0) {
    console.log('Usage: node lint-eda-api.js <file-or-dir> [...] [--json]');
    console.log('');
    console.log('  File: lint the specified file');
    console.log('  Directory: recursively lint all .ts / .html files');
    console.log('');
    console.log('First run: node scripts/build-registry.js');
    process.exit(0);
  }

  const files = resolveInputs(inputs);
  if (files.length === 0) {
    console.log('No .ts / .html files found');
    process.exit(0);
  }

  const registry = loadRegistry();
  const linter = new EdaApiLinter(registry);
  let totalErrors = 0;

  const allResults = {};

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    const isHtml = /\.html?$/i.test(file);
    const segments = isHtml ? extractScriptsFromHtml(raw) : [{ source: raw, lineOffset: 0 }];

    let diagnostics = [];

    // HTML 文件：对整个文件做 HTML 级别检查（资源路径等）
    if (isHtml) {
      diagnostics = diagnostics.concat(lintHtmlMarkup(raw, file));
    }

    for (const seg of segments) {
      const d = linter.lint(seg.source, file);
      // 修正行号偏移（HTML 内嵌脚本）
      if (seg.lineOffset > 0) {
        for (const item of d) { item.line += seg.lineOffset; }
      }
      diagnostics = diagnostics.concat(d);
    }
    totalErrors += diagnostics.filter(d => d.severity === Severity.ERROR).length;

    if (jsonMode) {
      allResults[file] = diagnostics;
    } else {
      console.log(formatDiagnostics(diagnostics, file));
    }
  }

  if (jsonMode) {
    console.log(JSON.stringify(allResults, null, 2));
  }

  // 有 error 级别问题时退出码为 1
  process.exit(totalErrors > 0 ? 1 : 0);
}

main();
