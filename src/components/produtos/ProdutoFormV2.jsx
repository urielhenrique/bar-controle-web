/**
 * ProdutoFormV2 - Exemplo de formulário de produto com validações robustas
 * Usa: validators, formatters, useFormValidation, FormInput, FormCurrencyInput
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FormInput from "@/components/shared/FormInput";
import FormCurrencyInput from "@/components/shared/FormCurrencyInput";
import produtoService from "@/services/produto.service";
import fornecedorService from "@/services/fornecedor.service";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  validateProductName,
  validateProductDescription,
  validatePrice,
  validateQuantity,
  sanitizeInput,
} from "@/utils/validators";
import { formatQuantityInput } from "@/utils/formatters";

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

export default function ProdutoFormV2({
  open,
  onClose,
  produto,
  estabelecimentoId,
}) {
  const [fornecedores, setFornecedores] = useState([]);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Configuração de validadores
  const validators = {
    nome: {
      validator: validateProductName,
      sanitizer: sanitizeInput,
      validateOnChange: true,
    },
    descricao: {
      validator: validateProductDescription,
      sanitizer: sanitizeInput,
      validateOnChange: true,
    },
    estoqueAtual: {
      validator: (val) => validateQuantity(val || 0),
      sanitizer: (val) => formatQuantityInput(String(val)),
      validateOnChange: true,
    },
    estoqueMinimo: {
      validator: (val) => validateQuantity(val || 0),
      sanitizer: (val) => formatQuantityInput(String(val)),
      validateOnChange: true,
    },
    precoCompra: {
      validator: (val) => validatePrice(val || 0),
      validateOnChange: true,
    },
    precoVenda: {
      validator: (val) => validatePrice(val || 0),
      validateOnChange: true,
    },
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    shouldShowError,
    resetValues,
  } = useFormValidation(
    {
      nome: "",
      descricao: "",
      categoria: "Cerveja",
      volume: "600ml",
      estoqueAtual: 0,
      estoqueMinimo: 5,
      precoCompra: 0,
      precoVenda: 0,
      fornecedorId: "",
    },
    validators,
  );

  useEffect(() => {
    if (produto) {
      setFieldValue("nome", produto.nome || "");
      setFieldValue("descricao", produto.descricao || "");
      setFieldValue("categoria", produto.categoria || "Cerveja");
      setFieldValue("volume", produto.volume || "600ml");
      setFieldValue("estoqueAtual", produto.estoqueAtual || 0);
      setFieldValue("estoqueMinimo", produto.estoqueMinimo || 5);
      setFieldValue("precoCompra", produto.precoCompra || 0);
      setFieldValue("precoVenda", produto.precoVenda || 0);
      setFieldValue("fornecedorId", produto.fornecedorId || "");
    } else {
      resetValues();
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

  const onSubmit = async (formValues) => {
    setServerError("");
    setSuccessMessage("");
    setSaving(true);

    try {
      const data = {
        ...formValues,
        estabelecimentoId,
        status: "OK",
        estoqueAtual: Number(formValues.estoqueAtual),
        estoqueMinimo: Number(formValues.estoqueMinimo),
        precoCompra: Number(formValues.precoCompra),
        precoVenda: Number(formValues.precoVenda),
      };

      if (produto) {
        await produtoService.update(produto.id, data);
        setSuccessMessage("Produto atualizado com sucesso!");
      } else {
        await produtoService.create(data);
        setSuccessMessage("Produto criado com sucesso!");
      }

      setTimeout(() => {
        setSaving(false);
        onClose(true);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setServerError(
        error.message || "Erro ao salvar produto. Tente novamente.",
      );
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !saving && onClose(false)}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {produto ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Mensagem de sucesso */}
          {successMessage && (
            <Alert className="bg-emerald-50 border-emerald-200">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Mensagem de erro do servidor */}
          {serverError && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {serverError}
              </AlertDescription>
            </Alert>
          )}

          {/* Nome do Produto */}
          <FormInput
            label="Nome do Produto"
            name="nome"
            value={values.nome}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError("nome") ? errors.nome : undefined}
            placeholder="Ex: Skol 600ml"
            required={true}
            maxLength={100}
            showCharCount={true}
          />

          {/* Descrição */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-200">
                Descrição
              </Label>
              <span className="text-xs text-slate-400">
                {values.descricao?.length || 0}/255
              </span>
            </div>
            <textarea
              name="descricao"
              value={values.descricao}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Descrição do produto..."
              maxLength={255}
              rows={3}
              className={`w-full rounded-lg mt-1 p-3 text-sm resize-none transition-all ${
                shouldShowError("descricao")
                  ? "border border-red-500 bg-red-50 text-slate-900 focus:ring-red-500 focus:border-red-500"
                  : "bg-slate-100 border border-slate-200 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500"
              }`}
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            />
            {shouldShowError("descricao") && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.descricao}</span>
              </div>
            )}
          </div>

          {/* Categoria e Volume */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">
                Categoria
              </Label>
              <Select
                value={values.categoria}
                onValueChange={(v) => setFieldValue("categoria", v)}
              >
                <SelectTrigger className="h-11 rounded-lg mt-1">
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

            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">
                Volume
              </Label>
              <Select
                value={values.volume}
                onValueChange={(v) => setFieldValue("volume", v)}
              >
                <SelectTrigger className="h-11 rounded-lg mt-1">
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

          {/* Estoque */}
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Estoque Atual"
              name="estoqueAtual"
              value={values.estoqueAtual}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                shouldShowError("estoqueAtual")
                  ? errors.estoqueAtual
                  : undefined
              }
              type="number"
              min="0"
              required={false}
            />
            <FormInput
              label="Estoque Mínimo"
              name="estoqueMinimo"
              value={values.estoqueMinimo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                shouldShowError("estoqueMinimo")
                  ? errors.estoqueMinimo
                  : undefined
              }
              type="number"
              min="0"
              required={false}
            />
          </div>

          {/* Preços */}
          <div className="grid grid-cols-2 gap-3">
            <FormCurrencyInput
              label="Preço de Compra"
              name="precoCompra"
              value={values.precoCompra}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                shouldShowError("precoCompra") ? errors.precoCompra : undefined
              }
            />
            <FormCurrencyInput
              label="Preço de Venda"
              name="precoVenda"
              value={values.precoVenda}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                shouldShowError("precoVenda") ? errors.precoVenda : undefined
              }
            />
          </div>

          {/* Fornecedor */}
          {fornecedores.length > 0 && (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-slate-200">
                Fornecedor
              </Label>
              <Select
                value={values.fornecedorId}
                onValueChange={(v) => setFieldValue("fornecedorId", v)}
              >
                <SelectTrigger className="h-11 rounded-lg mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {fornecedores.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dialog Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => !saving && onClose(false)}
              disabled={saving}
              className="rounded-lg h-11"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-lg h-11"
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
