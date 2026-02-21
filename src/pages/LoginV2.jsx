import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Mail, Lock, LogIn } from "lucide-react";

export default function LoginV2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState("login"); // login ou signup
  const [nome, setNome] = useState("");
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Email e senha são obrigatórios");
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!nomeEstabelecimento || !nome || !email || !password) {
        setError("Todos os campos são obrigatórios");
        return;
      }

      if (password.length < 6) {
        setError("Senha deve ter no mínimo 6 caracteres");
        return;
      }

      // Implementar signup - por enquanto apenas redireciona
      setError("Signup em desenvolvimento");
    } catch (err) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border border-blue-400/50">
              <span className="text-4xl font-bold text-white">📊</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bar Stock SaaS</h1>
          <p className="text-slate-400">Gerencie seu estoque com facilidade</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              tab === "login"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <LogIn className="inline-block w-4 h-4 mr-2" />
            Entrar
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              tab === "signup"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <Mail className="inline-block w-4 h-4 mr-2" />
            Criar Conta
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-500/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400 ml-2">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-slate-200 mb-2 block">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-200 mb-2 block">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="inline-block w-4 h-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>

            {/* Google OAuth Button */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">
                  ou continue com
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </Button>
          </form>
        )}

        {/* Signup Form */}
        {tab === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label className="text-slate-200 mb-2 block">
                Nome do Estabelecimento
              </Label>
              <Input
                type="text"
                placeholder="Seu Bar"
                value={nomeEstabelecimento}
                onChange={(e) => setNomeEstabelecimento(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label className="text-slate-200 mb-2 block">Seu Nome</Label>
              <Input
                type="text"
                placeholder="João Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label className="text-slate-200 mb-2 block">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-200 mb-2 block">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Mínimo 6 caracteres</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Primeiros passos no Bar Stock SaaS?</p>
          <p className="mt-2">
            Teste com:{" "}
            <strong className="text-slate-300">admin@barstock.com.br</strong>
          </p>
          <p className="text-slate-500">Senha: Admin@123456</p>
        </div>
      </div>
    </div>
  );
}
