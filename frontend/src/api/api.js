import axios from 'axios';

// Change this to match your XAMPP htdocs path
export const BASE_URL = 'http://localhost/smart-rental-assistant/backend/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

export default api;
