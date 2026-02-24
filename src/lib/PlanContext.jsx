import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import billingService from "@/services/billing.service";

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState("FREE");
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setPlan(user.plano || "FREE");
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      const subInfo = await billingService.getSubscriptionInfo();
      setSubscription(subInfo);
    } catch (error) {
      const isRateLimited =
        error?.status === 429 ||
        String(error?.message || "")
          .toLowerCase()
          .includes("muitas requisicoes");
      if (!isRateLimited) {
        console.error("Erro ao carregar subscription:", error);
      }
    }
  };

  const upgradeToProPlan = async () => {
    setLoading(true);
    try {
      await billingService.redirectToCheckout();
    } catch (error) {
      console.error("Erro ao fazer upgrade:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const openBillingPortal = async () => {
    setLoading(true);
    try {
      await billingService.redirectToPortal();
    } catch (error) {
      console.error("Erro ao abrir portal:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isPro = () => plan === "PRO";
  const isFree = () => plan === "FREE";

  const canCreateProduct = (currentCount) => {
    if (isPro()) return true;
    return currentCount < 50; // Limite FREE
  };

  return (
    <PlanContext.Provider
      value={{
        plan,
        subscription,
        loading,
        isPro,
        isFree,
        canCreateProduct,
        upgradeToProPlan,
        openBillingPortal,
        reloadSubscription: loadSubscription,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan deve ser usado dentro de um PlanProvider");
  }
  return context;
};
