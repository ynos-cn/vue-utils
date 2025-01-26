/*
 * @Description: 请求
 * @Version: 1.0
 */
import { useCancelTokenStore } from "@/store/cancelToken";
import axios, { AxiosRequestConfig as Config, AxiosResponse, Canceler } from "axios";
import config from '@/config/defaultSettings'
import Cookies from "js-cookie";
import router from "@/router";

export interface AxiosRequestConfig extends Config {
  /** 是否允许接口并行请求 */
  isParallel?: boolean
}

const service = axios.create({
  baseURL: config.context || '',
  timeout: 60000
})

const err = (error: { request: AxiosRequestConfig, response: AxiosResponse }) => {
  if (error.response?.status === 401) {
    Cookies.remove('token');
    router.push({
      path: '/ioa/login/login',
      query: {
        redirect: router.currentRoute.value.fullPath
      }
    })
  }
  return Promise.reject(error)
}

service.interceptors.request.use((config: any) => {
  const cancelTokenStore = useCancelTokenStore();
  if (Cookies.get('token')) {
    config.headers['token'] = Cookies.get('token');
  }
  config.headers["X-Axios-With"] = true;
  const key = `${config.url}-${config.method}`

  if (!config.isParallel) {
    // 将请求存储起来 跳转下一页时中断未完成的请求
    config.cancelToken = new axios.CancelToken((payload: Canceler) => {
      cancelTokenStore.addHttpRequestMap({ key, payload });
    });
  }

  return config
}, err)

service.interceptors.response.use((response) => {
  const cancelTokenStore = useCancelTokenStore();
  const key = `${response.config.url}-${response.config.method}`
  cancelTokenStore.removeHttpRequestMap(key)
  return response
}, err)


function $http<T = any>(config: AxiosRequestConfig): Promise<T> {
  return new Promise((resole, reject) => {
    service({
      ...config
    }).then((res: any) => {
      if (res.config.responseType == 'blob') {
        resole(res)
      } else {
        resole(res.data)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

export {
  $http as axios
}
