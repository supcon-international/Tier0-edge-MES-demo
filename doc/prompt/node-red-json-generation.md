# Node-RED JSON 文件生成提示词

## 目的
生成符合JSON格式规范的Node-RED流程文件，避免转义符、语法等格式错误。

## 核心要求

### 1. JSON格式正确性
- **必须是严格有效的JSON格式**：所有键名必须使用双引号，字符串值必须使用双引号
- **避免使用单引号**：Node-RED的JSON文件只接受双引号
- **禁止多余逗号**：数组和对象的最后一个元素后不能有逗号
- **确保括号匹配**：所有大括号`{}`和方括号`[]`必须正确匹配

### 2. 转义字符处理
- **字符串中的双引号必须转义**：使用`\"`而不是`"`
- **反斜杠必须转义**：使用`\\`而不是`\`
- **换行符处理**：如果需要在字符串中包含换行符，使用`\n`
- **特殊字符转义**：`/`, `\b`, `\f`, `\r`, `\t`等特殊字符也需要正确转义

### 3. Node-RED流程结构要求
- **流程数组结构**：整个文件必须是一个数组`[]`，包含多个节点对象
- **节点对象属性**：
  - `id`：节点唯一标识符（如：`"e0df2792d6930a1a"`）
  - `type`：节点类型（如：`"http in"`, `"function"`, `"postgresql"`等）
  - `z`：流程ID（如：`"0f4917b0fac269df"`）
  - `name`：节点名称（如：`"获取示例列表"`）
  - 其他节点类型特定属性
  - `wires`：节点连接关系，必须是二维数组（如：`[["01c6b18949921bcb"]]`）

### 4. Function节点代码处理
- **Function节点的func属性**：代码内容必须正确转义
  - 所有双引号使用`\"`而不是`"`
  - 所有换行符使用`\n`
  - 所有反斜杠使用`\\`
  - 避免在代码中直接使用未转义的特殊字符

### 5. 注释处理
- **注释格式**：所有注释必须使用`//`或`/* */`格式
- **注释内容**：注释内容必须正确转义，避免包含特殊字符

### 6. 示例JSON文件
可参考`flows/example.json`
[
  {
    "id": "e0df2792d6930a1a",
    "type": "http in",
    "z": "0f4917b0fac269df",
    "name": "获取示例列表",
    "url": "/example/list",
    "method": "post",
    "upload": false,
    "swaggerDoc": "",
    "x": 130,
    "y": 220,
    "wires": [["01c6b18949921bcb"]]
  },
  {
    "id": "01c6b18949921bcb",
    "type": "function",
    "z": "0f4917b0fac269df",
    "name": "验证参数",
    "func": "// GET请求的参数在msg.payload中\nmsg.params = msg.payload;\n\nreturn msg;",
    "outputs": 1,
    "timeout": "",
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 320,
    "y": 220,
    "wires": [["b5fe75f68bd38f81"]]
  },
  {
    "id": "b5fe75f68bd38f81",
    "type": "postgresql",
    "z": "0f4917b0fac269df",
    "name": "searchExample",
    "query": "select * from \"example\" ORDER BY \"timeStamp\" DESC limit 1;",
    "postgreSQLConfig": "c48ecc2ef69b5a15",
    "split": false,
    "rowsPerMsg": "1",
    "outputs": 1,
    "x": 530,
    "y": 220,
    "wires": [["90b24e25783d1010"]]
  },
  {
    "id": "90b24e25783d1010",
    "type": "function",
    "z": "0f4917b0fac269df",
    "name": "格式化响应",
    "func": "// 获取查询参数\nconst { current = 1, pageSize = 10, code, name, status } = msg.params || {};\nconst list = msg.payload[0] && msg.payload[0].json.data || [];\n\n// 根据查询参数过滤数据\nlet filteredData = list;\n\nif (code) {\n    filteredData = filteredData.filter(item => item.code && item.code.toLowerCase().includes(code.toLowerCase()));\n}\n\nif (name) {\n    filteredData = filteredData.filter(item => item.name && item.name.toLowerCase().includes(name.toLowerCase()));\n}\n\nif (status) {\n    filteredData = filteredData.filter(item => item.status && item.status.toLowerCase().includes(status.toLowerCase()));\n}\n\n// 计算分页\nconst total = filteredData.length;\nconst startIndex = (current - 1) * pageSize;\nconst endIndex = startIndex + parseInt(pageSize);\nlet records = filteredData.slice(startIndex, endIndex);\n\n// 构建响应\nconst response = {\n  code: 200,\n  success: true,\n  data: {\n    records: records,\n    current: parseInt(current),\n    pageSize: parseInt(pageSize),\n    total: total\n  }\n};\n\nmsg.payload = response;\nreturn msg;",
    "outputs": 1,
    "timeout": "",
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 750,
    "y": 220,
    "wires": [["671543099991c651"]]
  },
  {
    "id": "671543099991c651",
    "type": "http response",
    "z": "0f4917b0fac269df",
    "name": "返回响应",
    "statusCode": "200",
    "headers": {},
    "x": 940,
    "y": 220,
    "wires": []
  }
]
```

### 8. 常见错误规避

| 错误类型 | 错误示例 | 正确示例 |
|---------|---------|---------|
| 单引号使用 | `{'key': 'value'}` | `{"key": "value"}` |
| 未转义双引号 | `"func": "msg.payload = {"status": "success"};"` | `"func": "msg.payload = {\"status\": \"success\"};"` |
| 多余逗号 | `"wires": [["node2"]],` | `"wires": [["node2"]]` |
| 未转义SQL引号 | `"query": "select * from "example""` | `"query": "select * from \"example\""` |
| 未转义换行符 | `"func": "// comment
msg.payload = 1;"` | `"func": "// comment\nmsg.payload = 1;"` |

### 9. 验证建议
- **使用JSON验证工具**：如JSONLint、在线JSON验证器等检查格式正确性
- **Node-RED编辑器测试**：将生成的JSON导入Node-RED编辑器，检查是否有错误提示
- **语法高亮检查**：使用支持JSON语法高亮的编辑器查看，快速识别格式问题
- **分段验证**：复杂流程可拆分为多个小部分分别验证，再组合

### 10. 输出要求
- **只输出JSON内容**：不要包含任何其他说明文字
- **格式清晰**：可以使用适当的缩进提高可读性，但必须保证格式正确
- **避免注释**：JSON格式不支持注释，如果需要说明请放在节点的name属性中
- **完整结构**：确保包含所有必要的节点和配置

## 常见问题排查

1. **导入失败**：检查JSON格式是否正确，是否有多余逗号或未转义字符
4. **数据库连接失败**：检查数据库配置节点的参数是否正确
5. **HTTP接口无响应**：检查http in节点的URL和method配置