import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const httpClient = axios.create({
  baseURL,
  timeout: 15000,
});

/**
 * The backend always responds with { success, data, message } on success and
 * { success: false, message, errors } on failure (see backend errorHandler).
 * We unwrap that envelope here so every feature's infrastructure layer just
 * works with plain data, and normalize errors into a single shape the UI can
 * always rely on: { message, errors, statusCode }.
 */
httpClient.interceptors.response.use(
  (response) => response.data?.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const errors = error.response?.data?.errors || [];
    return Promise.reject({ statusCode: status, message, errors });
  }
);
