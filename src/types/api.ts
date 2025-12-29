// 定义接口返回的数据结构
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

// 通用分页请求参数
export interface PaginationParams {
  current: number; // 当前页
  pageSize: number; // 每页数量
}

// 通用分页响应数据
export interface PaginationResponse<T> {
  records: T[]; // 记录列表
  current: number; // 当前页
  pageSize: number; // 每页数量
  total: number; // 总记录数
}


