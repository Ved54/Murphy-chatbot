import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  getMe: () => api.get('/auth/me'),
  updateSettings: (settings) => api.put('/auth/settings', settings),
};

// Chat API calls
export const chatAPI = {
  getChats: () => api.get('/chat'),
  getChat: (chatId) => api.get(`/chat/${chatId}`),
  createChat: (title) => api.post('/chat', { title }),
  sendMessage: (chatId, message) => api.post('/chat/message', { chatId, message }),
  updateChatTitle: (chatId, title) => api.put(`/chat/${chatId}/title`, { title }),
  deleteChat: (chatId) => api.delete(`/chat/${chatId}`),
};

export default api;
