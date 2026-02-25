import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import apiClient from "@/api/api";
import { useAuth } from "@/lib/AuthContext";

export default function UpgradeSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState(null);
  const { refreshUser } = useAuth();

  useEffect(() => {
    const completeUpgrade = async () => {
      try {
        // Pegar session_id da URL
        const sessionId = searchParams.get("session_id");

        console.log("Session ID da URL:", sessionId);
        console.log("URL completa:", window.location.href);

        if (!sessionId) {
          throw new Error(
            "Session ID não encontrado na URL. Redirecionando...",
          );
        }

        // Chamar backend para completar o checkout
        console.log("Chamando complete-checkout com:", { sessionId });
        const result = await apiClient.post("/billing/complete-checkout", {
          sessionId,
        });
        console.log("Resultado do complete-checkout:", result);

        // Atualizar dados do usuário (incluindo plano)
        console.log("Atualizando dados do usuário...");
        await refreshUser();
        console.log("Dados do usuário atualizados!");

        // Celebrar com confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setProcessing(false);

        // Countdown para redirecionar
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              // Redirecionar e forçar reload completo
              window.location.href = "/";
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (err) {
        console.error("Erro ao completar upgrade:", err);
        setError(err.message || "Erro ao processar upgrade. Redirecionando...");
        setProcessing(false);

        // Redirecionar mesmo com erro
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    };

    completeUpgrade();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {processing ? (
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Processando seu upgrade... ⚡
            </h1>
            <p className="text-slate-300">
              Aguarde enquanto ativamos seus recursos premium
            </p>
          </div>
        ) : error ? (
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{error}</h1>
            <p className="text-slate-300">Redirecionando em instantes...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Bem-vindo ao PRO! 🎉
              </h1>
              <p className="text-xl text-slate-300 mb-2">
                Sua assinatura foi ativada com sucesso!
              </p>
              <p className="text-slate-400">
                Agora você tem acesso a todos os recursos premium.
              </p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg mb-8">
              <h2 className="text-white font-semibold mb-4">
                O que você ganhou:
              </h2>
              <ul className="space-y-2 text-left text-slate-300">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Produtos ilimitados
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Usuários ilimitados
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Dashboard completo
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Suporte prioritário
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-slate-400 mb-4">
                Redirecionando em {countdown} segundos...
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Ir para Dashboard
              </Button>
            </div>

            <p className="text-sm text-slate-500">
              Se precisar de ajuda, entre em contato com nosso suporte.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
