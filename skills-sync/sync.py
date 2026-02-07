#!/usr/bin/env python3
"""
Skills and Commands Sync Tool
跨平台软链接同步工具，将 ~/.agents/ 下的 commands 和 skills 软链接到各种 AI 工具目录
"""

import os
import sys
import argparse
from pathlib import Path
import platform

def is_symlink_valid(path: Path) -> bool:
    """检查软链接是否有效"""
    if not path.is_symlink():
        return False
    target = path.resolve()
    return target.exists()

def create_symlink(source: Path, target: Path) -> bool:
    """创建软链接，支持跨平台"""
    # 如果目标已存在且是有效软链接，跳过
    if target.exists():
        if target.is_symlink():
            if is_symlink_valid(target):
                print(f"✓ 跳过（已存在有效链接）: {target}")
                return True
            else:
                print(f"✗ 删除无效链接: {target}")
                target.unlink()
        else:
            print(f"⚠ 跳过（目标已存在且不是软链接）: {target}")
            return False

    # 确保源目录存在
    if not source.exists():
        print(f"✗ 源不存在: {source}")
        return False

    # 确保父目录存在
    target.parent.mkdir(parents=True, exist_ok=True)

    # 创建软链接
    try:
        target.symlink_to(source)
        print(f"✓ 创建链接: {target} -> {source}")
        return True
    except OSError as e:
        print(f"✗ 创建失败: {target} -> {source}: {e}")
        return False

def sync_directory(source_dir: Path, target_dir: Path, source_name: str, target_name: str) -> dict:
    """同步整个目录"""
    stats = {"created": 0, "skipped": 0, "deleted": 0, "failed": 0}

    if not source_dir.exists():
        print(f"✗ 源目录不存在: {source_dir}")
        return stats

    # 遍历源目录中的所有项目
    for item in source_dir.iterdir():
        if item.is_dir():
            source_path = item
            target_path = target_dir / item.name

            if not target_path.exists():
                # 创建软链接
                if create_symlink(source_path, target_path):
                    stats["created"] += 1
                else:
                    stats["failed"] += 1
            elif target_path.is_symlink():
                # 检查现有软链接是否有效
                if is_symlink_valid(target_path):
                    print(f"✓ 跳过（已存在有效链接）: {target_path}")
                    stats["skipped"] += 1
                else:
                    # 删除无效链接并重新创建
                    print(f"✗ 删除无效链接: {target_path}")
                    target_path.unlink()
                    if create_symlink(source_path, target_path):
                        stats["created"] += 1
                    else:
                        stats["failed"] += 1
            else:
                print(f"⚠ 跳过（目标已存在且不是软链接）: {target_path}")
                stats["skipped"] += 1

    # 检查目标目录中的无效软链接
    if target_dir.exists():
        for item in target_dir.iterdir():
            if item.is_symlink() and not is_symlink_valid(item):
                print(f"✗ 删除无效链接: {item}")
                item.unlink()
                stats["deleted"] += 1

    return stats

def main():
    parser = argparse.ArgumentParser(
        description="同步 commands 和 skills 到 AI 工具目录",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 同步到 Claude（仅 commands）
  python skills-sync.py --target claude --type commands

  # 同步到 Claude（仅 skills）
  python skills-sync.py --target claude --type skills

  # 同步到 Claude（两者都同步）
  python skills-sync.py --target claude --type both

  # 同步到 CodeBuddy（两者都同步）
  python skills-sync.py --target codebuddy --type both

  # 同时同步到多个工具
  python skills-sync.py --target claude,codebuddy --type both
        """
    )

    parser.add_argument(
        "--target",
        required=True,
        help="目标工具: claude, codebuddy，或逗号分隔的多个工具"
    )

    parser.add_argument(
        "--type",
        required=True,
        choices=["commands", "skills", "both"],
        help="同步类型: commands, skills, 或 both"
    )

    args = parser.parse_args()

    # 定义工具路径
    home = Path.home()
    source_base = home / ".agents"

    tool_paths = {
        "claude": {
            "commands": home / ".claude" / "commands",
            "skills": home / ".claude" / "skills"
        },
        "codebuddy": {
            "commands": home / ".codebuddy" / "commands",
            "skills": home / ".codebuddy" / "skills"
        }
    }

    # 解析目标工具
    targets = [t.strip() for t in args.target.split(",")]

    for target in targets:
        if target not in tool_paths:
            print(f"✗ 未知的目标工具: {target}")
            print(f"  支持的工具: {', '.join(tool_paths.keys())}")
            sys.exit(1)

    # 执行同步
    total_stats = {"created": 0, "skipped": 0, "deleted": 0, "failed": 0}

    for target in targets:
        print(f"\n{'='*60}")
        print(f"同步到: {target}")
        print(f"{'='*60}")

        paths = tool_paths[target]

        if args.type in ["commands", "both"]:
            print(f"\n[Commands]")
            stats = sync_directory(
                source_base / "commands",
                paths["commands"],
                "commands",
                f"{target}/commands"
            )
            for k, v in stats.items():
                total_stats[k] += v

        if args.type in ["skills", "both"]:
            print(f"\n[Skills]")
            stats = sync_directory(
                source_base / "skills",
                paths["skills"],
                "skills",
                f"{target}/skills"
            )
            for k, v in stats.items():
                total_stats[k] += v

    # 输出统计
    print(f"\n{'='*60}")
    print("总计:")
    print(f"  创建: {total_stats['created']}")
    print(f"  跳过: {total_stats['skipped']}")
    print(f"  删除: {total_stats['deleted']}（无效链接）")
    print(f"  失败: {total_stats['failed']}")

    if total_stats['failed'] > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
