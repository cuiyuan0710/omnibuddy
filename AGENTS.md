# Workspace instructions

- Do not stage or commit changes unless asked.
- 应用技术标识固定为 `omnibuddy`；用户可见显示名独立配置在根目录 `app.config.ts` 的 `displayName`。

## 包职责与依赖

- `@omnibuddy/contracts` 是各端共用类型、接口和工具的唯一契约包；不要另建重复契约。
- `@omnibuddy/ui` 负责 React 页面、组件和界面状态；不直接调用 Electron、Pi SDK 或云端接口，只通过契约使用宿主能力。
- `@omnibuddy/desktop` 负责 Electron 主进程、preload、IPC 和应用组装，并按模式选择本地或云端 Agent。
- `@omnibuddy/web` 负责浏览器入口和 Web 组装；Agent 功能走云端，不在浏览器运行本机 Pi SDK。
- 实现相关功能时再增加：`@omnibuddy/domain` 放宿主无关的业务规则和模型；`@omnibuddy/agent-runtime` 管理 Agent 任务流程（启动、取消、状态、事件）。runtime 依赖契约和 domain，不绑定具体 Agent。
- `@omnibuddy/agent-pi` 适配本地 Pi SDK；`@omnibuddy/remote` 连接云端。两者实现同一套 Agent 契约。Desktop 运行本地适配器；Desktop 和 Web 都可使用云端适配器。
- 契约只保留一套；功能未开始时不要创建空包。暂不单独建 RPC 包：桌面本地使用 Electron IPC，云端使用 HTTP/WebSocket；只有通信协议需要跨多处复用时再拆包。
- 依赖应朝向契约和核心业务；UI 不依赖 Desktop、Pi SDK 或具体云端实现。


# UI
- Do not add transition animations to styles unless there are special requirements
- Change the rounded corners of the card to continuous rounded corners in IOS style, making the transition from straight edges to rounded corners smoother.
