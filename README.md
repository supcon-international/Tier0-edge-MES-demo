# MES 应用前端项目

这是一个基于 React + Vite + TypeScript 的制造执行系统(MES)前端应用。

## 项目结构

该项目采用多入口点架构，支持构建为多个独立的应用模块：
- example: 示例模块

## 开发构建方式

### 启动开发服务器
```bash
npm run dev
```
这将启动 Vite 开发服务器，默认运行在 http://localhost:5173/

### 预览所有模块
```bash
npm run preview
```
预览服务器启动后，访问地址为：
- http://localhost:4173/aws-spa-preview/

## 生产构建方式

### 构建所有模块
```bash
npm run build
```
这将并行构建所有模块，输出到 dist 目录下对应的子目录中。

### 构建特定模块
```bash
# 构建示例模块
npm run build:example
```

每个模块将构建到 `dist/{模块名}/` 目录下，包含独立的 HTML、CSS 和 JS 文件。

## 代码规范

```bash
npm run lint
```
运行 ESLint 检查代码规范。

## 环境变量

- VITE_BASE_PATH: 设置应用的基础路径，用于多入口点部署
- VITE_APP_TYPE: 设置应用类型，用于区分不同模块
- VITE_ANALYZE: 启用构建分析，设置为true时会生成打包分析报告

## 部署说明

每个模块都可以独立部署到对应的基础路径下，例如：
- 示例模块部署到 `/example/`

## 添加新独立模块

要添加一个新的独立模块，请按照以下步骤操作：

### 1. 创建路由文件

在 `src/routes` 目录下创建新的路由文件，例如 `newModule.tsx`：

```tsx
import NewModulePage from '../pages/NewModulePage'

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: NewModulePage
  },
  // 添加更多路由...
]
```

### 2. 更新路由索引

在 `src/routes/index.tsx` 中导入新模块的路由：

```tsx
import newModule from './newModule.tsx'

// 添加到路由模块映射
const routeModules: Record<string, RouteConfig[]> = {
  // 现有模块...
  newModule,
}
```

### 3. 添加构建脚本

在 `package.json` 中添加新模块的构建命令：

```json
{
  "scripts": {
    // 现有脚本...
    "build:newModule": "tsc -b && cross-env VITE_BASE_PATH=/newModulePath VITE_APP_TYPE=newModule vite build"
  }
}
```

**重要提示**：`VITE_APP_TYPE` 的值必须与 `src/routes/index.tsx` 中路由模块映射的键名保持一致。

### 4. 创建页面组件

在 `src/pages` 目录下创建对应的页面组件，例如 `NewModulePage.tsx`：

```tsx
export default function NewModulePage() {
  return (
    <div>
      <h1>新模块页面</h1>
      {/* 页面内容 */}
    </div>
  )
}
```

### 5. 测试新模块

完成以上步骤后，可以通过以下命令测试新模块：

```bash
# 构建新模块
npm run build:newModule
```

构建后的文件将输出到 `dist/newModulePath/` 目录下，可以独立部署到服务器的 `/newModulePath/` 路径。
