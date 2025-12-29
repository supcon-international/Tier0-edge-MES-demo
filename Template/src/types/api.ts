export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

export interface PaginationParams {
  current: number
  pageSize: number
}

export interface PaginationResponse<T> {
  records: T[]
  current: number
  pageSize: number
  total: number
}

