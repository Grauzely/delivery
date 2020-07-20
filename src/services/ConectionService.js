import axios from 'axios'

const API_URL =
  process.env.API_URL || 'https://apidelivery.grauztecnologia.com.br/api/'

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('user-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }
  return config
})

export default apiClient
