import React, { useState, useEffect, useMemo } from "react";
import produtoService from "@/services/produto.service";
import movimentacaoService from "@/services/movimentacao.service";
import fornecedorService from "@/services/fornecedor.service";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Beer,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import PlanoSection from "@/components/plano/PlanoSection";
import { useAuth } from "@/lib/AuthContext";

export default function Dashboard() {
  const { user, isLoadingAuth } = useAuth();
  const estabelecimentoId = user?.estabelecimentoId;
  const estabelecimentoNome = user?.estabelecimentoNome || "Estabelecimento";
  const [produtos, setProdutos] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!estabelecimentoId) return;
    async function load() {
      try {
        const [prods, movs, forns] = await Promise.all([
          produtoService.getByEstabelecimento(estabelecimentoId),
          movimentacaoService.getByEstabelecimento(estabelecimentoId),
          fornecedorService.getByEstabelecimento(estabelecimentoId),
        ]);
        setProdutos(prods);
        setMovimentacoes(movs);
        setFornecedores(forns);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [estabelecimentoId]);

  const stats = useMemo(() => {
    if (!produtos.length)
      return {
        total: 0,
        repor: 0,
        maisVendido: "-",
        valorEstoque: 0,
        valorInvestido: 0,
        valorPotencialVenda: 0,
        margemEstimada: 0,
        produtosRepor: [],
      };

    const fornecedorMap = {};
    fornecedores.forEach((f) => {
      fornecedorMap[f.id] = f;
    });

    // Calcular venda média diária por produto (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const saidasRecentes = movimentacoes.filter(
      (m) => m.tipo === "Saída" && new Date(m.data) >= thirtyDaysAgo,
    );

    const vendasPorProduto = {};
    saidasRecentes.forEach((m) => {
      vendasPorProduto[m.produtoId] =
        (vendasPorProduto[m.produtoId] || 0) + (m.quantidade || 0);
    });

    // Calcular status e ponto de reposição
    const produtosComStatus = produtos.map((p) => {
      const vendaTotal30d = vendasPorProduto[p.id] || 0;
      const vendaMediaDiaria = vendaTotal30d / 30;
      const fornecedor = fornecedorMap[p.fornecedorId];
      const prazo = fornecedor?.prazoEntregaDias || 3;
      const pontoReposicao = vendaMediaDiaria * prazo + (p.estoqueMinimo || 5);

      let status = "OK";
      if ((p.estoqueAtual || 0) <= (p.estoqueMinimo || 5)) {
        status = "Repor";
      } else if ((p.estoqueAtual || 0) <= pontoReposicao) {
        status = "Atenção";
      }

      return {
        ...p,
        vendaMediaDiaria,
        pontoReposicao,
        statusCalculado: status,
      };
    });

    // Produto mais vendido
    let maisVendidoId = null;
    let maxVendas = 0;
    Object.entries(vendasPorProduto).forEach(([id, total]) => {
      if (total > maxVendas) {
        maisVendidoId = id;
        maxVendas = total;
      }
    });
    const maisVendido = maisVendidoId
      ? produtos.find((p) => p.id === maisVendidoId)?.nome || "-"
      : "-";

    // Calcular valores financeiros
    const valorEstoque = produtos.reduce(
      (sum, p) => sum + (p.estoqueAtual || 0) * (p.precoCompra || 0),
      0,
    );

    const valorInvestido = produtos.reduce(
      (sum, p) => sum + (p.estoqueAtual || 0) * (p.precoCompra || 0),
      0,
    );

    const valorPotencialVenda = produtos.reduce(
      (sum, p) => sum + (p.estoqueAtual || 0) * (p.precoVenda || 0),
      0,
    );

    const margemEstimada =
      valorInvestido > 0
        ? ((valorPotencialVenda - valorInvestido) / valorInvestido) * 100
        : 0;

    const produtosRepor = produtosComStatus
      .filter(
        (p) => p.statusCalculado === "Repor" || p.statusCalculado === "Atenção",
      )
      .sort((a) => (a.statusCalculado === "Repor" ? -1 : 1));

    return {
      total: produtos.length,
      repor: produtosComStatus.filter((p) => p.statusCalculado === "Repor")
        .length,
      maisVendido,
      valorEstoque,
      valorInvestido,
      valorPotencialVenda,
      margemEstimada,
      produtosRepor,
    };
  }, [produtos, movimentacoes, fornecedores]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!estabelecimentoId) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <EmptyState
          title="Estabelecimento nao configurado"
          description="Conclua o cadastro do estabelecimento para acessar o painel."
          icon={Package}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Beer className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {estabelecimentoNome}
            </h1>
            <p className="text-gray-500 text-sm">
              Painel de controle do estoque
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard
              title="Total de Produtos"
              value={stats.total}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Precisam Repor"
              value={stats.repor}
              icon={AlertTriangle}
              color={stats.repor > 0 ? "red" : "emerald"}
            />
            <StatCard
              title="Mais Vendido"
              value={stats.maisVendido}
              icon={TrendingUp}
              color="violet"
              subtitle="Últimos 30 dias"
            />
            <StatCard
              title="Valor Investido"
              value={`R$\u00A0${stats.valorInvestido.toFixed(2)}`}
              icon={DollarSign}
              color="amber"
              subtitle="Custo total"
            />
            <StatCard
              title="Valor Potencial de Venda"
              value={`R$\u00A0${stats.valorPotencialVenda.toFixed(2)}`}
              icon={TrendingUp}
              color="emerald"
              subtitle="Receita em estoque"
            />
            <StatCard
              title="Margem Estimada"
              value={`${stats.margemEstimada.toFixed(1)}%`}
              icon={Package}
              color="violet"
              subtitle="Lucro potencial"
            />
          </div>

          {/* Alertas de Reposição */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Alertas de Reposição
              </h2>
              <Link
                to={createPageUrl("Produtos")}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {stats.produtosRepor.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex p-3 bg-emerald-50 rounded-xl mb-3">
                  <Package className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-gray-500">
                  Tudo em dia! Nenhum produto precisa de reposição.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {stats.produtosRepor.slice(0, 8).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                        {p.estoqueAtual || 0}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{p.nome}</p>
                        <p className="text-xs text-gray-400">
                          {p.categoria} · {p.volume}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={p.statusCalculado} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Status do Plano - Com Error Boundary */}
      {!loading && <PlanoSection />}
    </div>
  );
}
