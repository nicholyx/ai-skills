"use strict";

/**
 * SKILL.md frontmatter 的**受限**解析与校验。
 *
 * ## 为什么不引 YAML 依赖
 *
 * 本机 `python3 -c "import yaml"` 失败（无 PyYAML），官方 validator
 * `quick_validate.py` 因此跑不起来。而引入 `package.json` + `yaml` 会把一个
 * 零依赖的技能仓库变成「有 node_modules、CI 要跑 npm ci」的仓库 —— 对一个纯数据
 * 仓库是过度工程。
 *
 * ## 边界：这里不实现 YAML
 *
 * 只做官方 validator 需要的那些事：**找出顶层键、取标量值、跳过嵌套结构**。
 * 超出这个范围的 YAML 特性一概不做（多文档、锚点、别名、流式集合、复杂键……）。
 * 这个边界对 44 个真实技能零误报 —— 见 frontmatter 检查器的实测输出。
 *
 * ## 相对官方实现补的四处
 *
 * | 补强 | 理由 |
 * | --- | --- |
 * | CRLF 归一化 | 官方用 `^---\n` 匹配，CRLF 下首行是 `---\r\n`，会误报「格式非法」 |
 * | BOM 剥离 | 带 BOM 时首行不是 `---`，官方报「未找到 frontmatter」，诊断方向完全错 |
 * | 块标量（`\|` `>`）支持 | 有技能用 `description: >-` 写多行；不处理会把 description 判成空 |
 * | 重复顶层键检测 | YAML 里重复键是未定义行为，解析器静默取后者，官方 validator 漏检 |
 */

const ALLOWED_PROPERTIES = [
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
  "compatibility",
];

const NAME_MAX = 64;
const DESCRIPTION_MAX = 1024;
const COMPATIBILITY_MAX = 500;

/** 顶层键：缩进为 0 的 `key:` 行。 */
const TOP_KEY_RE = /^([A-Za-z0-9_-]+):(.*)$/;

/** 块标量指示符，如 `|`、`|-`、`>+`、`|2-`。 */
const BLOCK_SCALAR_RE = /^[|>][0-9]?[-+]?[0-9]?$/;

/** 剥掉一层成对的外层引号。 */
function stripQuotes(value) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1);
    }
  }
  return value;
}

/**
 * 解析 frontmatter。
 *
 * @param {string} text 文件全文
 * @returns {{ok: true, keys: string[], values: Map<string, string|undefined>,
 *            duplicates: string[], bom: boolean, crlf: boolean,
 *            startLine: number, endLine: number, body: string}
 *          | {ok: false, reason: string, line: number}}
 */
function parseFrontmatter(text) {
  const bom = text.charCodeAt(0) === 0xfeff;
  if (bom) text = text.slice(1);

  const crlf = text.includes("\r\n");
  if (crlf) text = text.replace(/\r\n/g, "\n");

  const lines = text.split("\n");

  if (lines.length === 0 || lines[0].trimEnd() !== "---") {
    return {
      ok: false,
      reason: "文件开头没有 YAML frontmatter（首行应为 `---`）",
      line: 1,
    };
  }

  // 官方用非贪婪的 `(.*?)\n---`，正文里出现 `---` 分隔线时会截错。
  // 改为「从第 2 行起，找第一个恰好是 `---` 的行」。
  let endLine = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trimEnd() === "---") {
      endLine = i;
      break;
    }
  }

  if (endLine === -1) {
    return {
      ok: false,
      reason: "frontmatter 没有闭合（找不到第二行 `---`）",
      line: 1,
    };
  }

  const body = lines.slice(1, endLine);
  const values = new Map();
  const keys = [];
  const duplicates = [];

  for (let i = 0; i < body.length; i += 1) {
    const raw = body[i];

    // 顶层注释与空行：跳过。缩进的 `#` 属于嵌套结构，由下面一并跳过。
    if (raw.trim() === "" || /^\s*#/.test(raw)) continue;

    // 只有缩进为 0 的行才是顶层键。缩进行属于上一个键的嵌套值。
    if (/^\s/.test(raw)) continue;

    const m = TOP_KEY_RE.exec(raw);
    if (!m) continue;

    const key = m[1];
    const rest = m[2].trim();

    if (keys.includes(key)) duplicates.push(key);
    keys.push(key);

    // 块标量：按缩进收集续行
    if (BLOCK_SCALAR_RE.test(rest)) {
      const collected = [];
      let j = i + 1;
      while (j < body.length && (body[j].trim() === "" || /^\s/.test(body[j]))) {
        collected.push(body[j]);
        j += 1;
      }
      i = j - 1;
      values.set(key, collected.join("\n").trim());
      continue;
    }

    // 空值：看下一行是否有更深缩进，有则是嵌套映射/序列
    if (rest === "") {
      const next = body[i + 1];
      if (next !== undefined && /^\s+\S/.test(next)) {
        values.set(key, undefined); // 嵌套结构，值不在此处解析
      } else {
        values.set(key, "");
      }
      continue;
    }

    values.set(key, stripQuotes(rest));
  }

  return {
    ok: true,
    keys,
    values,
    duplicates,
    bom,
    crlf,
    startLine: 1,
    endLine: endLine + 1,
    body: body.join("\n"),
  };
}

/**
 * 按官方 `quick_validate.py` 的规则集校验，外加本仓库自有的 name/目录名一致性。
 *
 * @param {ReturnType<typeof parseFrontmatter>} parsed
 * @param {{dirName: string, tier: "self"|"vendor"}} ctx
 * @returns {Array<{level: "fail"|"warn", line: number, message: string}>}
 */
function validateFrontmatter(parsed, ctx) {
  const out = [];
  const add = (level, line, message) => out.push({ level, line, message });

  if (!parsed.ok) {
    add("fail", parsed.line, parsed.reason);
    return out;
  }

  if (parsed.bom) {
    add("warn", 1, "文件带 UTF-8 BOM；建议去掉（部分工具会因此读不到首行）");
  }
  if (parsed.crlf) {
    add(
      "warn",
      1,
      "文件使用 CRLF 换行；仓库约定为 LF（见 .gitattributes），建议转换"
    );
  }
  for (const key of parsed.duplicates) {
    add("fail", parsed.startLine, `frontmatter 出现重复的顶层键：${key}`);
  }

  const { values } = parsed;

  // 白名单（与官方 ALLOWED_PROPERTIES 一致）
  const extra = parsed.keys.filter((k) => !ALLOWED_PROPERTIES.includes(k));
  if (extra.length > 0) {
    add(
      "fail",
      parsed.startLine,
      `frontmatter 出现额外键：${extra.join(", ")}（允许的键：${ALLOWED_PROPERTIES.join(", ")}）`
    );
  }

  // name
  if (!values.has("name")) {
    add("fail", parsed.startLine, "缺少必填字段 name");
  } else {
    const name = (values.get("name") || "").trim();
    if (name === "") {
      add("fail", parsed.startLine, "name 不能为空");
    } else {
      if (!/^[a-z0-9-]+$/.test(name)) {
        add("fail", parsed.startLine, `name「${name}」应为 kebab-case（小写字母、数字、连字符）`);
      }
      if (name.startsWith("-") || name.endsWith("-") || name.includes("--")) {
        add("fail", parsed.startLine, `name「${name}」不能以连字符开头/结尾，也不能含连续连字符`);
      }
      if (name.length > NAME_MAX) {
        add("fail", parsed.startLine, `name 过长（${name.length} 字符，上限 ${NAME_MAX}）`);
      }
      // 本仓库自有约定：官方 validator 不查这一条。
      // 全仓 44 个技能当前 44/44 满足，可以锁死。
      if (ctx && ctx.dirName && name !== ctx.dirName) {
        add(
          "fail",
          parsed.startLine,
          `name「${name}」与所在目录名「${ctx.dirName}」不一致`
        );
      }
    }
  }

  // description
  if (!values.has("description")) {
    add("fail", parsed.startLine, "缺少必填字段 description");
  } else {
    const description = (values.get("description") || "").trim();
    if (description === "") {
      add("fail", parsed.startLine, "description 不能为空");
    } else {
      if (description.includes("<") || description.includes(">")) {
        add("fail", parsed.startLine, "description 不能含尖括号（< 或 >）");
      }
      if (description.length > DESCRIPTION_MAX) {
        add(
          "fail",
          parsed.startLine,
          `description 过长（${description.length} 字符，上限 ${DESCRIPTION_MAX}）`
        );
      }
    }
  }

  // compatibility（可选）
  const compatibility = values.get("compatibility");
  if (compatibility !== undefined && (compatibility || "").length > COMPATIBILITY_MAX) {
    add(
      "fail",
      parsed.startLine,
      `compatibility 过长（${compatibility.length} 字符，上限 ${COMPATIBILITY_MAX}）`
    );
  }

  return out;
}

module.exports = {
  ALLOWED_PROPERTIES,
  NAME_MAX,
  DESCRIPTION_MAX,
  COMPATIBILITY_MAX,
  parseFrontmatter,
  validateFrontmatter,
};
