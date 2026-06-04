import { api } from "./api";

export const recyclingService = {
  // Envia o código de barras para o backend identificar e pontuar
  async recycleWithBarcode(barcode: string) {
    try {
      const response = await api.post("/actions/barcode", { barcode });
      return response.data; // Deve retornar { success: true, item: "Garrafa PET", points: 10 }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao processar código de barras.",
      );
    }
  },

  // Envia o registro manual com o tipo de material selecionado
  async recycleManual(
    materialType:
      | "plastic"
      | "glass"
      | "paper"
      | "metal"
      | "organic"
      | "electronic",
  ) {
    try {
      const response = await api.post("/actions/scan", { materialType });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao registrar reciclagem manual.",
      );
    }
  },
};
