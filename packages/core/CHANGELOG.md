# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://github.com/UraniumCorporation/maiar-ai/compare/v0.5.0...v0.6.0) (2025-02-18)

**Note:** Version bump only for package @maiar-ai/core

# [0.5.0](https://github.com/UraniumCorporation/maiar-ai/compare/v0.4.0...v0.5.0) (2025-02-17)

### Bug Fixes

- **core:** :drunk: :recycle: remove repeated code ([fd0fd68](https://github.com/UraniumCorporation/maiar-ai/commit/fd0fd681012074376501dc1c78796d944ababfd9))
- **core:** :recycle: split init() and checkHealth() in runtime ([e893a5e](https://github.com/UraniumCorporation/maiar-ai/commit/e893a5e0f04b843b15ef4e1c25ecb37829ad5186))

### Features

- **core:** add checkHealth extention to model core ([f923b74](https://github.com/UraniumCorporation/maiar-ai/commit/f923b7432578490f4f10bf177bcdcd273677bcf7))
- **core:** add info-level log to model init ([381119f](https://github.com/UraniumCorporation/maiar-ai/commit/381119f7548fa3cddff95ea89620f9d00f15cc7c))

# [0.4.0](https://github.com/UraniumCorporation/maiar-ai/compare/v0.3.0...v0.4.0) (2025-02-15)

**Note:** Version bump only for package @maiar-ai/core

# [0.3.0](https://github.com/UraniumCorporation/maiar-ai/compare/v0.2.0...v0.3.0) (2025-02-15)

**Note:** Version bump only for package @maiar-ai/core

# [0.2.0](https://github.com/UraniumCorporation/maiar-ai/compare/v0.1.2...v0.2.0) (2025-02-15)

### Features

- stand up x plugin ([a07886a](https://github.com/UraniumCorporation/maiar-ai/commit/a07886a3ccd22bdbbfc0ea02113c6ed52afed81f))

# 0.1.2 (2025-02-12)

# 🎉 Introducing Maiar v0.1.2

The initial release of Maiar, a composable, plugin-based AI agent framework.  
This release includes the core framework and official plugins we will support, which include:

- 🧠 Models
- 🔌 Integrations
- 💾 Memory Providers

# 📦 Packages

- ⚙️ Core
  - 🏗 **@maiar-ai/core** - The core framework for building AI agents.
- 🔌 Official Plugins
  - 🧠 Models
    - 🤖 **@maiar-ai/model-openai** - An OpenAI model provider.
    - 🦙 **@maiar-ai/model-ollama** - An Ollama model provider.
  - 🔗 Integrations
    - 🌐 **@maiar-ai/plugin-express** - A plugin for using Maiar with Express.
    - ✍️ **@maiar-ai/plugin-text** - A plugin for text generation capabilities.
    - 🖥️ **@maiar-ai/plugin-terminal** - A plugin for command-line interface interactions.
    - 🔄 **@maiar-ai/plugin-websocket** - A plugin for WebSocket communication.
    - 📩 **@maiar-ai/plugin-telegram** - A plugin for Telegram bot integration.
    - ⏳ **@maiar-ai/plugin-time** - An example plugin for adding time to the agent context.
    - 🖼️ **@maiar-ai/plugin-image** - A plugin for image processing capabilities.
  - 💾 Memory Providers
    - 📂 **@maiar-ai/memory-filesystem** - A filesystem-based memory provider.
    - 🗄️ **@maiar-ai/memory-sqlite** - A SQLite-based memory provider.
