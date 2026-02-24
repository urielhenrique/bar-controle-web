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
      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-indigo-600 text-white px-3 py-1">
                <Crown className="w-4 h-4 mr-1" />
                Plano PRO Ativo
              </Badge>
            </div>
            <p className="text-slate-600">
              Você tem acesso a todos os recursos premium! Aproveite ao máximo.
            </p>
          </div>
          <button
            onClick={() => navigate("/plan-status")}
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
          >
            Ver Detalhes <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSendReport}
            disabled={sendingReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 text-sm font-medium transition-colors disabled:opacity-50 text-indigo-700"
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
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors text-slate-700"
          >
            Gerenciar <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full uppercase tracking-wide">
              Plano FREE
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-slate-900 tracking-tight">
            Desbloqueie Recursos Ilimitados
          </h3>
          <p className="text-slate-600 mb-4 text-sm">
            Faça upgrade para PRO e aumente a capacidade do seu estabelecimento:
            produtos ilimitados, usuários ilimitados, relatórios avançados e
            muito mais!
          </p>

          <ul className="space-y-2 mb-6 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-lg text-indigo-600">✓</span> Produtos
              ilimitados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg text-indigo-600">✓</span> Usuários
              ilimitados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg text-indigo-600">✓</span> Relatórios
              personalizados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg text-indigo-600">✓</span> Suporte
              prioritário
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/upgrade")}
              className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold px-6 py-3"
            >
              <Crown className="w-5 h-5 mr-2" />
              Fazer Upgrade Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <button
              onClick={() => navigate("/plan-status")}
              className="text-indigo-600 hover:bg-indigo-50 px-4 py-3 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              Ver Planos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="hidden md:block text-center">
          <div className="text-6xl font-bold mb-2 text-slate-900">R$ 29,90</div>
          <div className="text-slate-600 text-sm">/mês</div>
          <div className="mt-4 text-xs text-slate-500">
            Sem compromisso. Cancele a qualquer momento.
          </div>
        </div>
      </div>
    </div>
  );
}
