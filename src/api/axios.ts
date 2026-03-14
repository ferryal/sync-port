import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'https://portier-takehometest.onrender.com/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      return Promise.reject({
        status,
        code: data?.code || 'UNKNOWN_ERROR',
        message: data?.message || error.message,
        data,
      })
    }
    if (error.request) {
      return Promise.reject({
        status: 503,
        code: 'NETWORK_ERROR',
        message: 'Network error – please check your connection.',
      })
    }
    return Promise.reject({ status: 0, code: 'REQUEST_ERROR', message: error.message })
  }
)
