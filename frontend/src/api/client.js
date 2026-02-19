import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data.data;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const api = {
  auth: {
    register: (data) => apiClient.post('/auth/register', data),
    login: (data) => apiClient.post('/auth/login', data),
    refresh: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
    logout: (refreshToken) => apiClient.post('/auth/logout', { refreshToken }),
    getProfile: () => apiClient.get('/auth/profile'),
  },

  meetings: {
    create: (data) => apiClient.post('/meetings', data),
    list: (params) => apiClient.get('/meetings', { params }),
    getById: (id) => apiClient.get(`/meetings/${id}`),
    update: (id, data) => apiClient.put(`/meetings/${id}`, data),
    delete: (id) => apiClient.delete(`/meetings/${id}`),
    archive: (id) => apiClient.patch(`/meetings/${id}/archive`),
    toggleShare: (id) => apiClient.patch(`/meetings/${id}/share`),
  },

  analyses: {
    generate: (meetingId) => apiClient.post(`/analyses/meetings/${meetingId}/generate`),
    getLatest: (meetingId) => apiClient.get(`/analyses/meetings/${meetingId}/latest`),
    getVersions: (meetingId) => apiClient.get(`/analyses/meetings/${meetingId}/versions`),
    getByVersion: (meetingId, version) =>
      apiClient.get(`/analyses/meetings/${meetingId}/versions/${version}`),
    update: (analysisId, data) => apiClient.put(`/analyses/${analysisId}`, data),
    confirm: (analysisId) => apiClient.patch(`/analyses/${analysisId}/confirm`),
    getHistory: (analysisId) => apiClient.get(`/analyses/${analysisId}/history`),
  },

  actionItems: {
    listAll: (params) => apiClient.get('/action-items', { params }),
    getStats: () => apiClient.get('/action-items/stats'),
    update: (analysisId, actionItemId, data) =>
      apiClient.patch(`/action-items/${analysisId}/${actionItemId}`, data),
  },

  export: {
    json: (meetingId) =>
      apiClient.get(`/export/meetings/${meetingId}/json`, { responseType: 'blob' }),
    pdf: (meetingId) =>
      apiClient.get(`/export/meetings/${meetingId}/pdf`, { responseType: 'blob' }),
  },

  shared: {
    get: (shareToken) => apiClient.get(`/shared/${shareToken}`),
  },
};

export default api;
