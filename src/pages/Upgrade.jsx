import { useState } from "react";
import { usePlan } from "@/lib/PlanContext";
import { useAuth } from "@/lib/AuthContext";
import PricingCard from "@/components/pricing/PricingCard";

export default function Upgrade() {
  const { user } = useAuth();
  const { plan, upgradeToProPlan, loading } = usePlan();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await upgradeToProPlan();
    } catch (error) {
      console.error("Erro ao fazer upgrade:", error);
      alert("Erro ao iniciar upgrade. Tente novamente.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
        paddingTop: "64px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "16px",
              letterSpacing: "-0.025em",
            }}
          >
            Escolha seu Plano
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#64748b",
            }}
          >
            Escale seu negócio com recursos ilimitados
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
            marginBottom: "32px",
          }}
        >
          <PricingCard
            title="FREE"
            price="Grátis"
            description="Perfeito para começar"
            features={[
              "Até 50 produtos",
              "1 usuário",
              "Controle de estoque básico",
              "Dashboard básico",
            ]}
            isHighlighted={false}
            buttonText={plan === "FREE" ? "Plano Atual" : "Seu Plano"}
          />

          <PricingCard
            title="PRO"
            price="R$ 29,90"
            description="Tudo que você precisa"
            features={[
              "Produtos ilimitados",
              "Usuários ilimitados",
              "Controle avançado",
              "Dashboard completo",
              "Relatórios personalizados",
              "Suporte prioritário",
            ]}
            isHighlighted={true}
            onUpgrade={handleUpgrade}
            buttonText={
              plan === "PRO"
                ? "Plano Atual"
                : upgrading
                  ? "Processando..."
                  : "Fazer Upgrade"
            }
          />
        </div>

        {/* Trust Message */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "24px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            marginTop: "32px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: "#64748b",
              fontWeight: "500",
            }}
          >
            🔒 Pagamento seguro via Stripe
          </span>
          <span style={{ color: "#cbd5e1" }}>•</span>
          <span
            style={{
              fontSize: "14px",
              color: "#64748b",
              fontWeight: "500",
            }}
          >
            Cancele quando quiser
          </span>
        </div>
      </div>
    </div>
  );
}
