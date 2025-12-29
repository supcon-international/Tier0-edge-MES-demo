import type {
  UnitItem,
  UnitListParams,
} from '@/types/unit';
import { request } from '../request';
import type {
  ApiResponse,
  PaginationResponse
} from '../../types/api.ts';

/**
 * 获取分页单位列表
 * @param params 查询参数
 * @returns 单位列表
 */
export function getUnitList(params: UnitListParams): Promise<ApiResponse<PaginationResponse<UnitItem>>> {
  return request.post('/demo/unit/list', params).then(res => res.data);
}

/**
 * 获取单位详情
 * @param unitCode 单位编码
 * @returns 单位详情
 */
export function getUnitDetail(unitCode: string): Promise<ApiResponse<UnitItem>> {
  return request.get(`/demo/unit/detail`, { params: { unit_code: unitCode } }).then(res => res.data);
}

/**
 * 创建单位
 * @param data 单位数据
 * @returns 创建结果
 */
export function createUnit(data: UnitItem): Promise<ApiResponse<string>> {
  return request.post('/demo/unit/create', data).then(res => res.data);
}

/**
 * 更新单位
 * @param data 单位数据
 * @returns 更新结果
 */
export function updateUnit(data: UnitItem): Promise<ApiResponse<string>> {
  return request.post(`/demo/unit/update`, data).then(res => res.data);
}

/**
 * 删除单位
 * @param unitCode 单位编码
 * @returns 删除结果
 */
export function deleteUnit(unitCode: string): Promise<ApiResponse<string>> {
  return request.get(`/demo/unit/delete`, { params: { unit_code: unitCode } }).then(res => res.data);
}