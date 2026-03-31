/**
 * FornecedorForm - Formulário de fornecedor com validações
 * Usa: validators, formatters, useFormValidation, componentes de input especializados
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import FormPhoneInput from "@/components/shared/FormPhoneInput";
import FormCNPJInput from "@/components/shared/FormCNPJInput";
import fornecedorService from "@/services/fornecedor.service";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  validateSupplierName,
  validatePhoneBR,
  validateCNPJ,
  validateEmail,
} from "@/utils/validators";

export default function FornecedorForm({
  open,
  onClose,
  fornecedor,
  estabelecimentoId,
}) {
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Configuração de validadores
  const validators = {
    nome: {
      validator: validateSupplierName,
      validateOnChange: true,
    },
    telefone: {
      validator: validatePhoneBR,
      validateOnChange: true,
    },
    cnpj: {
      validator: validateCNPJ,
      validateOnChange: false, // Apenas na saída do campo
    },
    email: {
      validator: validateEmail,
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
    setValues,
  } = useFormValidation(
    {
      nome: "",
      telefone: "",
      cnpj: "",
      email: "",
      prazoEntregaDias: 3,
    },
    validators,
  );

  // Reset manual para novo fornecedor
  const resetFormValues = () => {
    setValues({
      nome: "",
      telefone: "",
      cnpj: "",
      email: "",
      prazoEntregaDias: 3,
    });
  };

  useEffect(() => {
    console.log("[FornecedorForm] Modal mudou:", {
      open,
      fornecedorId: fornecedor?.id,
      fornecedor: fornecedor,
    });

    if (!open) return;

    if (fornecedor?.id) {
      console.log("[FornecedorForm] Editando fornecedor:", fornecedor);

      // Formata valores antes de setar
      const formattedValues = {
        nome: fornecedor.nome || "",
        telefone: fornecedor.telefone || "",
        cnpj: fornecedor.cnpj || "",
        email: fornecedor.email || "",
        prazoEntregaDias: fornecedor.prazoEntregaDias || 3,
      };

      console.log("[FornecedorForm] Setando valores:", formattedValues);
      setValues(formattedValues);
    } else {
      console.log("[FornecedorForm] Novo fornecedor, resetando");
      resetFormValues();
    }
  }, [fornecedor?.id, open]);

  const onSubmit = async (formValues) => {
    setServerError("");
    setSuccessMessage("");
    setSaving(true);

    try {
      const data = {
        ...formValues,
        estabelecimentoId,
      };

      console.log("[FornecedorForm] Enviando dados:", data);

      if (fornecedor) {
        await fornecedorService.update(fornecedor.id, data);
        setSuccessMessage("Fornecedor atualizado com sucesso!");
      } else {
        await fornecedorService.create(data);
        setSuccessMessage("Fornecedor criado com sucesso!");
      }

      setTimeout(() => {
        setSaving(false);
        onClose(true);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);

      // Trata erros específicos do servidor
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.entries(serverErrors).forEach(([field, message]) => {
          setFieldValue(field, values[field]);
        });
      }

      setServerError(
        error.message || "Erro ao salvar fornecedor. Tente novamente.",
      );
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !saving && onClose(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {fornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
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

          {/* Nome */}
          <FormInput
            label="Nome do Fornecedor"
            name="nome"
            value={values.nome}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError("nome") ? errors.nome : undefined}
            placeholder="Ex: Distribuidora ABC"
            required={true}
            maxLength={150}
            showCharCount={true}
          />

          {/* Telefone */}
          <FormPhoneInput
            label="Telefone"
            name="telefone"
            value={values.telefone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError("telefone") ? errors.telefone : undefined}
            placeholder="(31) 99999-9999"
            hint="Formato: (XX) XXXXX-XXXX"
          />

          {/* CNPJ */}
          <FormCNPJInput
            label="CNPJ"
            name="cnpj"
            value={values.cnpj}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError("cnpj") ? errors.cnpj : undefined}
            placeholder="00.000.000/0000-00"
            hint="CNPJ será validado"
          />

          {/* Email */}
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError("email") ? errors.email : undefined}
            placeholder="contato@distribuidora.com.br"
            hint="Email para contato"
          />

          {/* Prazo de Entrega */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-slate-200">
              Prazo de Entrega (dias)
            </Label>
            <Input
              type="number"
              name="prazoEntregaDias"
              min="1"
              value={values.prazoEntregaDias}
              onChange={handleChange}
              className="h-11 rounded-lg mt-1 bg-slate-100 border-slate-200 text-slate-900"
            />
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
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
