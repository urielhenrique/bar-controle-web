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
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge className="bg-blue-600 text-white px-3 py-1">
              <Crown className="w-4 h-4 mr-1" />
              Plano PRO Ativo
            </Badge>
            <p className="text-gray-500 mt-2">
              Acesso completo aos recursos premium.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendReport}
              disabled={sendingReport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors disabled:opacity-50"
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
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Zap className="w-4 h-4 text-blue-600" />
            Plano FREE
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mt-2">
            Upgrade para PRO e libere tudo
          </h3>
          <p className="text-gray-500 mt-2">
            Produtos e usuarios ilimitados, relatorios e suporte prioritario.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={() => navigate("/upgrade")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <Crown className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
            <button
              onClick={() => navigate("/plan-status")}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Ver detalhes
            </button>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-semibold text-gray-900">R$ 29,90</div>
          <div className="text-sm text-gray-500">/mes</div>
        </div>
      </div>
    </div>
  );
}
