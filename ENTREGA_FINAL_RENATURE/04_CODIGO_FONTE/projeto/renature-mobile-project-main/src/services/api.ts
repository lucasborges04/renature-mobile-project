import axios from "axios";
import * as SecureStore from "expo-secure-store";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  console.warn(
    "EXPO_PUBLIC_API_URL nao foi configurada. Defina a URL publica do backend no arquivo .env.",
  );
}

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 60000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
