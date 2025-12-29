# MES 前端模板（Template）

一个与当前项目同技术栈的精简脚手架，包含 React + Vite + TypeScript、Tailwind CSS 4、shadcn/ui 组件示例、i18n、API 封装以及页面布局范例，适合孵化同类业务模块或独立应用。

## 快速开始

```bash
cd Template
npm install
npm run dev
```

- 预览/单模块构建：`npm run build:module`
- SPA 预览：`npm run preview`
- 代码规范：`npm run lint`

## 主要特性

- **技术栈同步**：React 19 + Vite 7 + TypeScript 5.9 + Tailwind CSS 4 + shadcn/ui 基础组件
- **布局示例**：`PageContainer` + Card 组合，遵循 `doc/prompt/样式要求.md` 的高对比度克制风格
- **路由模式**：`HashRouter` + `VITE_APP_TYPE` 模式选择（与主项目一致）
- **国际化**：基于 `react-i18next`，内置中英文示例词条
- **API 封装**：`axios` 实例封装、统一错误处理与类型定义
- **示例页面**：搜索表单 + 列表卡片 + 状态标签 + Toast 提示，体现列表页最佳实践
- **Spec 模板**：`doc/spec/Spec-Template.md` 提供需求撰写模板

## 目录结构

```
Template/
├── agent.md              # 与主项目一致的工作指南
├── doc/
│   └── spec/
│       └── Spec-Template.md
├── public/
│   └── vite.svg
├── scripts/
│   └── clean-dist.js
├── src/
│   ├── api/              # axios 封装与示例接口
│   ├── components/       # 布局与 UI 组件（含 shadcn/ui 基础件）
│   ├── i18n/             # 中英语言包与初始化
│   ├── pages/            # 示例页面
│   ├── routes/           # 路由与模块映射
│   ├── types/            # 通用与业务类型
│   └── index.css         # Tailwind 4 主题与设计令牌
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## 新项目/模块复用建议

1. **复制目录**：直接复制 `Template/` 作为新项目起点，或将 `src/pages/Template` 克隆为新业务模块。
2. **更新标识**：调整 `package.json` 的 `name`，在 `routes` 中新增模块并在 `package.json` 添加对应 `build:<module>` 脚本。
3. **样式一致性**：页面应遵循 `doc/prompt/样式要求.md`，统一使用 Card 包裹内容，主按钮使用深色底+白字，搜索表单使用规范网格。
4. **API 与类型**：在 `src/api/modules/` 与 `src/types/` 中新增文件，复用 `request` 封装。
5. **国际化**：在 `src/i18n/locales/{zh,en}/` 中为新模块添加同名文件，并在 `index.ts` 合并。
6. **Spec 对齐**：撰写需求时使用 `doc/spec/Spec-Template.md`，并同步产出对应的 Node-RED Flow（放置在 `flows/`，可按需创建）。

## 环境变量

- `VITE_BASE_PATH`：部署基础路径
- `VITE_APP_TYPE`：路由模块键名（示例为 `template`，与 `src/routes/index.tsx` 的映射保持一致）
- `VITE_API_BASE_URL`：后端接口地址，默认 `/api`
- `VITE_ANALYZE`：`true` 时输出构建分析报告

## 兼容性说明

模板与主项目版本一致，可直接复用依赖与配置。如需升级依赖，建议先在模板验证再回推到主项目。

