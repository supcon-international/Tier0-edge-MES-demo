import type {
  ExampleItem,
  ExampleListParams,
} from '@/types/example';
import { request } from '../request';
import type {
  ApiResponse,
  PaginationResponse
} from '../../types/api.ts';

/**
 * 获取分页示例列表
 * @param params 查询参数
 * @returns 示例列表
 */
export function getExampleList(params: ExampleListParams): Promise<ApiResponse<PaginationResponse<ExampleItem>>> {
  return request.post('/example/list', params).then(res => res.data);
}

/**
 * 获取示例详情
 * @param id 示例ID
 * @returns 示例详情
 */
export function getExampleDetail(id: string): Promise<ApiResponse<ExampleItem>> {
  return request.get(`/example/detail`, { params: { id } }).then(res => res.data);
}

/**
 * 创建示例
 * @param data 示例数据
 * @returns 创建结果
 */
export function createExample(data: ExampleItem): Promise<ApiResponse<string>> {
  return request.post('/example/create', data).then(res => res.data);
}

/**
 * 更新示例
 * @param data 示例数据
 * @returns 更新结果
 */
export function updateExample(data: ExampleItem): Promise<ApiResponse<string>> {
  return request.post(`/example/update`, data).then(res => res.data);
}

/**
 * 删除示例
 * @param id 示例ID
 * @returns 删除结果
 */
export function deleteExample(id: string): Promise<ApiResponse<string>> {
  return request.get(`/example/delete`, { params: { id } }).then(res => res.data);
}