import React, { useState, useEffect, useMemo } from "react";
import produtoService from "@/services/produto.service";
import movimentacaoService from "@/services/movimentacao.service";
import fornecedorService from "@/services/fornecedor.service";
import {
  Pencil,
  ArrowDownCircle,
  Trash2,
  Search,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import ProdutoForm from "@/components/produtos/ProdutoForm";
import MovimentacaoForm from "@/components/produtos/MovimentacaoForm";
import ImportProdutosModal from "@/components/produtos/ImportProdutosModal";

const CATEGORIAS = [
  "Todas",
  "Cerveja",
  "Refrigerante",
  "Destilado",
  "Vinho",
  "Água",
  "Suco",
  "Energético",
  "Outros",
];

export default function Produtos() {
  const { user, isLoadingAuth } = useAuth();
  const estabelecimentoId = user?.estabelecimentoId;
  const [produtos, setProdutos] = useState([]);
  const [allProdutos, setAllProdutos] = useState([]); // Todos os produtos para filtro local
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFiltro, setCatFiltro] = useState("Todas");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [movOpen, setMovOpen] = useState(false);
  const [movProduto, setMovProduto] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleEditProduto = (produto) => {
    console.log("[Produtos] Clicou para editar:", {
      id: produto.id,
      nome: produto.nome,
      precoVenda: produto.precoVenda,
      precoCompra: produto.precoCompra,
    });
    setEditingProduto(produto);
    setFormOpen(true);
  };

  const loadData = async () => {
    if (!estabelecimentoId) return;
    setLoading(true);
    try {
      const [prods, movs, forns] = await Promise.all([
        produtoService.getByEstabelecimento(estabelecimentoId),
        movimentacaoService.getByEstabelecimento(estabelecimentoId),
        fornecedorService.getByEstabelecimento(estabelecimentoId),
      ]);
      setAllProdutos(prods); // Guarda todos os produtos
      setProdutos(prods);
      setMovimentacoes(movs);
      setFornecedores(forns);
      setCurrentPage(1); // Reset para primeira página
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [estabelecimentoId]);

  const produtosComStatus = useMemo(() => {
    const fornecedorMap = {};
    fornecedores.forEach((f) => {
      fornecedorMap[f.id] = f;
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const saidasRecentes = movimentacoes.filter(
      (m) => m.tipo === "Saida" && new Date(m.data) >= thirtyDaysAgo,
    );

    const vendasPorProduto = {};
    saidasRecentes.forEach((m) => {
      vendasPorProduto[m.produtoId] =
        (vendasPorProduto[m.produtoId] || 0) + (m.quantidade || 0);
    });

    return produtos.map((p) => {
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
        fornecedorNome: fornecedor?.nome,
      };
    });
  }, [produtos, movimentacoes, fornecedores]);

  const filtered = produtosComStatus.filter((p) => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFiltro === "Todas" || p.categoria === catFiltro;
    return matchSearch && matchCat;
  });

  // Paginação
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProdutos = filtered.slice(startIndex, endIndex);

  // Reset para página 1 quando filtro mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [search, catFiltro]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await produtoService.delete(id);
      loadData();
    } catch {
      alert("Erro ao excluir produto");
    }
  };

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
          description="Conclua o cadastro do estabelecimento para acessar produtos."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Produtos"
        subtitle={`${produtos.length} produtos cadastrados`}
        actionLabel="Novo Produto"
        onAction={() => {
          setEditingProduto(null);
          setFormOpen(true);
        }}
      />

      {/* Botão Importar em Lote */}
      <div className="mb-4">
        <Button
          onClick={() => setImportOpen(true)}
          variant="outline"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Importar em Lote
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <Select value={catFiltro} onValueChange={setCatFiltro}>
          <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Cadastre seus produtos para começar a controlar o estoque."
          actionLabel="Cadastrar Produto"
          onAction={() => {
            setEditingProduto(null);
            setFormOpen(true);
          }}
        />
      ) : (
        <>
          <div className="space-y-3">
            {paginatedProdutos.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                        p.statusCalculado === "OK"
                          ? "bg-emerald-50 text-emerald-600"
                          : p.statusCalculado === "Atenção"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {p.estoqueAtual || 0}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {p.nome}
                      </p>
                      <p className="text-xs text-gray-400">
                        {p.categoria} · {p.volume} · R${" "}
                        {(p.precoVenda || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={p.statusCalculado} />
                    <div className="hidden sm:flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-xl text-emerald-600 hover:bg-emerald-50"
                        onClick={() => {
                          console.log("🖱️ Clicou para movimentar:", {
                            id: p.id,
                            nome: p.nome,
                            estoque: p.estoqueAtual,
                          });
                          setMovProduto(p);
                          setMovOpen(true);
                        }}
                        title="Movimentar estoque"
                      >
                        <ArrowDownCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-xl text-gray-400 hover:bg-gray-100"
                        onClick={() => {
                          handleEditProduto(p);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-xl text-red-400 hover:bg-red-50"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {/* Mobile actions */}
                    <div className="flex sm:hidden items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-xs"
                        onClick={() => {
                          setMovProduto(p);
                          setMovOpen(true);
                        }}
                      >
                        Movimentar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controles de Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-6">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} a{" "}
                {Math.min(endIndex, filtered.length)} de {filtered.length}{" "}
                produtos
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Mostra primeira, última e páginas próximas à atual
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, idx, arr) => {
                      // Adiciona "..." entre páginas não consecutivas
                      const prevPage = arr[idx - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={`rounded-lg w-9 h-9 ${
                              currentPage === page
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : ""
                            }`}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ProdutoForm
        open={formOpen}
        onClose={(saved) => {
          setFormOpen(false);
          if (saved) loadData();
        }}
        produto={editingProduto}
        estabelecimentoId={estabelecimentoId}
      />

      <MovimentacaoForm
        open={movOpen}
        onClose={(saved) => {
          setMovOpen(false);
          if (saved) loadData();
        }}
        produto={movProduto}
        estabelecimentoId={estabelecimentoId}
      />

      <ImportProdutosModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
