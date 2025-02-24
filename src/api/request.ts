// src/utils/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { messageApi } from '@/lib/utils';
import useStore from '@/store';

export const getAuthToken = () => {
  const token = useStore.getState().token;
  return token ? `Bearer ${token}` : null;
};

// 响应数据接口
interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

// 错误码和对应的消息
const ERROR_MESSAGES: Record<number, string> = {
  400: '请求错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
};
const baseURL = import.meta.env.VITE_API_URL || '/api/admin';

class Request {
  private instance: AxiosInstance;
  private baseConfig: AxiosRequestConfig = {
    baseURL,
    timeout: 1000 * 30,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  };

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create({
      ...this.baseConfig,
      ...config
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const authToken = getAuthToken();
        if (authToken && config.headers) {
          config.headers.Authorization = `${authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        const res = response.data;
        // 根据自定义错误码处理错误
        if (!(/^2\d{2}$/.test(String(res.code)))) {
          messageApi.error(res.message || '请求失败');

          // 401: 未登录或 token 过期
          if (res.code === 401) {
            // 清除用户信息并跳转到登录页
            useStore.getState().logout();
            // window.location.href = '/login';
          }

          return Promise.reject(new Error(res.message || '请求失败'));
        }

        return res.data;
      },
      (error) => {
        const { response } = error;
        if (response && response.status) {
          const errorMessage = ERROR_MESSAGES[response.status] || response.data.message || '请求失败';
          messageApi.error(errorMessage);

          // 401: 未登录或 token 过期
          if (response.status === 401) {
            useStore.getState().logout();
            // window.location.href = '/login';
          }
        } else if (!response) {
          messageApi.error('网络异常，请检查网络连接');
        }
        return Promise.reject(error);
      }
    );
  }

  // GET 请求
  public get<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, {
      params: data,
      ...config,
    });
  }

  // POST 请求
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      ...config,
    });
  }

  // PUT 请求
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  // DELETE 请求
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  // 上传文件
  public upload<T = any>(url: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

// 导出请求实例
export const request = new Request({});

// 使用示例:
/*
// API 定义
export const userApi = {
  login: (data: LoginParams) => request.post<LoginResult>('/auth/login', data),
  getUserInfo: () => request.get<UserInfo>('/user/info'),
  updateUser: (data: UpdateUserParams) => request.put<UserInfo>('/user/update', data),
  deleteUser: (id: string) => request.delete(`/user/${id}`),
  uploadAvatar: (file: File) => request.upload('/user/avatar', file)
};
*/