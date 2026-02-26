import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertCircle,
  Mail,
  Loader2,
  ArrowRight,
} from "lucide-react";
import apiClient from "@/api/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de verificação não encontrado");
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setStatus("loading");
      const response = await apiClient.get(`/auth/verify-email?token=${token}`);
      setStatus("success");
      setMessage(response.message || "Email verificado com sucesso!");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Erro ao verificar email. Tente novamente.");
    }
  };

  const handleResendEmail = async () => {
    try {
      setStatus("loading");
      setMessage("");
      // Extrair email da URL ou pedir de novo
      const email = prompt("Digite seu email:");
      if (!email) return;

      await apiClient.post("/auth/send-verification-email", { email });
      setStatus("success");
      setMessage(
        "Email de verificação enviado! Verifique sua caixa de entrada.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Erro ao reenviar email");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img
              src="/barstock_logo_transparent.png"
              alt="Bar Stock"
              className="w-32 h-32 object-contain drop-shadow-2xl"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Verificar Email
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-slate-600 text-center">
                Verificando seu email...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Sucesso!</h2>
              <p className="text-slate-600 text-center">{message}</p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
              >
                Ir para Login <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Erro</h2>
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 ml-2">
                  {message}
                </AlertDescription>
              </Alert>

              <div className="space-y-3 w-full">
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full border-slate-300 hover:bg-slate-50"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reenviar Email
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Voltar para Login
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-400">
          <p>
            Não recebeu o email?{" "}
            <button
              onClick={handleResendEmail}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Tente novamente
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
