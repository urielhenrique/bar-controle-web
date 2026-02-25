import { useState } from "react";
import { usePlan } from "@/lib/PlanContext";
import { useAuth } from "@/lib/AuthContext";
import PricingCard from "@/components/pricing/PricingCard";
import {
  Crown,
  Package,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Check,
  Sparkles,
} from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/barstock_logo_transparent.png"
              alt="BarStock"
              className="w-32 h-32 drop-shadow-2xl"
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Escolha seu Plano
          </h1>
          <p className="text-xl md:text-2xl text-emerald-50 mb-8 max-w-3xl mx-auto">
            Gerencie seu estoque com eficiência e escale seu negócio
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span className="font-semibold">Controle Total</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Gestão de Equipe</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Relatórios em Tempo Real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 -mt-12">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
            isCurrentPlan={plan === "FREE"}
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
            isCurrentPlan={plan === "PRO"}
          />
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o BarStock?
            </h2>
            <p className="text-lg text-gray-600">
              A solução completa para gestão de estoque do seu bar ou
              restaurante
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Rápido e Intuitivo
              </h3>
              <p className="text-gray-600">
                Interface moderna e fácil de usar. Configure em minutos e comece
                a gerenciar seu estoque imediatamente.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Seguro e Confiável
              </h3>
              <p className="text-gray-600">
                Seus dados protegidos com criptografia de ponta. Backups
                automáticos e disponibilidade 24/7.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Sempre Evoluindo
              </h3>
              <p className="text-gray-600">
                Atualizações constantes com novos recursos. Desenvolvido com
                feedback dos nossos usuários.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare os planos
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Recursos
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      FREE
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-900 bg-emerald-50">
                      PRO
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-4 text-gray-900">Produtos</td>
                    <td className="px-6 py-4 text-center text-gray-600">50</td>
                    <td className="px-6 py-4 text-center bg-emerald-50">
                      <span className="text-emerald-700 font-semibold">
                        Ilimitado
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">Usuários</td>
                    <td className="px-6 py-4 text-center text-gray-600">1</td>
                    <td className="px-6 py-4 text-center bg-emerald-50">
                      <span className="text-emerald-700 font-semibold">
                        Ilimitado
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">
                      Movimentações/mês
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      1000
                    </td>
                    <td className="px-6 py-4 text-center bg-emerald-50">
                      <span className="text-emerald-700 font-semibold">
                        Ilimitado
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">
                      Relatórios Básicos
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-emerald-50">
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">
                      Relatórios Avançados
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">—</td>
                    <td className="px-6 py-4 text-center bg-emerald-50">
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">
                      Suporte Prioritário
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">—</td>
                    <td className="px-6 py-4 text-center bg-emerald-50">
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Pagamento Seguro
                </div>
                <div className="text-sm text-gray-600">
                  Criptografia SSL 256-bit
                </div>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Sem Compromisso
                </div>
                <div className="text-sm text-gray-600">
                  Cancele quando quiser
                </div>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Suporte Dedicado
                </div>
                <div className="text-sm text-gray-600">
                  Estamos aqui para ajudar
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {plan === "FREE" && (
          <div className="mt-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
            <Crown className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Pronto para crescer?</h2>
            <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
              Faça upgrade para PRO e desbloqueie todo o potencial do BarStock.
              Sem limites, sem preocupações.
            </p>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors disabled:opacity-50"
            >
              {upgrading ? "Processando..." : "Fazer Upgrade Agora"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
