import axios, { type AxiosInstance } from "axios"
// vite에서 환경변수 값을 가져오기 위해서 import.meta 를 사용함
const BASE_URL = import.meta.env.VITE_API_BASE_URL

// 비로그인 axios instance
const axiosApi = (baseURL: string) => {
  return axios.create({
    baseURL
  })
}
// 로그인 이후 axios instance
const axiosAuthApi = (baseURL: string) => {
  const instance: AxiosInstance = axios.create({
    baseURL
  })

  // TODO: 로그인 정보 저장 및 API에 인증 토큰 붙이는 코드
  instance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`
    return config
  })
  return instance
}

export const defaultAxiosInstance: AxiosInstance = axiosApi(BASE_URL)
export const authAxiosInstance: AxiosInstance = axiosAuthApi(BASE_URL)