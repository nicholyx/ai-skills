# 技能评测区分度审计：把「哪些 ✅ 是真的」变成有依据的表

## Goal

git-commit 的 6 条评测用例已全绿，但从未做过消融复核 —— 不知道哪几条真的在测技能。交付：对这 6 条跑 run-evals --ablate，把结果写进 docs/SKILLS.md 的图例与路线图；无区分度的用例重写到「不告诉它就大概率不会做」。验收：审计有数据、结论可复核。

## Requirements

- TBD

## Acceptance Criteria

- [ ] TBD

## Notes

- Keep `prd.md` focused on requirements, constraints, and acceptance criteria.
- Lightweight tasks can remain PRD-only.
- For complex tasks, add `design.md` for technical design and `implement.md` for execution planning before `task.py start`.
