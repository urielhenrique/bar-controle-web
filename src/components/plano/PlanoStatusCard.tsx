import React from "react";
import { Zap, AlertCircle, AlertTriangle } from "lucide-react";
import { usePlano } from "@/hooks/usePlano";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface UsageItemProps {
  label: string;
  used: number;
  limit: number | null;
  percentage: number;
  icon?: React.ReactNode;
}

/**
 * Componente que exibe um item individual de uso com barra de progresso
 */
function UsageItem({ label, used, limit, percentage, icon }: UsageItemProps) {
  let statusColor = "bg-emerald-500";
  let statusBg = "bg-emerald-50";
  let statusText = "text-emerald-700";
  let icon_component = null;

  // Se for plano free com limite, ajustar cores baseado no percentual
  if (percentage >= 100) {
    statusColor = "bg-red-500";
    statusBg = "bg-red-50";
    statusText = "text-red-700";
    icon_component = <AlertCircle className="w-4 h-4" />;
  } else if (percentage >= 80) {
    statusColor = "bg-yellow-500";
    statusBg = "bg-yellow-50";
    statusText = "text-yellow-700";
    icon_component = <AlertTriangle className="w-4 h-4" />;
  }

  // Determinar se deve mostrar limite
  const showLimit = limit !== null && limit !== undefined;
  const limitText =
    limit === null || limit === undefined ? "Ilimitado" : `${limit}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {showLimit ? (
            <div
              className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full",
                statusBg,
                statusText,
              )}
            >
              <span>{used}</span>
              <span className="text-gray-500 font-normal"> de {limitText}</span>
              {icon_component && <span className="ml-1">{icon_component}</span>}
            </div>
          ) : (
            <div className="text-xs font-semibold text-gray-600">
              {used} usado
              {icon_component && <span className="ml-1">{icon_component}</span>}
            </div>
          )}
        </div>
      </div>
      {showLimit && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                statusColor,
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 text-right">
            {percentage.toFixed(1)}% utilizado
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Componente que exibe o status do plano com limite de uso
 */
export default function PlanoStatusCard() {
  const { plano, limites, uso, percentuais, isLoading, isFree, error } =
    usePlano();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Validações de segurança
  if (!plano || !limites || !uso || !percentuais) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">
            {error
              ? "Não foi possível carregar o status do plano (usando padrões)"
              : "Dados do plano indisponíveis"}
          </p>
        </div>
        {error && <p className="text-xs text-gray-500 mt-2">{error.message}</p>}
      </div>
    );
  }

  const planoBadgeColor = isFree
    ? "bg-blue-50 text-blue-700"
    : "bg-emerald-50 text-emerald-700";

  const planoIcon = isFree ? "FREE" : "PRO";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Status do Plano
          </h2>
          <div
            className={cn(
              "px-3 py-1 rounded-full text-sm font-semibold",
              planoBadgeColor,
            )}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {plano}
            </div>
          </div>
        </div>
        {isFree && (
          <p className="text-xs text-gray-500 mt-2">
            Você está usando o plano gratuito. Faça upgrade para desfrutar de
            recursos ilimitados.
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Produtos */}
        <UsageItem
          label="Produtos"
          used={uso.produtos}
          limit={limites.produtos}
          percentage={percentuais.produtos}
          icon={<span>📦</span>}
        />

        {/* Usuários */}
        <UsageItem
          label="Usuários"
          used={uso.usuarios}
          limit={limites.usuarios}
          percentage={percentuais.usuarios}
          icon={<span>👤</span>}
        />

        {/* Movimentações do Mês */}
        <UsageItem
          label="Movimentações do Mês"
          used={uso.movimentacoesMes}
          limit={limites.movimentacoesMes}
          percentage={percentuais.movimentacoesMes}
          icon={<span>📊</span>}
        />
      </div>

      {/* Footer - Upgrade Button */}
      {isFree && (
        <div className="p-6 border-t border-gray-100 bg-blue-50">
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Fazer Upgrade para PRO
          </button>
          <p className="text-xs text-gray-600 text-center mt-2">
            Desbloqueie produtos ilimitados, usuários e movimentações
          </p>
        </div>
      )}
    </div>
  );
}
