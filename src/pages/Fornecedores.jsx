import React, { useState, useEffect } from "react";
import fornecedorService from "@/services/fornecedor.service";
import { Pencil, Trash2, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/AuthContext";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import FornecedorForm from "@/components/fornecedores/FornecedorForm";
import { Truck } from "lucide-react";

export default function Fornecedores() {
  const { user, isLoadingAuth } = useAuth();
  const estabelecimentoId = user?.estabelecimentoId;
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadData = async () => {
    if (!estabelecimentoId) return;
    setLoading(true);
    try {
      const data =
        await fornecedorService.getByEstabelecimento(estabelecimentoId);
      setFornecedores(data);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [estabelecimentoId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este fornecedor?"))
      return;
    try {
      await fornecedorService.delete(id);
      loadData();
    } catch (_error) {
      alert("Erro ao excluir fornecedor");
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
          description="Conclua o cadastro do estabelecimento para acessar fornecedores."
          icon={Truck}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Fornecedores"
        subtitle={`${fornecedores.length} fornecedores cadastrados`}
        actionLabel="Novo Fornecedor"
        onAction={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : fornecedores.length === 0 ? (
        <EmptyState
          title="Nenhum fornecedor cadastrado"
          description="Cadastre seus fornecedores para gerenciar prazos de entrega."
          actionLabel="Cadastrar Fornecedor"
          onAction={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          icon={Truck}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fornecedores.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{f.nome}</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => {
                      setEditing(f);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => handleDelete(f.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {f.telefone && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone className="w-3.5 h-3.5" />
                    {f.telefone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  Entrega em {f.prazoEntregaDias || 3} dias
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FornecedorForm
        open={formOpen}
        onClose={(saved) => {
          setFormOpen(false);
          if (saved) loadData();
        }}
        fornecedor={editing}
        estabelecimentoId={estabelecimentoId}
      />
    </div>
  );
}
