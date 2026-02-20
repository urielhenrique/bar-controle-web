import { useState, useEffect, useMemo } from "react";
import planoService, {
  PlanoStatus,
  Limites,
  Uso,
} from "@/services/plano.service";

export interface Percentuais {
  produtos: number;
  usuarios: number;
  movimentacoesMes: number;
}

export interface UsePlanoReturn {
  plano: "FREE" | "PRO" | null;
  limites: Limites | null;
  uso: Uso | null;
  percentuais: Percentuais | null;
  isLoading: boolean;
  isFree: boolean;
  isPro: boolean;
  error: Error | null;
}

// Dados padrão para fallback
const DEFAULT_PLANO: PlanoStatus = {
  plano: "FREE",
  limites: {
    produtos: 100,
    usuarios: 5,
    movimentacoesMes: 1000,
  },
  uso: {
    produtos: 0,
    usuarios: 1,
    movimentacoesMes: 0,
  },
};

/**
 * Hook customizado para gerenciar status do plano
 */
export function usePlano(): UsePlanoReturn {
  const [data, setData] = useState<PlanoStatus | null>(DEFAULT_PLANO);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPlanoStatus = async () => {
      try {
        if (!isMounted) return;
        setIsLoading(true);
        setError(null);
        const status = await planoService.getStatus();
        if (isMounted) {
          setData(status);
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn(
          "Não foi possível obter status do plano, usando fallback:",
          err,
        );
        // Usar fallback ao invés de ficar com null
        setData(DEFAULT_PLANO);
        setError(
          err instanceof Error
            ? err
            : new Error("Erro ao obter status do plano"),
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPlanoStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Calcula percentuais de uso de forma segura
   */
  const percentuais = useMemo(() => {
    if (!data) return null;

    try {
      const calcPercentual = (usado: number, limite: number | null): number => {
        if (!limite || limite <= 0) return 0;
        return Math.min((usado / limite) * 100, 100);
      };

      return {
        produtos: calcPercentual(
          data.uso?.produtos ?? 0,
          data.limites?.produtos ?? null,
        ),
        usuarios: calcPercentual(
          data.uso?.usuarios ?? 0,
          data.limites?.usuarios ?? null,
        ),
        movimentacoesMes: calcPercentual(
          data.uso?.movimentacoesMes ?? 0,
          data.limites?.movimentacoesMes ?? null,
        ),
      };
    } catch (err) {
      console.error("Erro ao calcular percentuais:", err);
      return null;
    }
  }, [data]);

  return {
    plano: data?.plano ?? null,
    limites: data?.limites ?? null,
    uso: data?.uso ?? null,
    percentuais,
    isLoading,
    isFree: data?.plano === "FREE",
    isPro: data?.plano === "PRO",
    error,
  };
}
