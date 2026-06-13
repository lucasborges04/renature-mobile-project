import { api } from "./api";

export const userService = {
  async getProfile() {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao carregar perfil do usuário.",
      );
    }
  },

  async getRanking() {
    try {
      const response = await api.get("/users/ranking");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao carregar o ranking.",
      );
    }
  },

  unlockAchievement: async (achievementCode: string) => {
    try {
      const response = await api.post("/users/achievements/unlock", {
        code: achievementCode,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
