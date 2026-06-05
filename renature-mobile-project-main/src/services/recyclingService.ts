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
      // Agora enviamos 'itemType' (ex: "Plástico") e a 'description' (ex: "Garrafa de Suco")
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
};
