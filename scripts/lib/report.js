"use strict";

/**
 * 检查器共用的结果收集、输出与退出码。
 *
 * ## 退出码语义（全仓统一，lint.sh 与 CI 都依赖）
 *
 * | 码 | 含义 | CI 行为 |
 * | --- | --- | --- |
 * | 0 | 检查执行完成，无 fail 级问题（可能有 warn） | success |
 * | 1 | 检查执行完成，存在 fail 级问题 | failure |
 * | 2 | **检查未能执行**（目标集为空 / 不在 git 仓库内 / 输入非法） | failure |
 *
 * 2 是相对「把环境问题也算 fail」的改进：读者要能分清「你要改代码」和
 * 「你要装东西 / 换个目录再跑」。CI 那边 1 和 2 都是红，一样不放过。
 *
 * ## 分级：为什么 vendor 是 warn 而不是排除
 *
 * `.agents/**` 是 `npx skills add` 装来的上游技能，**任何自动修复都会在
 * `npx skills update` 时丢失**。所以那里的问题不能设成 fail —— 那会让 CI 永久红。
 *
 * 但也不排除。排除等于看不见：上游下次引入一个「缺 name」或「description 含
 * 控制字符」的技能，恰恰会让它在 Claude Code 里加载失败 —— 而这个仓库的**唯一
 * 用途**就是「这些技能能被加载」。warn 的代价只是每次多几行输出。
 *
 * 本地与 CI 采用**同一套分级**，所以「本地绿 = CI 绿」在分级语义上仍然成立。
 * `VENDOR_STRICT=1`（或 `--strict-vendor`）可把 vendor 级 warn 提升为 fail，
 * 供上游修好之后收紧，不必改代码。
 */

const useColor =
  process.stdout.isTTY === true && !process.env.NO_COLOR && !process.env.CI;

const C = useColor
  ? { red: "\u001b[31m", green: "\u001b[32m", yellow: "\u001b[33m",
      blue: "\u001b[34m", bold: "\u001b[1m", dim: "\u001b[2m", reset: "\u001b[0m" }
  : { red: "", green: "", yellow: "", blue: "", bold: "", dim: "", reset: "" };

class Report {
  constructor(name) {
    this.name = name;
    this.findings = []; // {tier, file, line, message, level}
    this.infos = [];
    this.strictVendor =
      process.env.VENDOR_STRICT === "1" || process.argv.includes("--strict-vendor");
  }

  /** 按 tier 自动分级：self → fail，vendor → warn（strictVendor 时也 fail）。 */
  at(tier, file, line, message) {
    const level = tier === "vendor" ? (this.strictVendor ? "fail" : "warn") : "fail";
    this.findings.push({ tier, file, line, message, level });
  }

  /** 无条件 warn（与 tier 无关，如 BOM、CRLF 这类风格提示）。 */
  warn(file, line, message) {
    this.findings.push({ tier: "self", file, line, message, level: "warn" });
  }

  /** 无条件 fail（与 tier 无关，如 JSON 语法错误 —— 那没有「上游风格」的解释空间）。 */
  fail(file, line, message) {
    this.findings.push({ tier: "self", file, line, message, level: "fail" });
  }

  info(message) {
    this.infos.push(message);
  }

  /** 检查根本没法执行。退出 2，lint.sh 会把它单列为「环境问题」。 */
  abort(message) {
    process.stderr.write(`${C.red}✗ ${this.name}：未能执行${C.reset}\n`);
    process.stderr.write(`  ${message}\n`);
    process.exit(2);
  }

  /** 打印并退出。0 = 无 fail 级问题；1 = 有。 */
  finish() {
    const fails = this.findings.filter((f) => f.level === "fail");
    const warns = this.findings.filter((f) => f.level === "warn");

    // 由 lint.sh 调用时标题与结果行都不打：那边会打自己的。
    // 直接运行检查器（CI 里就是这样）时保留，日志才自解释。
    if (!process.env.LINT_QUIET) {
      process.stdout.write(`${C.bold}▶ ${this.name}${C.reset}\n`);
    }

    const fmt = (f, icon, color) => {
      const loc = f.line ? `${f.file}:${f.line}` : f.file;
      const suffix =
        f.tier === "vendor" && !this.strictVendor
          ? `${C.dim}（上游 vendored，不阻塞）${C.reset}`
          : "";
      process.stdout.write(`  ${color}${icon}${C.reset} ${loc}  ${f.message}${suffix}\n`);
    };

    for (const f of fails) fmt(f, "✗", C.red);
    for (const f of warns) fmt(f, "⚠", C.yellow);
    for (const i of this.infos) process.stdout.write(`  ${C.blue}ⓘ${C.reset} ${i}\n`);

    // 结果行同样交给 lint.sh 去打，避免出现两个「✓ 通过」。
    if (!process.env.LINT_QUIET) {
      if (warns.length === 0) {
        process.stdout.write(`  ${C.green}✓ 通过${C.reset}\n`);
      } else {
        // 「上游遗留」与「自建内容的提示」是两回事：前者我们无权修（改了会在
        // npx skills update 时丢失），后者是待办。混成一句话会让读者以为
        // 自建内容的问题也被放行了。
        const vendorWarns = warns.filter((w) => w.tier === "vendor").length;
        const selfWarns = warns.length - vendorWarns;
        const parts = [];
        if (selfWarns > 0) parts.push(`${selfWarns} 处提示（待处理）`);
        if (vendorWarns > 0) parts.push(`${vendorWarns} 处上游遗留（不计入退出码）`);
        process.stdout.write(
          `  ${C.green}✓ 通过${C.reset}${C.dim}（${parts.join("，")}）${C.reset}\n`
        );
      }
    }

    // vendor 的「不阻塞」必须每次都说清楚，否则读者会以为上游那几处已经修好了。
    if (warns.length > 0 && warns.some((w) => w.tier === "vendor")) {
      process.stdout.write(
        `  ${C.dim}上游 vendored 技能的问题不计入退出码：修复会在 npx skills update 时丢失。${C.reset}\n`
      );
      process.stdout.write(
        `  ${C.dim}需要严格检查时用 VENDOR_STRICT=1。${C.reset}\n`
      );
    }

    process.exit(fails.length > 0 ? 1 : 0);
  }
}

module.exports = { Report, useColor, C };
