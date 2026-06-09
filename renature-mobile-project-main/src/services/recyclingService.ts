import { api } from "./api";

export const recyclingService = {
  // Envia o código de barras para o backend identificar e pontuar
  async recycleWithBarcode(barcode: string) {
    try {
      const response = await api.post("/actions/barcode", { barcode });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao processar código de barras.",
      );
    }
  },

  async recycleManual(
    itemType:
      | "Plástico"
      | "Vidro"
      | "Papel"
      | "Metal"
      | "Eletrônico"
      | "Orgânico",
    description: string,
  ) {
    try {
      const response = await api.post("/actions/scan", {
        itemType,
        description,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao registrar reciclagem manual.",
      );
    }
  },

  async recycleWithImage(imageBase64: string) {
    try {
      const response = await api.post("/actions/image", {
        imageBase64: imageBase64,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Erro ao analisar a imagem pela Inteligência Artificial.",
      );
    }
  },
};
