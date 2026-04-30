import axios from "axios";
import { clearStoredAuth, isTokenExpired } from "../utils/authToken";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tadreeb_token");

  if (token) {
    if (isTokenExpired(token)) {
      clearStoredAuth();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return config;
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
