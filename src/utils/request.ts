import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosRequestHeaders,
  type CancelTokenSource
} from 'axios'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 20000, // 设置超时时间 20秒
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false
})

instance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    return config
  },
  (err: any) => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (res: AxiosResponse | any) => {
    return res
  },
  (err: any) => {
    return Promise.reject(err)
  }
)

export default instance
