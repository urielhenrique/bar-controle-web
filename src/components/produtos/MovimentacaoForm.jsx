import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import movimentacaoService from "@/services/movimentacao.service";
import produtoService from "@/services/produto.service";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { format } from "date-fns";

export default function MovimentacaoForm({
  open,
  onClose,
  produto,
  estabelecimentoId,
}) {
  const [tipo, setTipo] = useState("Entrada");
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (quantidade <= 0 || !produto) return;

    if (tipo === "Saída" && quantidade > produto.estoqueAtual) {
      alert(
        `Estoque insuficiente! Disponível: ${produto.estoqueAtual} unidades.`,
      );
      return;
    }

    setSaving(true);

    try {
      const novoEstoque =
        tipo === "Entrada"
          ? (produto.estoqueAtual || 0) + quantidade
          : (produto.estoqueAtual || 0) - quantidade;

      await movimentacaoService.create({
        produtoId: produto.id,
        tipo,
        quantidade,
        observacao,
        estabelecimentoId,
      });

      setSaving(false);
      setQuantidade(1);
      setObservacao("");
      setTipo("Entrada");
      onClose(true);
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error);
      alert("Erro ao registrar movimentação");
      setSaving(false);
    }
  };

  if (!produto) return null;

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Movimentação de Estoque</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            {produto.nome} — Estoque atual:{" "}
            <strong>{produto.estoqueAtual || 0}</strong>
          </p>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button
                type="button"
                variant={tipo === "Entrada" ? "default" : "outline"}
                className={`h-14 rounded-xl text-base font-medium ${tipo === "Entrada" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                onClick={() => setTipo("Entrada")}
              >
                <ArrowDownCircle className="w-5 h-5 mr-2" />
                Entrada
              </Button>
              <Button
                type="button"
                variant={tipo === "Saída" ? "default" : "outline"}
                className={`h-14 rounded-xl text-base font-medium ${tipo === "Saída" ? "bg-red-500 hover:bg-red-600" : ""}`}
                onClick={() => setTipo("Saída")}
              >
                <ArrowUpCircle className="w-5 h-5 mr-2" />
                Saída
              </Button>
            </div>
          </div>
          <div>
            <Label>Quantidade</Label>
            <Input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="h-12 rounded-xl mt-1 text-lg font-semibold text-center"
            />
            {tipo === "Saída" && quantidade > (produto.estoqueAtual || 0) && (
              <p className="text-red-500 text-sm mt-1">Estoque insuficiente!</p>
            )}
          </div>
          <div>
            <Label>Observação (opcional)</Label>
            <Textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Compra do fornecedor X"
              className="rounded-xl mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onClose(false)}
            className="rounded-xl h-11"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || quantidade <= 0}
            className={`rounded-xl h-11 ${tipo === "Entrada" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-500 hover:bg-red-600"}`}
          >
            {saving ? "Salvando..." : `Confirmar ${tipo}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
