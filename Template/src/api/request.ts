import axios from "axios"
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios"
import type { ApiResponse } from "../types/api"

export interface RequestConfig extends AxiosRequestConfig {
  loading?: boolean
  skipErrorHandler?: boolean
}

const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
}

export function createAxiosInstance(config: AxiosRequestConfig = {}): AxiosInstance {
  const instanceConfig = { ...defaultConfig, ...config }
  const instance = axios.create(instanceConfig)

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      console.error("Request Error:", error)
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data } = response
      if (data.success || data.code === 200 || data.code === 0) {
        return response
      }
      return Promise.reject(new Error(data.message || "请求失败"))
    },
    (error: AxiosError<ApiResponse>) => {
      if (import.meta.env.DEV) {
        console.error("Response Error:", error)
      }

      if (error.response) {
        const { status, data } = error.response
        switch (status) {
          case 401:
            console.error("未授权")
            break
          case 403:
            console.error("权限不足")
            break
          case 404:
            console.error("请求的资源不存在")
            break
          case 500:
            console.error("服务器内部错误")
            break
          default:
            console.error(`请求错误: ${status}`)
        }
        const errorMessage = data?.message || error.message || "请求失败"
        return Promise.reject(new Error(errorMessage))
      }

      if (error.code === "ECONNABORTED") {
        return Promise.reject(new Error("请求超时，请稍后重试"))
      }

      return Promise.reject(error)
    }
  )

  return instance
}

export const request = createAxiosInstance()

