// 示例模块相关类型定义
import type { PaginationParams } from './api';

export interface ExampleItem {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  status?: number;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

// 示例查询参数
export interface ExampleListParams extends PaginationParams {
  code?: string;
  name?: string;
  status?: number;
}