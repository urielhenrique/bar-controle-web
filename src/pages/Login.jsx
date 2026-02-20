import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Email e senha são obrigatórios");
        setIsLoading(false);
        return;
      }

      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.message || "Erro ao fazer login. Verifique suas credenciais.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-950 rounded-lg flex items-center justify-center border border-slate-700">
              <span className="text-2xl font-bold text-white">📊</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Bar Controle</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sistema de controle de estabelecimento
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-950 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-slate-800 border-slate-700 text-black placeholder:text-slate-500 focus:ring-slate-600 focus:border-slate-600"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-slate-800 border-slate-700 text-black placeholder:text-slate-500 focus:ring-slate-600 focus:border-slate-600"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 mt-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>

          {/* Info Section */}
          <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-300">
              <span className="font-semibold">Credenciais de teste:</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Email: <span className="font-mono">demo@example.com</span>
            </p>
            <p className="text-xs text-slate-400">
              Senha: <span className="font-mono">password123</span>
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-4">
          © 2026 Bar Controle. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
