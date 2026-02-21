import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:80",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    if (!config.headers?.["Content-Type"]) {
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
