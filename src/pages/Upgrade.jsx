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
        background: "#f9fafb",
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
              color: "#1f2937",
              marginBottom: "16px",
            }}
          >
            Escolha seu Plano
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#6b7280",
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

        {/* Trust Badges */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "16px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              🔒 Pagamento Seguro via Stripe
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              ✋ Cancele a qualquer momento
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
