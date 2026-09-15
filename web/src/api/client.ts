import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080",
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token vencido o inválido. Como todavía no hay refresh token,
      // la única salida es volver a loguearse.
      setAuthToken(null);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default client;