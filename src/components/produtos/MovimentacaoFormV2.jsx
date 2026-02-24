/**
 * MovimentacaoFormV2 - Exemplo de formulário de movimentação com validações
 * Usa: validators, formatters, useFormValidation, FormInput
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
import movimentacaoService from "@/services/movimentacao.service";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  validateQuantity,
  validateMovementObservation,
  validateMovementType,
  sanitizeInput,
} from "@/utils/validators";
import { formatQuantityInput } from "@/utils/formatters";

const TIPOS_MOVIMENTACAO = [
  { value: "entrada", label: "Entrada" },
  { value: "saída", label: "Saída" },
  { value: "ajuste", label: "Ajuste" },
];

export default function MovimentacaoFormV2({
  open,
  onClose,
  produtoId,
  produtoNome,
  estabelecimentoId,
  onSuccess,
}) {
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Configuração de validadores
  const validators = {
    tipo: {
      validator: validateMovementType,
      validateOnChange: true,
    },
    quantidade: {
      validator: (val) => validateQuantity(val || 0),
      sanitizer: (val) => formatQuantityInput(String(val)),
      validateOnChange: true,
    },
    observacao: {
      validator: validateMovementObservation,
      sanitizer: sanitizeInput,
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
      tipo: "entrada",
      quantidade: "",
      observacao: "",
    },
    validators
  );

  useEffect(() => {
    if (open) {
      resetValues();
    }
  }, [open]);

  const onSubmit = async (formValues) => {
    setServerError("");
    setSuccessMessage("");
    setSaving(true);

    try {
      const data = {
        ...formValues,
        produtoId,
        estabelecimentoId,
        quantidade: Number(formValues.quantidade),
        data: new Date().toISOString(),
      };

      await movimentacaoService.create(data);
      
      setSuccessMessage("Movimentação registrada com sucesso!");

      setTimeout(() => {
        setSaving(false);
        resetValues();
        onClose(true);
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error);
      setServerError(
        error.message || "Erro ao registrar movimentação. Tente novamente."
      );
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !saving && onClose(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Nova Movimentação
          </DialogTitle>
          {produtoNome && (
            <p className="text-sm text-slate-500 mt-1">
              Produto: <span className="font-semibold text-slate-700">{produtoNome}</span>
            </p>
          )}
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

          {/* Mensagem de erro */}
          {serverError && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {serverError}
              </AlertDescription>
            </Alert>
          )}

          {/* Tipo de Movimentação */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-slate-200">
              Tipo de Movimentação *
            </Label>
            <Select
              value={values.tipo}
              onValueChange={(v) => setFieldValue("tipo", v)}
            >
              <SelectTrigger className={`h-11 rounded-lg mt-1 ${
                shouldShowError("tipo")
                  ? "border-red-500 bg-red-50"
                  : "bg-slate-100 border-slate-200"
              }`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_MOVIMENTACAO.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {shouldShowError("tipo") && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.tipo}</span>
              </div>
            )}
          </div>

          {/* Quantidade */}
          <FormInput
            label="Quantidade"
            name="quantidade"
            value={values.quantidade}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError("quantidade") ? errors.quantidade : undefined}
            type="number"
            min="1"
            placeholder="0"
            required={true}
            hint="Quantidade a movimentar"
          />

          {/* Observação */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-200">
                Observação
              </Label>
              <span className="text-xs text-slate-400">
                {values.observacao?.length || 0}/200
              </span>
            </div>
            <textarea
              name="observacao"
              value={values.observacao}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Motivo da movimentação (opcional)"
              maxLength={200}
              rows={3}
              className={`w-full rounded-lg mt-1 p-3 text-sm resize-none transition-all ${
                shouldShowError("observacao")
                  ? "border border-red-500 bg-red-50 text-slate-900 focus:ring-red-500 focus:border-red-500"
                  : "bg-slate-100 border border-slate-200 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500"
              }`}
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            />
            {shouldShowError("observacao") && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.observacao}</span>
              </div>
            )}
          </div>

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
              {saving ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
