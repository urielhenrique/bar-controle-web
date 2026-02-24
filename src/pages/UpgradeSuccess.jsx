import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/lib/AuthContext";

export default function UpgradeSuccess() {
  const navigate = useNavigate();
  const { checkAppState } = useAuth();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Celebrar com confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Atualizar dados do usuário
    checkAppState();

    // Countdown para redirecionar
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, checkAppState]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
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
          <h2 className="text-white font-semibold mb-4">O que você ganhou:</h2>
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
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Ir para Dashboard
          </Button>
        </div>

        <p className="text-sm text-slate-500">
          Se precisar de ajuda, entre em contato com nosso suporte.
        </p>
      </div>
    </div>
  );
}
