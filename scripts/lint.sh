#!/usr/bin/env bash
#
# lint.sh —— 本地统一校验入口
#
# 一条命令跑完 CI 里**本地能跑**的那些静态检查。提交 PR 之前跑一次，
# 可以把「推上去 -> CI 红 -> 改了再推」这个来回省掉。
#
# 用法：
#   ./scripts/lint.sh                    # 跑全部检查
#   ./scripts/lint.sh --list             # 只列检查项 id 与显示名
#   ./scripts/lint.sh --only links,hygiene
#   ./scripts/lint.sh --skip zizmor      # 需要 docker 的那项可以跳过
#   ./scripts/lint.sh --commits origin/main..HEAD   # 追加提交信息校验
#
# 覆盖范围（别把它当成 CI 的替代品）：
#   - 覆盖：技能 frontmatter、evals.json 结构、上游 lock 一致性、编码与 JSON、
#     相对链接、脚本语法、shellcheck、actionlint、yamllint、zizmor
#   - **不覆盖：PR 标题**。CI 的 commit-messages job 校验 PR 里的提交**与 PR 标题**，
#     而标题在 PR 建立之前根本不存在。加了 --commits 也只补齐前半段，
#     **标题仍然验不了** —— 本地全绿不等于 commit-messages 会绿
#   - **不覆盖：上游 `.agents/**` 的实质违规**。那是 npx skills add 装来的内容，
#     任何自动修复都会在 npx skills update 时丢失。那里的问题只 warn、不计入退出码
#     （见 scripts/lib/report.js）。本地全绿时上游的 3 处 frontmatter 额外键仍在，
#     这是设计，不是漏检
#   - **不覆盖：外链可达性**。只查相对链接，http/https 一律不探网
#   - **不覆盖：GitHub 侧设置**（分支保护、标签、Discussions）
#   - **不覆盖：技能的行为正确性**。evals.json 只查结构，不跑断言
#
# 前提：本仓库的检查器**以 git 索引为目标集**，因此必须在克隆出来的仓库里运行。
# 从 GitHub 的 source tarball 解压出来的目录没有 .git，检查会明确失败并说明原因
# —— 那是拒绝执行，不是崩溃。
#
# 缺失的工具会被跳过并给出安装方式，不会中断；跳过项一律显式列出，不计入通过。
# 工具在、但检查跑不起来，算**失败**不算跳过 —— 静默跳过与通过无法区分。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_DIR
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly PROJECT_ROOT

cd "$PROJECT_ROOT"

# 检查器自己会打「▶ 显示名」和「✓ 通过」。从 lint.sh 调用时这两行都是重复的
# （本脚本的 run_check 已经打了），所以让它们安静；直接运行时仍然保留。
export LINT_QUIET=1

if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
  C_RED=$'\033[31m'; C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'
  C_BLUE=$'\033[34m'; C_BOLD=$'\033[1m'; C_DIM=$'\033[2m'; C_RESET=$'\033[0m'
else
  C_RED=""; C_GREEN=""; C_YELLOW=""; C_BLUE=""; C_BOLD=""; C_DIM=""; C_RESET=""
fi

# ---------------------------------------------------------------------------
# 命令行参数
# ---------------------------------------------------------------------------
ONLY=""
SKIP=""
COMMITS=""

usage() {
  cat <<'EOF'
lint.sh —— 本地统一校验入口

用法：
  ./scripts/lint.sh [选项]

选项：
  --only <id,...>     只跑指定的检查项
  --skip <id,...>     跳过指定的检查项
  --list              只列出检查项 id 与显示名，不执行
  --commits <区间>    追加提交信息校验（如 origin/main..HEAD）
  -h, --help          显示帮助

检查项 id 见 ./scripts/lint.sh --list
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --only)    ONLY="${2:?--only 需要参数}"; shift 2 ;;
    --skip)    SKIP="${2:?--skip 需要参数}"; shift 2 ;;
    --commits) COMMITS="${2:?--commits 需要参数}"; shift 2 ;;
    --list)    LIST_ONLY=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "未知参数：$1" >&2; usage >&2; exit 1 ;;
  esac
done

# 检查项注册表：id:显示名。顺序即执行顺序。
CHECKS=(
  "frontmatter:技能 frontmatter 校验"
  "evals:evals.json 结构校验"
  "vendor-lock:上游技能 lock 一致性"
  "hygiene:编码与 JSON 校验"
  "links:相对链接校验"
  "scripts:脚本语法检查"
  "shellcheck:shellcheck（Shell 静态分析）"
  "actionlint:actionlint（工作流静态检查）"
  "yamllint:yamllint（YAML 风格）"
  "zizmor:zizmor（工作流安全扫描）"
)

known_id() {
  local needle="$1" spec
  for spec in "${CHECKS[@]}"; do
    [[ "${spec%%:*}" == "$needle" ]] && return 0
  done
  return 1
}

if [[ -n "${LIST_ONLY:-}" ]]; then
  for spec in "${CHECKS[@]}"; do
    printf '%s\t%s\n' "${spec%%:*}" "${spec#*:}"
  done
  exit 0
fi

# 校验 --only / --skip 里的 id：写错一个字母会让整轮检查静默少跑，必须拦下
for _list in "$ONLY" "$SKIP"; do
  [[ -z "$_list" ]] && continue
  _old_ifs="$IFS"; IFS=','
  for _id in $_list; do
    IFS="$_old_ifs"
    if ! known_id "$_id"; then
      echo "未知的检查项 id：$_id（用 --list 查看全部）" >&2
      exit 1
    fi
    IFS=','
  done
  IFS="$_old_ifs"
done

list_contains() {
  local list="$1" needle="$2" item
  [[ -z "$list" ]] && return 1
  local old_ifs="$IFS"
  IFS=','
  for item in $list; do
    if [[ "$item" == "$needle" ]]; then IFS="$old_ifs"; return 0; fi
  done
  IFS="$old_ifs"
  return 1
}

should_run() {
  local id="$1"
  [[ -n "$ONLY" ]] && ! list_contains "$ONLY" "$id" && return 1
  list_contains "$SKIP" "$id" && return 1
  return 0
}

# ---------------------------------------------------------------------------
# CI 里的版本 pin —— 唯一真源是 .github/workflows/ci.yml 的 env:
# 在这里写第二份，CI 升级时就会静默漂移，而这一项的全部价值正是「本地过 = CI 过」。
# ---------------------------------------------------------------------------
ci_env() {
  local key="$1"
  [[ -f .github/workflows/ci.yml ]] || return 0
  sed -n "s/^  ${key}: *\"\([^\"]*\)\".*/\1/p" .github/workflows/ci.yml | head -n 1
}

ACTIONLINT_VERSION="$(ci_env ACTIONLINT_VERSION)"
SHELLCHECK_VERSION="$(ci_env SHELLCHECK_VERSION)"
YAMLLINT_VERSION="$(ci_env YAMLLINT_VERSION)"
ZIZMOR_VERSION="$(ci_env ZIZMOR_VERSION)"
readonly ACTIONLINT_VERSION SHELLCHECK_VERSION YAMLLINT_VERSION ZIZMOR_VERSION

# ---------------------------------------------------------------------------
# 计数与结果收集
# ---------------------------------------------------------------------------
PASSED=0
FAILED=0
SKIPPED=0
# 跑了、但**不是 CI 同源**的项（多半是本机工具版本与 CI pin 不一致）。
# 三计数分不出它们：都计在 PASSED 里，而两者可信度不同。
declare -a NONSYNC_NOTES=()
# 跑不起来（退出码 2）的项。与「工具没装」分开：读者要能分清
# 「你要改代码」和「你要装东西 / 换个目录再跑」。
declare -a ABORTED_NAMES=()
declare -a FAILED_NAMES=()

run_check() {
  local name="$1"; shift
  printf '\n%s▶ %s%s\n' "$C_BOLD" "$name" "$C_RESET"
  printf '  %s$ %s%s\n' "$C_BLUE" "$*" "$C_RESET"

  local rc=0
  "$@" || rc=$?

  case "$rc" in
    0) printf '  %s✓ 通过%s\n' "$C_GREEN" "$C_RESET"
       PASSED=$((PASSED + 1)) ;;
    2) printf '  %s✗ 未能执行（退出码 2）%s\n' "$C_RED" "$C_RESET"
       FAILED=$((FAILED + 1)); ABORTED_NAMES+=("$name") ;;
    *) printf '  %s✗ 失败%s\n' "$C_RED" "$C_RESET"
       FAILED=$((FAILED + 1)); FAILED_NAMES+=("$name") ;;
  esac
  return 0
}

skip_check() {
  local name="$1" reason="$2" hint="${3:-}"
  printf '\n%s▶ %s%s\n' "$C_BOLD" "$name" "$C_RESET"
  printf '  %s⚠ 已跳过：%s%s\n' "$C_YELLOW" "$reason" "$C_RESET"
  if [[ -n "$hint" ]]; then
    printf '  %s  安装方式：%s%s\n' "$C_YELLOW" "$hint" "$C_RESET"
  fi
  SKIPPED=$((SKIPPED + 1))
}

# 工具在、但这一项根本没法跑成。与「工具不在」是两回事：
# 跳过会把问题藏起来，而它会和「检查通过」长得一样。
fail_check() {
  local name="$1" reason="$2" hint="${3:-}"
  printf '\n%s▶ %s%s\n' "$C_BOLD" "$name" "$C_RESET"
  printf '  %s✗ 失败：%s%s\n' "$C_RED" "$reason" "$C_RESET"
  if [[ -n "$hint" ]]; then
    printf '  %s  %s%s\n' "$C_RED" "$hint" "$C_RESET"
  fi
  FAILED=$((FAILED + 1))
  FAILED_NAMES+=("$name")
}

note() {
  printf '  %sⓘ %s%s\n' "$C_BLUE" "$1" "$C_RESET"
}

# 本机工具版本与 CI pin 不一致时记一笔 —— 这不是「失败」，而是「这个通过的可信度
# 与 CI 的通过不同」—— 而三计数分不出这个区别（都计在 PASSED 里）。
record_version_drift() {
  local name="$1" pin="$2" local_version="$3"
  if [[ -n "$pin" && -n "$local_version" && "$pin" != "$local_version" ]]; then
    NONSYNC_NOTES+=("${name}（本机 ${local_version}，CI pin ${pin}）")
  fi
}

# ---------------------------------------------------------------------------
# 外部工具的检查项
# ---------------------------------------------------------------------------

# Shell 静态分析只跑 scripts/ 下的自建脚本。上游的 .sh 里有几个是 sh 而非 bash，
# 方言不一，且它们的告警我们无权修（会在 npx skills update 时丢失）。
# 那些脚本的**语法**由 scripts/checks/scripts.js 覆盖（按 shebang 选方言）。
#
# 注意：本注释块里**不能出现 shellcheck 指令字样**——它会被当成真指令解析，
# 触发莫名的 SC1072/SC1073。措辞已避开。
check_shellcheck() {
  local name="$1"
  local -a targets=()
  while IFS= read -r f; do targets+=("$f"); done < <(find scripts -name '*.sh' 2>/dev/null | sort)

  if ! command -v shellcheck >/dev/null 2>&1; then
    skip_check "$name" "未安装 shellcheck" "brew install shellcheck"
    return 0
  fi
  if [[ ${#targets[@]} -eq 0 ]]; then
    fail_check "$name" "scripts/ 下没有找到任何 .sh 文件" \
      "目标集为空意味着这一项什么都没检查，却和「通过」长得一样。"
    return 0
  fi

  run_check "$name" shellcheck -x "${targets[@]}"
  record_version_drift "$name" "$SHELLCHECK_VERSION" \
    "$(shellcheck --version 2>/dev/null | sed -n 's/^version: //p' || true)"
}

# actionlint 显式传工作流文件列表，不裸跑：裸跑时它靠 .git 定位项目根，
# 在不含 .git 的目录里会直接报错。目标集**只收 .github/workflows/ 下的**，
# 不能复用 yamllint 的目标集 —— dependabot.yml / ISSUE_TEMPLATE/*.yml 不是工作流，
# 喂给 actionlint 会报「"jobs" section is missing in workflow」。
check_actionlint() {
  local name="$1"
  local -a targets=()
  while IFS= read -r f; do targets+=("$f"); done \
    < <(find .github/workflows \( -name '*.yml' -o -name '*.yaml' \) 2>/dev/null | sort)

  if ! command -v actionlint >/dev/null 2>&1; then
    skip_check "$name" "未安装 actionlint" \
      "brew install actionlint  或  go install github.com/rhysd/actionlint/cmd/actionlint@latest"
    return 0
  fi
  if [[ ${#targets[@]} -eq 0 ]]; then
    fail_check "$name" "没有找到任何工作流文件（.github/workflows/*.yml）" \
      "actionlint 拿不到文件就不会检查任何东西。"
    return 0
  fi

  run_check "$name" actionlint -color "${targets[@]}"
  record_version_drift "$name" "$ACTIONLINT_VERSION" \
    "$(actionlint --version 2>/dev/null | head -n 1 | tr -d 'v' || true)"
}

check_yamllint() {
  local name="$1"
  local -a targets=()
  while IFS= read -r f; do targets+=("$f"); done \
    < <(find .github \( -name '*.yml' -o -name '*.yaml' \) 2>/dev/null | sort)

  if ! command -v yamllint >/dev/null 2>&1; then
    skip_check "$name" "未安装 yamllint" "brew install yamllint  或  pipx install yamllint"
    return 0
  fi
  if [[ ${#targets[@]} -eq 0 ]]; then
    fail_check "$name" ".github/ 下没有找到任何 YAML 文件" \
      "目标集为空意味着这一项什么都没检查。"
    return 0
  fi

  run_check "$name" yamllint -c .yamllint "${targets[@]}"
  record_version_drift "$name" "$YAMLLINT_VERSION" \
    "$(yamllint --version 2>&1 | head -n 1 | sed 's/^yamllint //' || true)"
}

# zizmor 优先走 docker，与 CI 跑**同一条命令、同一个 pin 镜像**。
# 没有 docker 时退化为本机 zizmor，并如实记进 NONSYNC_NOTES。
check_zizmor() {
  local name="$1"

  if [[ -z "$ZIZMOR_VERSION" ]]; then
    fail_check "$name" "没能从 .github/workflows/ci.yml 里取到 ZIZMOR_VERSION" \
      "这一项靠「与 CI 同源」才有意义，取不到版本就不该随便挑一个来跑。"
    return 0
  fi

  local image="ghcr.io/zizmorcore/zizmor:${ZIZMOR_VERSION}"

  if command -v docker >/dev/null 2>&1; then
    # 与 CI 完全同一条命令，只是把容器里的 /repo 换成本地目录
    run_check "$name" docker run --rm -v "$PWD":/repo:ro "$image" /repo --no-online-audits
  elif command -v zizmor >/dev/null 2>&1; then
    local local_version
    local_version="$(zizmor --version 2>/dev/null | head -n 1 || true)"
    run_check "$name" zizmor . --no-online-audits
    note "本机没有 docker，退而用本机 zizmor（${local_version}）；CI pin 的是 ${image}。"
    NONSYNC_NOTES+=("${name}（本机 ${local_version}，CI pin ${image}）")
  else
    skip_check "$name" "未安装 docker，本机也没有 zizmor" \
      "安装 Docker（CI 就是用 docker 跑 zizmor），或 brew install zizmor"
  fi
}

# ---------------------------------------------------------------------------
# 调度
# ---------------------------------------------------------------------------
dispatch() {
  local id="$1" name="$2"
  case "$id" in
    frontmatter) run_check "$name" node scripts/checks/frontmatter.js ;;
    evals)       run_check "$name" node scripts/checks/evals.js ;;
    vendor-lock) run_check "$name" node scripts/checks/vendor-lock.js ;;
    hygiene)     run_check "$name" node scripts/checks/hygiene.js ;;
    links)       run_check "$name" node scripts/checks/links.js ;;
    scripts)     run_check "$name" node scripts/checks/scripts.js ;;
    shellcheck)  check_shellcheck "$name" ;;
    actionlint)  check_actionlint "$name" ;;
    yamllint)    check_yamllint "$name" ;;
    zizmor)      check_zizmor "$name" ;;
  esac
}

printf '%s\n' "$C_BOLD"
printf '──────────────────────────────────────────────\n'
printf '  ai-skills · 本地静态检查\n'
printf '──────────────────────────────────────────────\n'
printf '%s' "$C_RESET"

for _spec in "${CHECKS[@]}"; do
  _id="${_spec%%:*}"
  _name="${_spec#*:}"
  should_run "$_id" || continue
  dispatch "$_id" "$_name"
done

# --commits：追加提交信息校验。它是 CI 那半边的本地等价物，
# 但**不覆盖 PR 标题** —— 见文件头的说明。
if [[ -n "$COMMITS" ]]; then
  run_check "提交信息规范（${COMMITS}）" ./scripts/check-commit-msg.sh --range "$COMMITS"
  NONSYNC_NOTES+=("提交信息规范只覆盖了提交区间；CI 还会校验 PR 标题，本地无从验证")
fi

# ---------------------------------------------------------------------------
# 汇总
# ---------------------------------------------------------------------------
printf '\n%s──────────────────────────────────────────────%s\n' "$C_BOLD" "$C_RESET"
printf '通过 %s%d%s · 失败 %s%d%s · 跳过 %s%d%s\n' \
  "$C_GREEN" "$PASSED" "$C_RESET" \
  "$C_RED" "$FAILED" "$C_RESET" \
  "$C_YELLOW" "$SKIPPED" "$C_RESET"

if [[ ${#NONSYNC_NOTES[@]} -gt 0 ]]; then
  printf '\n%s本次有 %d 项不是 CI 同源，其「通过」不等于 CI 的通过：%s\n' \
    "$C_YELLOW" "${#NONSYNC_NOTES[@]}" "$C_RESET"
  for _n in "${NONSYNC_NOTES[@]}"; do
    printf '  • %s\n' "$_n"
  done
fi

if [[ ${#ABORTED_NAMES[@]} -gt 0 ]]; then
  printf '\n%s以下检查未能执行（多半是环境问题，不是代码问题）：%s\n' "$C_YELLOW" "$C_RESET"
  for _n in "${ABORTED_NAMES[@]}"; do
    printf '  • %s\n' "$_n"
  done
  printf '  %s上述检查器以 git 索引为目标集，请确认在克隆出来的仓库里运行。%s\n' "$C_DIM" "$C_RESET"
fi

if [[ "$FAILED" -gt 0 ]]; then
  printf '\n%s以下检查未通过：%s\n' "$C_RED" "$C_RESET"
  for _n in "${FAILED_NAMES[@]}"; do
    printf '  • %s\n' "$_n"
  done
  printf '\n%s提示：%s大部分问题根据报错信息即可直接定位。\n' "$C_YELLOW" "$C_RESET"
  printf '      编码/换行问题参见 .editorconfig；YAML 缩进统一 2 空格。\n'
  exit 1
fi

printf '\n%s✓ 以上检查全部通过。%s\n' "$C_GREEN" "$C_RESET"
printf '%s  注意：PR 标题不在其中 —— CI 的 commit-messages job 会校验它，%s\n' "$C_YELLOW" "$C_RESET"
printf '        而标题在 PR 建立之前不存在，本地无从验证。请按规范写 PR 标题。\n'
