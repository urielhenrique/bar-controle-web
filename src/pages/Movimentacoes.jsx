import React, { useState, useEffect } from "react";
import movimentacaoService from "@/services/movimentacao.service";
import { ArrowDownCircle, ArrowUpCircle, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Movimentacoes() {
  const { user, isLoadingAuth } = useAuth();
  const estabelecimentoId = user?.estabelecimentoId;
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState("Todas");

  useEffect(() => {
    if (!estabelecimentoId) return;
    async function load() {
      setLoading(true);
      try {
        const data =
          await movimentacaoService.getByEstabelecimento(estabelecimentoId);
        setMovimentacoes(data);
      } catch (error) {
        console.error("Erro ao carregar movimentações:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [estabelecimentoId]);

  const filtered = movimentacoes.filter(
    (m) => tipoFiltro === "Todas" || m.tipo === tipoFiltro,
  );

  if (isLoadingAuth)
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-64" />
      </div>
    );
  if (!estabelecimentoId) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <EmptyState
          title="Estabelecimento nao configurado"
          description="Conclua o cadastro do estabelecimento para acessar as movimentacoes."
          icon={History}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Movimentações"
        subtitle="Histórico de entradas e saídas"
      />

      <div className="mb-6">
        <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
          <SelectTrigger className="w-44 h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas</SelectItem>
            <SelectItem value="Entrada">Entradas</SelectItem>
            <SelectItem value="Saida">Saida</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma movimentação"
          description="As movimentações aparecerão aqui quando você registrar entradas e saídas."
          icon={History}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      m.tipo === "Entrada" ? "bg-emerald-50" : "bg-red-50"
                    }`}
                  >
                    {m.tipo === "Entrada" ? (
                      <ArrowDownCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {m.produto?.nome || "Produto"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {m.data
                        ? format(new Date(m.data), "dd 'de' MMM, yyyy", {
                            locale: ptBR,
                          })
                        : ""}
                      {m.observacao ? ` · ${m.observacao}` : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-lg font-bold ${m.tipo === "Entrada" ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {m.tipo === "Entrada" ? "+" : "-"}
                    {m.quantidade}
                  </span>
                  <p className="text-xs text-gray-400">{m.tipo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
