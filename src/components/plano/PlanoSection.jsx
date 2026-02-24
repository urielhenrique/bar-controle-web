import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/lib/PlanContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, ArrowRight, Mail, Loader2 } from "lucide-react";
import billingService from "@/services/billing.service";

export default function PlanoSection() {
  const navigate = useNavigate();
  const { plan } = usePlan();
  const [sendingReport, setSendingReport] = useState(false);

  const handleSendReport = async () => {
    setSendingReport(true);
    try {
      await billingService.sendUsageReport();
      alert("✅ Relatório enviado com sucesso para seu email!");
    } catch (error) {
      console.error("Erro ao enviar relatório:", error);
      alert("Erro ao enviar relatório. Tente novamente.");
    } finally {
      setSendingReport(false);
    }
  };

  if (plan === "PRO") {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1">
                <Crown className="w-4 h-4 mr-1" />
                Plano PRO Ativo
              </Badge>
            </div>
            <p className="text-gray-600">
              Você tem acesso a todos os recursos premium! Aproveite ao máximo.
            </p>
          </div>
          <button
            onClick={() => navigate("/plan-status")}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            Ver Detalhes <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSendReport}
            disabled={sendingReport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {sendingReport ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            {sendingReport ? "Enviando..." : "Relatório de Uso"}
          </button>
          <button
            onClick={() => navigate("/plan-status")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Gerenciar <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
              Plano FREE
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Desbloqueie Recursos Ilimitados
          </h3>
          <p className="text-blue-100 mb-4">
            Faça upgrade para PRO e aumente a capacidade do seu estabelecimento:
            produtos ilimitados, usuários ilimitados, relatórios avançados e
            muito mais!
          </p>

          <ul className="space-y-2 mb-6 text-sm text-blue-100">
            <li className="flex items-center gap-2">
              <span className="text-lg">✓</span> Produtos ilimitados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✓</span> Usuários ilimitados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✓</span> Relatórios personalizados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✓</span> Suporte prioritário
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/upgrade")}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3"
            >
              <Crown className="w-5 h-5 mr-2" />
              Fazer Upgrade Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <button
              onClick={() => navigate("/plan-status")}
              className="text-white hover:bg-white/20 px-4 py-3 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              Ver Planos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="hidden md:block text-center">
          <div className="text-6xl font-bold mb-2">R$ 49,90</div>
          <div className="text-blue-100 text-sm">/mês</div>
          <div className="mt-4 text-xs text-blue-100">
            Sem compromisso. Cancele a qualquer momento.
          </div>
        </div>
      </div>
    </div>
  );
}
