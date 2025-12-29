# 模板需求说明书（Spec Template）

> 严格对齐主项目 Spec 框架；填写时删除提示文字并替换为实际内容。

## 1. 概要 (Overview)

### 1.1 功能单元定义 (Functional Unit Definition)
- **功能单元 (Unit):** `<中文名> (<English Name>)`
- **ISA-95 Level 3 活动:** `<Activity>`
- **核心价值:** `<模块带来的核心价值陈述>`

### 1.2 用户故事 (User Stories)
- As a [角色], I want [目标], so that [价值]。
- （可按需补充多条）

## 2. 需求 (Requirement)

### 2.1 关键能力 A
- **[R1] 普遍性 (Ubiquitous):**
  - The [System] shall [描述系统要实现的能力]，字段/约束包含：
    - `field_1` - 含义/必填/只读
    - `field_2` - …

### 2.2 关键能力 B
- **[R2] 事件驱动 (Event-Driven):**
  - When [触发条件/事件]，the [System] shall：
    - 校验/转换/落库/发布 Topic …

### 2.n 其他约束
- **[R3] 限制/异常 (Constraints/Error):**
  - 失败场景/权限/防重/幂等等

> 命名规则：编号递增，标签使用主项目分类（如普遍性、事件驱动等）；描述采用 “The [System] shall …” 句式。

## 3. 统一命名空间 (UNS) & 数据模型 (Data Models)

### 3.1 核心数据模型 (Payload Schemas)

#### 3.1.1 依赖模型 (Inputs)
- **模型 1: `<模型名>`**
  - Topic: `AMS/<domain>/state/<model>`
  - 数据格式示例：
    ```json
    {
      "field": "value"
    }
    ```

#### 3.1.2 生成模型 (Generated Models / Outputs)
- **模型 2: `<模型名>`**
  - Topic: `AMS/<domain>/state/<model>`
  - 数据格式示例：
    ```json
    {
      "field": "value"
    }
    ```

### 3.2 模拟数据 (可选)
- 以表格列出关键示例数据，字段与上方模型保持一致。

## 4. 事件流 (Event Flow) (Logic Layer)

### 4.1 事件/流程 X
**触发器:** `<定时/HTTP/用户动作>`

**处理逻辑:**
1. `<步骤 1>`
2. `<步骤 2>`

**输出:**
- 发布 Topic / 更新状态 / 返回响应

（可按流程继续 4.2、4.3…）

## 5. 交互界面 (UI Layer)

### 5.1 列表页 / 详情页
- **布局:** `PageContainer` + Card；背景 `bg-muted`；留白与间距遵循 `doc/prompt/样式要求.md`。
- **搜索表单:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end`，按钮放最后一列；使用 i18n 文案。
- **表格/列表:** 动作列使用文字按钮，避免纯图标；状态使用 rounded-full 药丸标签，颜色按规范。
- **交互:** 成功/失败 toast；加载态；空状态说明。

### 5.2 表单/弹窗
- 字段分组、校验规则、只读/必填标识；主操作按钮深色+白字，次操作 outline。