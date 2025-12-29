import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '../types/api.ts';

// 定义请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  loading?: boolean; // 是否显示加载状态
  skipErrorHandler?: boolean; // 是否跳过全局错误处理
}

// 创建axios实例的配置
const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 创建axios实例
 * @param config 自定义配置，会与默认配置合并
 * @returns axios实例
 */
export function createAxiosInstance(config: AxiosRequestConfig = {}): AxiosInstance {
  // 合并配置
  const instanceConfig = { ...defaultConfig, ...config };
  
  // 创建axios实例
  const instance = axios.create(instanceConfig);

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 从localStorage获取token
      const token = localStorage.getItem('token');
      
      // 如果token存在，添加到请求头
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 可以在这里添加其他通用请求头
      // config.headers['X-Requested-With'] = 'XMLHttpRequest';
      
      return config;
    },
    (error) => {
      // 请求错误处理
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      // 根据业务需求处理响应数据
      const { data } = response;
      
      // 如果响应成功
      if (data.success || data.code === 200 || data.code === 0) {
        return response;
      }
      
      // 如果业务逻辑失败，返回错误
      return Promise.reject(new Error(data.message || '请求失败'));
    },
    (error: AxiosError<ApiResponse>) => {
      // 打印错误信息（开发环境）
      if (import.meta.env.DEV) {
        console.error('Response Error:', error);
      }
      
      // 处理HTTP错误状态码
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            // 未授权，清除token并跳转到登录页
            console.error('未授权');
            // window.location.href = '/login';
            break;
          case 403:
            // 权限不足
            console.error('权限不足');
            break;
          case 404:
            // 资源不存在
            console.error('请求的资源不存在');
            break;
          case 500:
            // 服务器错误
            console.error('服务器内部错误');
            break;
          default:
            // 其他错误
            console.error(`请求错误: ${status}`);
        }
        
        // 如果后端返回了错误信息，使用后端的错误信息
        const errorMessage = data?.message || error.message || '请求失败';
        return Promise.reject(new Error(errorMessage));
      }
      
      // 网络错误或请求超时
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('请求超时，请稍后重试'));
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
}

// 创建默认axios实例
export const request = createAxiosInstance();
