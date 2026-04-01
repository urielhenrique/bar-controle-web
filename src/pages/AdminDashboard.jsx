import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import apiClient from "@/api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Box,
  TrendingUp,
  Activity,
  LogOut,
  Download,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all"); // all, free, pro, online
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const getProdutosCount = (est) => {
    if (typeof est?.produtosCount === "number") return est.produtosCount;
    if (typeof est?._count?.produtos === "number") return est._count.produtos;
    if (Array.isArray(est?.produtos)) return est.produtos.length;
    return 0;
  };

  useEffect(() => {
    // Verificar se é admin
    if (user?.role !== "ADMIN") {
      navigate("/");
      return;
    }

    fetchData();
  }, [filter, page]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Buscar estatísticas
      const statsRes = await apiClient.get("/admin/dashboard");
      setStats(statsRes);

      // Buscar usuários baseado no filtro
      let usersRes;
      if (filter === "online") {
        usersRes = await apiClient.get("/admin/users/online", { page, limit });
      } else if (filter === "free") {
        usersRes = await apiClient.get("/admin/users/plan/free", {
          page,
          limit,
        });
      } else if (filter === "pro") {
        usersRes = await apiClient.get("/admin/users/plan/pro", {
          page,
          limit,
        });
      } else {
        usersRes = await apiClient.get("/admin/users", { page, limit });
      }

      const normalizedUsers = Array.isArray(usersRes)
        ? usersRes
        : usersRes?.data || usersRes?.estabelecimentos || [];

      const total = usersRes?.pagination?.total ?? usersRes?.total ?? 0;
      const totalPages =
        usersRes?.pagination?.totalPages ??
        Math.max(1, Math.ceil((total || normalizedUsers.length) / limit));

      setPagination({
        page: usersRes?.pagination?.page ?? page,
        limit: usersRes?.pagination?.limit ?? limit,
        total,
        totalPages,
      });

      setUsers(normalizedUsers);
    } catch (err) {
      setError(err.message || "Erro ao carregar dados");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleExport = () => {
    const csv = [
      ["Estabelecimento", "Plano", "Usuários", "Produtos", "Criado em"],
      ...users.map((est) => [
        est.estabelecimentoNome || est.nome,
        est.plano || "N/A",
        est.usuarios?.length || 1,
        getProdutosCount(est),
        new Date(est.criadoEm || est.createdAt).toLocaleDateString("pt-BR"),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              🛡️ Admin Dashboard
            </h1>
            <p className="text-slate-400 text-sm">Painel de controle do SaaS</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-500/30">
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* KPI Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">
                    Total de Estabelecimentos
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats.totalEstabelecimentos}
                  </p>
                </div>
                <Box className="w-12 h-12 text-blue-500/30" />
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-green-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Plano FREE</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats.freeEstabelecimentos}
                  </p>
                </div>
                <Users className="w-12 h-12 text-green-500/30" />
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Plano PRO</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats.proEstabelecimentos}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-500/30" />
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total de Usuários</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats.totalUsuarios}
                  </p>
                </div>
                <Activity className="w-12 h-12 text-yellow-500/30" />
              </div>
            </div>
          </div>
        )}

        {/* Gráfico */}
        {stats && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Distribuição de Planos
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "FREE", value: stats.freeEstabelecimentos },
                  { name: "PRO", value: stats.proEstabelecimentos },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => {
              setFilter("all");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => {
              setFilter("free");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "free"
                ? "bg-green-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Plano FREE
          </button>
          <button
            onClick={() => {
              setFilter("pro");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "pro"
                ? "bg-purple-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Plano PRO
          </button>
          <button
            onClick={() => {
              setFilter("online");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "online"
                ? "bg-yellow-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Online
          </button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="ml-auto gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Estabelecimento
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Usuários
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Produtos
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                    Criado em
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      Carregando...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      Nenhum registro encontrado
                    </td>
                  </tr>
                ) : (
                  users.map((est, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white">
                        {est.estabelecimentoNome || est.nome || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            (est.plano || "FREE") === "PRO"
                              ? "bg-purple-500/20 text-purple-300"
                              : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {est.plano || "FREE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {est.usuarios?.length || 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {getProdutosCount(est)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            est.ativo !== false
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {est.ativo !== false ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(
                          est.criadoEm || est.createdAt,
                        ).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700 bg-slate-900/40">
            <p className="text-sm text-slate-400">
              Página {pagination.page} de {pagination.totalPages} ·{" "}
              {pagination.total} registros
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={loading || pagination.page <= 1}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-slate-700 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  setPage((prev) =>
                    Math.min(pagination.totalPages || 1, prev + 1),
                  )
                }
                disabled={loading || pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-slate-700 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
