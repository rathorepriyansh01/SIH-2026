import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const SERVER_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});


export const predictCropDisease = async (imageFile) => {
  const formData = new FormData();

  formData.append('file', imageFile);

  try {
    const response = await api.post('/predict', formData);

    return response.data;

  } catch (error) {

    console.error("Prediction API Error:", error);

    console.error("Response:", error.response);

    console.error("Request:", error.request);

    throw error;
  }
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