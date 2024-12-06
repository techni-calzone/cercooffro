import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/token', credentials),
  register: (userData) => api.post('/auth/register', userData),
  upgradeToPremium: () => api.post('/auth/premium-upgrade'),
};

export const listingsAPI = {
  search: (params) => api.get('/listings/search', { params }),
  getRecommendations: () => api.get('/listings/recommendations'),
  voteListing: (listingId, status) => 
    api.post(`/listings/${listingId}/vote`, { status }),
};

export const userAPI = {
  updatePreferences: (preferences) => 
    api.put('/users/preferences', preferences),
  getProfile: () => api.get('/users/profile'),
};

export default api;
