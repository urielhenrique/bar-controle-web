import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/lib/PlanContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Crown, Zap } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function Upgrade() {
  const navigate = useNavigate();
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

  const features = {
    free: [
      "Até 50 produtos",
      "1 usuário",
      "Controle de estoque básico",
      "Dashboard básico",
      "Suporte por email",
    ],
    pro: [
      "Produtos ilimitados",
      "Usuários ilimitados",
      "Controle de estoque avançado",
      "Dashboard completo com gráficos",
      "Relatórios personalizados",
      "Múltiplos fornecedores",
      "Suporte prioritário",
      "Backup automático",
      "API access",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-slate-400">
            Escale seu negócio com recursos ilimitados
          </p>
        </div>

        {/* Current Plan Badge */}
        {user && (
          <div className="text-center mb-8">
            <Badge
              variant={plan === "PRO" ? "default" : "secondary"}
              className="text-lg px-4 py-2"
            >
              {plan === "PRO" ? (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Plano Atual: PRO
                </>
              ) : (
                "Plano Atual: FREE"
              )}
            </Badge>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* FREE Plan */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-2xl text-white">FREE</CardTitle>
              <CardDescription className="text-slate-400">
                Perfeito para começar
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">R$ 0</span>
                <span className="text-slate-400">/mês</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Plano Atual
              </Button>
            </CardFooter>
          </Card>

          {/* PRO Plan */}
          <Card className="border-blue-500 bg-gradient-to-br from-blue-900/20 to-purple-900/20 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                <Zap className="w-4 h-4 mr-1" />
                Mais Popular
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                PRO
              </CardTitle>
              <CardDescription className="text-slate-400">
                Para negócios em crescimento
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">R$ 49,90</span>
                <span className="text-slate-400">/mês</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan === "PRO" ? (
                <Button variant="outline" className="w-full" disabled>
                  Plano Ativo
                </Button>
              ) : (
                <Button
                  onClick={handleUpgrade}
                  disabled={upgrading || loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {upgrading || loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Fazer Upgrade
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4 text-left">
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-slate-400">
                Sim! Você pode cancelar sua assinatura a qualquer momento. Seu
                acesso PRO continuará até o final do período pago.
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                Como funciona o pagamento?
              </h3>
              <p className="text-slate-400">
                Utilizamos o Stripe para processar pagamentos de forma segura.
                Aceitamos cartão de crédito e débito.
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                O que acontece se eu fizer downgrade?
              </h3>
              <p className="text-slate-400">
                Seus dados não serão perdidos, mas você ficará limitado aos
                recursos do plano FREE até fazer upgrade novamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
