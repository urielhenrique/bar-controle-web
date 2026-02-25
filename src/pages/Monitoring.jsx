import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  TrendingUp,
  AlertCircle,
  Loader2,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import monitoringService from "@/services/monitoring.service";

export default function Monitoring() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [days, setDays] = useState(30);
  const [filters, setFilters] = useState({
    eventType: "",
    estabelecimentoId: "",
  });

  // Security: Redirect if not authenticated or not admin
  useEffect(() => {
    // Wait for auth to load
    if (isLoadingAuth) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check if user is admin (MY_ADMIN_EMAIL)
    if (user?.email !== import.meta.env.VITE_MY_ADMIN_EMAIL) {
      navigate("/");
    }
  }, [isAuthenticated, isLoadingAuth, user, navigate]);

  // Fetch monitoring data
  useEffect(() => {
    // Only fetch if authenticated as admin
    if (
      isLoadingAuth ||
      !isAuthenticated ||
      user?.email !== import.meta.env.VITE_MY_ADMIN_EMAIL
    ) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await monitoringService.getMonitoringData({
          page,
          limit: 50,
          days,
          eventType: filters.eventType || undefined,
          estabelecimentoId: filters.estabelecimentoId || undefined,
        });
        setData(result);
      } catch (err) {
        setError(err.message || "Erro ao carregar dados de monitoramento");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, days, filters, isAuthenticated, user]);

  // Show loading while checking auth
  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.email !== import.meta.env.VITE_MY_ADMIN_EMAIL) {
    return null;
  }

  const handlePreviousPage = () => {
    if (data?.pagination?.page > 1) {
      setPage(data.pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.pagination && data.pagination.page < data.pagination.pages) {
      setPage(data.pagination.page + 1);
    }
  };

  const getEventLabel = (eventType) => {
    const labels = {
      login: "Login",
      upgrade: "Upgrade",
      downgrade: "Downgrade",
      free_limit_block: "Limite Atingido",
      stripe_webhook_error: "Erro Stripe",
      internal_error: "Erro Interno",
    };
    return labels[eventType] || eventType;
  };

  const getEventColor = (eventType) => {
    const colors = {
      login: "bg-blue-100 text-blue-800",
      upgrade: "bg-emerald-100 text-emerald-800",
      downgrade: "bg-amber-100 text-amber-800",
      free_limit_block: "bg-orange-100 text-orange-800",
      stripe_webhook_error: "bg-red-100 text-red-800",
      internal_error: "bg-red-100 text-red-800",
    };
    return colors[eventType] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold">Sistema de Monitoramento</h1>
          </div>
          <p className="text-slate-400">
            Admin only - Monitore eventos internos
          </p>
        </div>

        {/* KPI Cards */}
        {!loading && data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Total Events */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 shadow-sm hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total de Eventos</p>
                  <p className="text-3xl font-bold text-indigo-400 mt-2">
                    {data.pagination.total}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-indigo-500/30" />
              </div>
            </div>

            {/* Events Today */}
            {data.stats?.byDay?.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 shadow-sm hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Hoje</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-2">
                      {data.stats.byDay[0]?.count || 0}
                    </p>
                  </div>
                  <Calendar className="w-12 h-12 text-emerald-500/30" />
                </div>
              </div>
            )}

            {/* Most Common Event */}
            {data.stats?.byType?.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 shadow-sm hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Evento Mais Comum</p>
                    <p className="text-3xl font-bold text-amber-400 mt-2">
                      {getEventLabel(data.stats.byType[0]?.eventType)}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      {data.stats.byType[0]?._count?.id}x
                    </p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-amber-500/30" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Days Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Período (dias)
              </label>
              <select
                value={days}
                onChange={(e) => {
                  setDays(parseInt(e.target.value));
                  setPage(1);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-50 hover:border-slate-600 focus:border-indigo-500 focus:outline-none shadow-sm"
              >
                <option value={7}>7 dias</option>
                <option value={14}>14 dias</option>
                <option value={30}>30 dias</option>
                <option value={90}>90 dias</option>
              </select>
            </div>

            {/* Event Type Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Tipo de Evento
              </label>
              <select
                value={filters.eventType}
                onChange={(e) => {
                  setFilters({ ...filters, eventType: e.target.value });
                  setPage(1);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-50 hover:border-slate-600 focus:border-indigo-500 focus:outline-none shadow-sm"
              >
                <option value="">Todos</option>
                <option value="login">Login</option>
                <option value="upgrade">Upgrade</option>
                <option value="downgrade">Downgrade</option>
                <option value="free_limit_block">Limite Atingido</option>
                <option value="stripe_webhook_error">Erro Stripe</option>
                <option value="internal_error">Erro Interno</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(filters.eventType || filters.estabelecimentoId) && (
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setFilters({ eventType: "", estabelecimentoId: "" });
                    setPage(1);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shadow-sm"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-950/50 border-red-800">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300 ml-2">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Events Table */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          ) : data?.events?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-800/50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                        Data/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                        Tipo de Evento
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                        Estabelecimento
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                        Detalhes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.events.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {new Date(event.createdAt).toLocaleString("pt-BR")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getEventColor(event.eventType)}`}
                          >
                            {getEventLabel(event.eventType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {event.estabelecimentoId
                            ? event.estabelecimentoId.substring(0, 8) + "..."
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {event.metadata?.action || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-800/50">
                <div className="text-sm text-slate-400">
                  Página {data.pagination?.page || 1} de{" "}
                  {data.pagination?.pages || 1} ({data.pagination?.total || 0}{" "}
                  registros)
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={!data.pagination || data.pagination.page === 1}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    ← Anterior
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    disabled={
                      !data.pagination ||
                      data.pagination.page >= data.pagination.pages
                    }
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Próxima →
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center p-12">
              <p className="text-slate-400">Nenhum evento encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
