import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('moodly_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('moodly_token')
      localStorage.removeItem('moodly_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Entries
export const getEntries = () => API.get('/entries/')
export const getLast7 = () => API.get('/entries/last7')
export const getLast30 = () => API.get('/entries/last30')
export const createEntry = (data) => API.post('/entries/', data)
export const deleteEntry = (id) => API.delete(`/entries/${id}`)
export const exportEntries = () => API.get('/entries/export', { responseType: 'blob' })

// Insights
export const getWeeklyInsights = () => API.get('/insights/weekly')
export const getMoodStats = () => API.get('/insights/stats')

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)