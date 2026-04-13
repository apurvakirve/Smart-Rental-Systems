import axios from 'axios';

// Change this to match your XAMPP or Docker backend path
export const BASE_URL = 'http://localhost:8080/backend/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

export default api;
