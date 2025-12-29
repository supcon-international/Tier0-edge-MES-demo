// 计量单位模块相关类型定义
import type { PaginationParams } from './api';

export interface UnitItem {
  unit_code?: string;
  unit_name?: string;
}

// 计量单位查询参数
export interface UnitListParams extends PaginationParams {
  unit_code?: string;
  unit_name?: string;
}