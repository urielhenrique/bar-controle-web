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
        background: "var(--color-bg-secondary)",
        padding: "var(--spacing-xl)",
        paddingTop: "var(--spacing-3xl)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{ textAlign: "center", marginBottom: "var(--spacing-3xl)" }}
        >
          <h1
            style={{
              fontSize: "var(--font-size-3xl)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text-primary)",
              marginBottom: "var(--spacing-md)",
            }}
          >
            Escolha seu Plano
          </h1>
          <p
            style={{
              fontSize: "var(--font-size-lg)",
              color: "var(--color-text-secondary)",
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
            gap: "var(--spacing-xl)",
            marginBottom: "var(--spacing-xl)",
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
            paddingTop: "var(--spacing-lg)",
            borderTop: `1px solid var(--color-border)`,
            display: "flex",
            justifyContent: "center",
            gap: "var(--spacing-xl)",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
            }}
          >
            <span
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              🔒 Pagamento Seguro via Stripe
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-sm)",
            }}
          >
            <span
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
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
