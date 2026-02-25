import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/lib/PlanContext";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import {
  Crown,
  Calendar,
  CreditCard,
  Loader2,
  Package,
  Users,
  History,
  AlertCircle,
} from "lucide-react";
import planoService from "@/services/plano.service";

export default function PlanStatus() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plan, subscription, upgradeToProPlan, openBillingPortal } = usePlan();
  const [usage, setUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  useEffect(() => {
    loadUsage();
  }, [user]);

  const loadUsage = async () => {
    try {
      const data = await planoService.getUsage();
      setUsage(data);
    } catch (error) {
      console.error("Erro ao carregar uso:", error);
    } finally {
      setLoadingUsage(false);
    }
  };

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

  const handleOpenPortal = async () => {
    setOpeningPortal(true);
    try {
      await openBillingPortal();
    } catch (error) {
      console.error("Erro ao abrir portal:", error);
      alert("Erro ao abrir portal de gerenciamento.");
    } finally {
      setOpeningPortal(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getUsagePercentage = (current, limit) => {
    if (limit === -1) return 0; // Ilimitado
    return Math.round((current / limit) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Meu Plano"
        subtitle="Gerencie sua assinatura e acompanhe o uso de recursos"
        actionLabel={plan === "FREE" ? "Fazer Upgrade" : "Gerenciar Assinatura"}
        onAction={plan === "FREE" ? handleUpgrade : handleOpenPortal}
      />

      {/* Current Plan Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                plan === "PRO"
                  ? "bg-gradient-to-br from-purple-100 to-blue-100"
                  : "bg-gray-100"
              }`}
            >
              <Crown
                className={`w-6 h-6 ${
                  plan === "PRO" ? "text-purple-600" : "text-gray-600"
                }`}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Plano {plan}</h2>
              <p className="text-sm text-gray-500">
                {plan === "PRO"
                  ? "Recursos ilimitados disponíveis"
                  : "Plano gratuito com limites"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              {plan === "PRO" ? "R$ 29,90" : "R$ 0"}
            </p>
            <p className="text-sm text-gray-500">/mês</p>
          </div>
        </div>

        {subscription && plan === "PRO" && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Período Atual
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(subscription.currentPeriodStart)} até{" "}
                {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <CreditCard className="w-4 h-4" />
                Status
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  subscription.status === "active"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {subscription.status === "active"
                  ? "Ativo"
                  : subscription.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Usage Cards */}
      {loadingUsage ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm h-24 animate-pulse"
            />
          ))}
        </div>
      ) : usage ? (
        <div className="space-y-4">
          {/* Produtos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Produtos</h3>
                  <p className="text-sm text-gray-500">
                    {usage.produtosCriados} de{" "}
                    {usage.limiteProdutos === -1
                      ? "ilimitados"
                      : usage.limiteProdutos}
                  </p>
                </div>
              </div>
              {usage.limiteProdutos !== -1 && (
                <span className="text-2xl font-bold text-gray-900">
                  {getUsagePercentage(
                    usage.produtosCriados,
                    usage.limiteProdutos,
                  )}
                  %
                </span>
              )}
            </div>
            {usage.limiteProdutos !== -1 && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getProgressColor(
                      getUsagePercentage(
                        usage.produtosCriados,
                        usage.limiteProdutos,
                      ),
                    )}`}
                    style={{
                      width: `${Math.min(
                        getUsagePercentage(
                          usage.produtosCriados,
                          usage.limiteProdutos,
                        ),
                        100,
                      )}%`,
                    }}
                  />
                </div>
                {getUsagePercentage(
                  usage.produtosCriados,
                  usage.limiteProdutos,
                ) >= 80 && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Você está próximo do limite. Considere fazer upgrade.
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Usuários */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Usuários</h3>
                  <p className="text-sm text-gray-500">
                    {usage.usuariosCriados} de{" "}
                    {usage.limiteUsuarios === -1
                      ? "ilimitados"
                      : usage.limiteUsuarios}
                  </p>
                </div>
              </div>
              {usage.limiteUsuarios !== -1 && (
                <span className="text-2xl font-bold text-gray-900">
                  {getUsagePercentage(
                    usage.usuariosCriados,
                    usage.limiteUsuarios,
                  )}
                  %
                </span>
              )}
            </div>
            {usage.limiteUsuarios !== -1 && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getProgressColor(
                      getUsagePercentage(
                        usage.usuariosCriados,
                        usage.limiteUsuarios,
                      ),
                    )}`}
                    style={{
                      width: `${Math.min(
                        getUsagePercentage(
                          usage.usuariosCriados,
                          usage.limiteUsuarios,
                        ),
                        100,
                      )}%`,
                    }}
                  />
                </div>
                {getUsagePercentage(
                  usage.usuariosCriados,
                  usage.limiteUsuarios,
                ) >= 80 && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Você está próximo do limite. Considere fazer upgrade.
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Movimentações */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <History className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Movimentações (este mês)
                  </h3>
                  <p className="text-sm text-gray-500">
                    {usage.movimentacoesMes} de{" "}
                    {usage.limiteMovimentacaoMensal === -1
                      ? "ilimitadas"
                      : usage.limiteMovimentacaoMensal}
                  </p>
                </div>
              </div>
              {usage.limiteMovimentacaoMensal !== -1 && (
                <span className="text-2xl font-bold text-gray-900">
                  {getUsagePercentage(
                    usage.movimentacoesMes,
                    usage.limiteMovimentacaoMensal,
                  )}
                  %
                </span>
              )}
            </div>
            {usage.limiteMovimentacaoMensal !== -1 && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getProgressColor(
                      getUsagePercentage(
                        usage.movimentacoesMes,
                        usage.limiteMovimentacaoMensal,
                      ),
                    )}`}
                    style={{
                      width: `${Math.min(
                        getUsagePercentage(
                          usage.movimentacoesMes,
                          usage.limiteMovimentacaoMensal,
                        ),
                        100,
                      )}%`,
                    }}
                  />
                </div>
                {getUsagePercentage(
                  usage.movimentacoesMes,
                  usage.limiteMovimentacaoMensal,
                ) >= 80 && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Você está próximo do limite. Considere fazer upgrade.
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {plan === "FREE" && (
          <Button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-base"
          >
            {upgrading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Crown className="w-5 h-5 mr-2" />
                Fazer Upgrade para PRO
              </>
            )}
          </Button>
        )}

        {plan === "PRO" && subscription && (
          <Button
            onClick={handleOpenPortal}
            disabled={openingPortal}
            variant="outline"
            className="w-full h-12 text-base"
          >
            {openingPortal ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Abrindo...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Gerenciar Assinatura
              </>
            )}
          </Button>
        )}

        <Button
          onClick={() => navigate("/upgrade")}
          variant="outline"
          className="w-full h-12 text-base"
        >
          Ver Todos os Planos
        </Button>
      </div>

      {/* Help Section */}
      {plan === "FREE" && (
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Desbloqueie Recursos Ilimitados
              </h3>
              <p className="text-gray-600 mb-3">
                Faça upgrade para o plano PRO e aproveite:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-600" />
                  <span>Produtos ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Usuários ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-600" />
                  <span>Movimentações ilimitadas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
