import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import fornecedorService from "@/services/fornecedor.service";

export default function FornecedorForm({
  open,
  onClose,
  fornecedor,
  estabelecimentoId,
}) {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    prazoEntregaDias: 3,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (fornecedor) {
      setForm({
        nome: fornecedor.nome || "",
        telefone: fornecedor.telefone || "",
        prazoEntregaDias: fornecedor.prazoEntregaDias || 3,
      });
    } else {
      setForm({ nome: "", telefone: "", prazoEntregaDias: 3 });
    }
  }, [fornecedor, open]);

  const handleSave = async () => {
    if (!form.nome.trim()) return;
    setSaving(true);
    try {
      const data = { ...form, estabelecimentoId };
      if (fornecedor) {
        await fornecedorService.update(fornecedor.id, data);
      } else {
        await fornecedorService.create(data);
      }
      setSaving(false);
      onClose(true);
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      alert("Erro ao salvar fornecedor");
      setSaving(false);
    }
  };

  const set = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {fornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Nome *</Label>
            <Input
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="Ex: Distribuidora ABC"
              className="h-11 rounded-xl mt-1"
            />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input
              value={form.telefone}
              onChange={(e) => set("telefone", e.target.value)}
              placeholder="(11) 99999-9999"
              className="h-11 rounded-xl mt-1"
            />
          </div>
          <div>
            <Label>Prazo de Entrega (dias)</Label>
            <Input
              type="number"
              min="1"
              value={form.prazoEntregaDias}
              onChange={(e) => set("prazoEntregaDias", Number(e.target.value))}
              className="h-11 rounded-xl mt-1"
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
