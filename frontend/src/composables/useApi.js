 import axios from 'axios'

export function useApi() {
  const instance = axios.create({ baseURL: '/api' })

  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('tf_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  instance.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('tf_token')
        localStorage.removeItem('tf_user')
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  )

  return instance
}