#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const skillsDir = path.join(rootDir, ".agents", "skills");
const lockFile = path.join(rootDir, "skills-lock.json");
const outputFile = path.join(rootDir, "local-skills.json");

// 读取 skills-lock.json
const lock = JSON.parse(fs.readFileSync(lockFile, "utf-8"));
const lockedSkills = new Set(Object.keys(lock.skills || {}));

// 扫描 .agents/skills 目录
const localSkills = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

// 组装在 lock 中的 skill 信息（含 GitHub 地址）
const locked = localSkills
  .filter((name) => lockedSkills.has(name))
  .map((name) => {
    const info = lock.skills[name];
    const githubUrl = info.sourceType === "github"
      ? `https://github.com/${info.source}`
      : null;
    return {
      name,
      source: info.source,
      sourceType: info.sourceType,
      githubUrl,
      skillPath: info.skillPath,
    };
  });

// 找出不在 lock 中的 skill
const notLocked = localSkills
  .filter((name) => !lockedSkills.has(name))
  .map((name) => {
    const skillDir = path.join(skillsDir, name);
    const skillMd = path.join(skillDir, "SKILL.md");
    return {
      name,
      hasSkillMd: fs.existsSync(skillMd),
      files: fs.readdirSync(skillDir),
    };
  });

const result = {
  generatedAt: new Date().toISOString(),
  totalLocalSkills: localSkills.length,
  totalLockedSkills: lockedSkills.size,
  githubSkills: locked,
  localOnlySkills: notLocked,
  localOnlyCount: notLocked.length,
};

fs.writeFileSync(outputFile, JSON.stringify(result, null, 2) + "\n");

console.log(`共 ${localSkills.length} 个本地 skill，${lockedSkills.size} 个来自 GitHub，${notLocked.length} 个仅本地`);
console.log("\n来自 GitHub 的 skill:");
locked.forEach((s) => console.log(`  - ${s.name}: ${s.githubUrl}`));
console.log("\n仅本地的 skill:");
notLocked.forEach((s) => console.log(`  - ${s.name}`));
console.log(`\n结果已写入: ${outputFile}`);
