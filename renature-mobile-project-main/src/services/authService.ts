import { api } from "./api";
import * as SecureStore from "expo-secure-store";

export const authService = {
  async register(name: string, email: string, password?: string) {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao realizar cadastro",
      );
    }
  },

  async login(email: string, password?: string) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        await SecureStore.setItemAsync("token", response.data.token);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao realizar login",
      );
    }
  },

  async googleLogin(idToken: string) {
    try {
      const response = await api.post("/auth/google", { idToken });

      if (response.data.token) {
        await SecureStore.setItemAsync("token", response.data.token);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao realizar login com Google",
      );
    }
  },
};
