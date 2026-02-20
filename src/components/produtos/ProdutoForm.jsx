import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import produtoService from "@/services/produto.service";
import fornecedorService from "@/services/fornecedor.service";

const CATEGORIAS = [
  "Cerveja",
  "Refrigerante",
  "Destilado",
  "Vinho",
  "Água",
  "Suco",
  "Energético",
  "Outros",
];
const VOLUMES = [
  "269ml",
  "350ml",
  "473ml",
  "600ml",
  "1L",
  "2L",
  "Dose",
  "Garrafa",
  "Outros",
];

export default function ProdutoForm({
  open,
  onClose,
  produto,
  estabelecimentoId,
}) {
  const [form, setForm] = useState({
    nome: "",
    categoria: "Cerveja",
    volume: "600ml",
    estoqueAtual: 0,
    estoqueMinimo: 5,
    precoCompra: 0,
    precoVenda: 0,
    fornecedorId: "",
  });
  const [fornecedores, setFornecedores] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (produto) {
      setForm({
        nome: produto.nome || "",
        categoria: produto.categoria || "Cerveja",
        volume: produto.volume || "600ml",
        estoqueAtual: produto.estoqueAtual || 0,
        estoqueMinimo: produto.estoqueMinimo || 5,
        precoCompra: produto.precoCompra || 0,
        precoVenda: produto.precoVenda || 0,
        fornecedorId: produto.fornecedorId || "",
      });
    } else {
      setForm({
        nome: "",
        categoria: "Cerveja",
        volume: "600ml",
        estoqueAtual: 0,
        estoqueMinimo: 5,
        precoCompra: 0,
        precoVenda: 0,
        fornecedorId: "",
      });
    }
  }, [produto, open]);

  useEffect(() => {
    if (estabelecimentoId) {
      fornecedorService
        .getByEstabelecimento(estabelecimentoId)
        .then(setFornecedores)
        .catch((error) =>
          console.error("Erro ao carregar fornecedores:", error),
        );
    }
  }, [estabelecimentoId]);

  const handleSave = async () => {
    if (!form.nome.trim()) return;
    setSaving(true);
    try {
      const data = {
        ...form,
        estabelecimentoId,
        status: "OK",
      };
      if (produto) {
        await produtoService.update(produto.id, data);
      } else {
        await produtoService.create(data);
      }
      setSaving(false);
      onClose(true);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto");
      setSaving(false);
    }
  };

  const set = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {produto ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Nome do Produto *</Label>
            <Input
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="Ex: Skol 600ml"
              className="h-11 rounded-xl mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Categoria</Label>
              <Select
                value={form.categoria}
                onValueChange={(v) => set("categoria", v)}
              >
                <SelectTrigger className="h-11 rounded-xl mt-1">
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
            <div>
              <Label>Volume</Label>
              <Select
                value={form.volume}
                onValueChange={(v) => set("volume", v)}
              >
                <SelectTrigger className="h-11 rounded-xl mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOLUMES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Estoque Atual</Label>
              <Input
                type="number"
                min="0"
                value={form.estoqueAtual}
                onChange={(e) => set("estoqueAtual", Number(e.target.value))}
                className="h-11 rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>Estoque Mínimo</Label>
              <Input
                type="number"
                min="0"
                value={form.estoqueMinimo}
                onChange={(e) => set("estoqueMinimo", Number(e.target.value))}
                className="h-11 rounded-xl mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Preço de Compra (R$)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.precoCompra}
                onChange={(e) => set("precoCompra", Number(e.target.value))}
                className="h-11 rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>Preço de Venda (R$)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.precoVenda}
                onChange={(e) => set("precoVenda", Number(e.target.value))}
                className="h-11 rounded-xl mt-1"
              />
            </div>
          </div>
          {fornecedores.length > 0 && (
            <div>
              <Label>Fornecedor</Label>
              <Select
                value={form.fornecedorId}
                onValueChange={(v) => set("fornecedorId", v)}
              >
                <SelectTrigger className="h-11 rounded-xl mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {fornecedores.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
            disabled={saving || !form.nome.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11"
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
