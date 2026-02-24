import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/lib/PlanContext";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, CreditCard, ArrowRight, Loader2 } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-white flex items-center gap-2 mb-6"
          >
            ← Voltar
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Meu Plano</h1>
          <p className="text-xl text-slate-400">Gerencie sua assinatura</p>
        </div>

        {/* Plan Badge */}
        <div className="mb-8">
          <Badge
            variant={plan === "PRO" ? "default" : "secondary"}
            className="text-lg px-6 py-3"
          >
            {plan === "PRO" ? (
              <>
                <Crown className="w-5 h-5 mr-2" />
                Plano PRO Ativo
              </>
            ) : (
              <>Plano FREE</>
            )}
          </Badge>
        </div>

        {/* Current Plan Card */}
        <Card className="border-slate-700 bg-slate-800/50 mb-8">
          <CardHeader>
            <CardTitle>Plano Atual</CardTitle>
            <CardDescription>
              {plan === "PRO"
                ? "Você tem acesso a todos os recursos premium"
                : "Você está no plano gratuito com limites"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-2">
                  Custo Mensal
                </h3>
                <p className="text-3xl font-bold text-white">
                  {plan === "PRO" ? "R$ 49,90" : "R$ 0"}
                </p>
              </div>

              {subscription && (
                <>
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Período Atual
                    </h3>
                    <p className="text-white">
                      {formatDate(subscription.currentPeriodStart)} até{" "}
                      {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Status
                    </h3>
                    <Badge
                      variant={
                        subscription.status === "active" ? "default" : "outline"
                      }
                    >
                      {subscription.status === "active"
                        ? "Ativo"
                        : subscription.status}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Usage Card */}
        {loadingUsage ? (
          <Card className="border-slate-700 bg-slate-800/50 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            </CardContent>
          </Card>
        ) : usage ? (
          <Card className="border-slate-700 bg-slate-800/50 mb-8">
            <CardHeader>
              <CardTitle>Uso dos Recursos</CardTitle>
              <CardDescription>
                {plan === "PRO"
                  ? "Você tem acesso ilimitado"
                  : "Veja quanto você está usando do seu limite"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Produtos */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white font-medium">Produtos</label>
                    <span className="text-slate-400">
                      {usage.produtosCriados}
                      {usage.limiteProdutos !== -1
                        ? `/${usage.limiteProdutos}`
                        : " (ilimitado)"}
                    </span>
                  </div>
                  {usage.limiteProdutos !== -1 && (
                    <>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            getUsagePercentage(
                              usage.produtosCriados,
                              usage.limiteProdutos,
                            ) > 80
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
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
                      <p className="text-sm text-slate-400 mt-1">
                        {getUsagePercentage(
                          usage.produtosCriados,
                          usage.limiteProdutos,
                        )}
                        % de uso
                      </p>
                    </>
                  )}
                </div>

                {/* Usuários */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white font-medium">Usuários</label>
                    <span className="text-slate-400">
                      {usage.usuariosCriados}
                      {usage.limiteUsuarios !== -1
                        ? `/${usage.limiteUsuarios}`
                        : " (ilimitado)"}
                    </span>
                  </div>
                  {usage.limiteUsuarios !== -1 && (
                    <>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            getUsagePercentage(
                              usage.usuariosCriados,
                              usage.limiteUsuarios,
                            ) > 80
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
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
                      <p className="text-sm text-slate-400 mt-1">
                        {getUsagePercentage(
                          usage.usuariosCriados,
                          usage.limiteUsuarios,
                        )}
                        % de uso
                      </p>
                    </>
                  )}
                </div>

                {/* Movimentações */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white font-medium">
                      Movimentações (este mês)
                    </label>
                    <span className="text-slate-400">
                      {usage.movimentacoesMes}
                      {usage.limiteMovimentacaoMensal !== -1
                        ? `/${usage.limiteMovimentacaoMensal}`
                        : " (ilimitado)"}
                    </span>
                  </div>
                  {usage.limiteMovimentacaoMensal !== -1 && (
                    <>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            getUsagePercentage(
                              usage.movimentacoesMes,
                              usage.limiteMovimentacaoMensal,
                            ) > 80
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
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
                      <p className="text-sm text-slate-400 mt-1">
                        {getUsagePercentage(
                          usage.movimentacoesMes,
                          usage.limiteMovimentacaoMensal,
                        )}
                        % de uso
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          {plan === "FREE" ? (
            <Button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-6"
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
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          ) : subscription ? (
            <Button
              onClick={handleOpenPortal}
              disabled={openingPortal}
              variant="outline"
              className="w-full text-lg py-6"
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
          ) : null}

          <Button
            onClick={() => navigate("/upgrade")}
            variant="outline"
            className="w-full text-lg py-6"
          >
            Ver Planos
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-slate-800/50 bordered border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Precisa de Ajuda?
          </h2>
          <p className="text-slate-300 mb-4">
            Se você atingiu o limite do plano FREE e precisa de mais recursos,
            faça upgrade para PRO e desfrute de recursos ilimitados!
          </p>
          <div className="space-y-2 text-sm text-slate-400">
            <p>
              💡 <strong>Plano PRO</strong> inclui: Produtos ilimitados,
              Usuários ilimitados, Relatórios avançados, Suporte prioritário e
              muito mais.
            </p>
            <p>
              ❓ Dúvidas? Entre em contato com nosso suporte em
              support@barstock.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
