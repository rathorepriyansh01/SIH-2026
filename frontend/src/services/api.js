import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';
export const SERVER_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const predictCropDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await api.post('/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getScanHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const getScanDetail = async (scanId) => {
  const response = await api.get(`/history/${scanId}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
