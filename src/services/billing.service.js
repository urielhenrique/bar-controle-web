import apiClient from "@/api/api";

class BillingService {
  /**
   * Criar sessão de checkout do Stripe
   */
  async createCheckoutSession() {
    try {
      const response = await apiClient.post("/billing/checkout");
      return response;
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      throw error;
    }
  }

  /**
   * Obter informações da assinatura
   */
  async getSubscriptionInfo() {
    try {
      const response = await apiClient.get("/billing/subscription");
      return response;
    } catch (error) {
      console.error("Erro ao buscar subscription:", error);
      throw error;
    }
  }

  /**
   * Criar sessão do portal de gerenciamento
   */
  async createPortalSession() {
    try {
      const response = await apiClient.get("/billing/portal");
      return response;
    } catch (error) {
      console.error("Erro ao criar portal:", error);
      throw error;
    }
  }

  /**
   * Redirecionar para checkout do Stripe
   */
  async redirectToCheckout() {
    try {
      const { url } = await this.createCheckoutSession();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      throw new Error("Erro ao redirecionar para checkout");
    }
  }

  /**
   * Redirecionar para portal de gerenciamento
   */
  async redirectToPortal() {
    try {
      const { url } = await this.createPortalSession();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      throw new Error("Erro ao abrir portal de gerenciamento");
    }
  }
}

export default new BillingService();
