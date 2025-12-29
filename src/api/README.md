# API 封装使用说明

本项目使用 axios 作为 HTTP 请求库，并进行了统一的封装，提供了请求/响应拦截器、鉴权、错误处理等功能。

## 目录结构

```
src/api/
├── request.ts        # axios实例封装和通用请求方法
└── modules/          # 各个业务模块的API方法
    └── example.ts    # 示例模块API
```

## 基本使用

### 1. 创建自定义API模块

```typescript
// src/api/modules/custom.ts
import { request, type ApiResponse } from '../request';
import type { CustomDataType, CreateCustomDataType } from '../types';

// 也可以创建自定义模块专用的axios实例
// const request = createAxiosInstance({ baseURL: '/api/example' });

// 定义API方法
export function getCustomData(id: string): Promise<ApiResponse<CustomDataType>> {
  return request.get(`/api/custom/data/${id}`).then(res => res.data);
}

export function createCustomData(data: CreateCustomDataType): Promise<ApiResponse<CustomDataType>> {
  return request.post('/api/custom/data', data).then(res => res.data);
}
```

### 2. 使用模块化API

```typescript
// 直接从模块文件导入API
import * as exampleApi from '@/api/modules/example';
import * as userApi from '@/api/modules/user';

// 使用示例API
const fetchExampleList = async () => {
  try {
    const response = await exampleApi.getExampleList({ page: 1, pageSize: 10 });
    console.log(response.data);
  } catch (error) {
    console.error(error.message);
  }
};
```

## 功能特性

### 1. 请求/响应拦截器

- **请求拦截器**：自动添加鉴权token、设置通用请求头
- **响应拦截器**：统一处理响应数据、错误状态码

### 2. 鉴权处理

- 自动从localStorage获取token并添加到请求头
- 401状态码时自动清除token并跳转到登录页

### 3. 错误处理

- 统一处理HTTP错误状态码（401、403、404、500等）
- 网络错误和请求超时处理
- 开发环境下打印详细的请求/响应信息

### 4. 类型支持

- 完整的TypeScript类型支持
- 通用API响应类型定义
- 分页数据类型定义

## 环境变量

在`.env`文件中可以配置以下环境变量：

```bash
# API基础URL
VITE_API_BASE_URL=/eventflow/home
```

## 注意事项

1. 所有API方法都返回Promise，建议使用async/await语法
2. 错误会以Promise.reject的形式抛出，需要使用try/catch捕获
3. token默认存储在localStorage中，key为'token'
4. 如需上传文件，可以使用自定义axios实例并设置正确的Content-Type
5. ApiResponse类型定义在types.ts中，使用时需从types.ts导入

## 扩展

如果需要添加新的功能，如：

- 请求重试机制
- 请求取消
- 请求缓存
- 请求加密

可以在`request.ts`中的`createAxiosInstance`函数中进行扩展。