English | **[中文](README.md)**

# extension-dev-skill

An AI Skill for [JLCEDA & EasyEDA Pro](https://pro.easyeda.com/) extension plugin development. Enables AI Agents to automatically query APIs, generate code, and build plugins.

## Features

- Optimized for [pro-api-sdk](https://github.com/easyeda/pro-api-sdk)
- Documentation-driven code generation based on [easyeda-api-skill](https://github.com/easyeda/easyeda-api-skill)
- MCP debugging toolchain support for automated build → import → log monitoring

## Installation

### 1. Clone the Repository to the Skills Directory

Find or create the skills directory according to your AI Agent's documentation:

```bash
git clone https://github.com/easyeda/extension-dev-skill
```

For example:

> **QwenCode**
> **Project scope**: `.qwen/skills` under the project root  
> **User scope**: `~/.qwen/skills`, applies to all projects on this machine  
> Navigate to the corresponding skills folder and run `git clone https://github.com/easyeda/extension-dev-skill`  

> **OpenCode**
> **Project scope**: `.opencode/skills` under the project root  
> **User scope**: `~/.config/opencode/skills`, applies to all projects on this machine  
> Navigate to the corresponding skills folder and run `git clone https://github.com/easyeda/extension-dev-skill`  

### 2. Use the Skill

Confirm the skill is loaded in your AI Agent, then specify it via command.

For example:

> **QwenCode**
> **1. Open terminal**: Type `qwen` and press Enter  
> **2. Specify skill and send request**: Type `/skills` in the QwenCode CLI and press Enter  
> Select `extension-dev-skill`, press Enter, then type your request  

> **OpenCode**
> **1. Open terminal**: Type `opencode` and press Enter  
> **2. Specify skill and send request**: Type `/skills` in the OpenCode CLI and press Enter  
> Select `extension-dev-skill`, press Enter, then type your request  

## How It Works

The Skill defines a workflow that AI Agents follow when generating plugin code:

| Step | Name | Description |
|------|------|-------------|
| 1 | Plan | Understand requirements, confirm target editor and core functionality |
| 2 | Init | Initialize project if workspace is not set up |
| 3 | Query | Four-step API lookup; every API must be verified against docs |
| 4 | Validate | Confirm all type signatures are complete; go back to Query if uncertain |
| 5 | Confirm | Present implementation plan to user |
| 6 | Execute | Generate code with try/catch wrapped API calls |
| 7 | Check | Runtime constraint check, menu ID uniqueness validation |
| 8 | Doc | Generate/update README.md and CHANGELOG.md |
| 9 | Deploy | Build and import the plugin |

Actual results depend on model capability. It is recommended to use models with strong coding and comprehension abilities.

## Tested Platforms

| Platform | Model |
|----------|-------|
| OpenClaw | MiniMax-2.7 |
| OpenCode | MiMo V2 Pro Free / MiniMax-2.5 Free |
| QwenCode | Qwen3-Coder |
| Kiro | Claude Opus4.6 |
| Trae | Kimi-K2 / Deepseek-V3 / Doubao |

## MCP Debugging Tools (Optional)

[extension-dev-mcp-tools](https://github.com/easyeda/extension-dev-mcp-tools)

With MCP installed, the AI Agent supports: build `.eext` → import to browser → retrieve console logs.

## Demo Video

Based on OpenCode:

https://github.com/user-attachments/assets/742954b8-9527-43ad-ae08-3f08ec083fa2
