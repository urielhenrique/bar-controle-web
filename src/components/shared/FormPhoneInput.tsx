/**
 * FormPhoneInput - Input especializado para telefone brasileiro
 * Com máscara automática e validação
 */

import React, { useEffect, useState } from "react";
import { AlertCircle, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhoneBR, parsePhoneBR } from "@/utils/formatters";

interface FormPhoneInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hint?: string;
}

/**
 * Input para telefone brasileiro com máscara automática
 *
 * @example
 * <FormPhoneInput
 *   label="Telefone"
 *   name="telefone"
 *   value={form.telefone}
 *   onChange={handleChange}
 *   error={errors.telefone}
 *   placeholder="(11) 99999-9999"
 * />
 */
export default function FormPhoneInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "(11) 99999-9999",
  required = false,
  disabled = false,
  className = "",
  hint,
}: FormPhoneInputProps) {
  const hasError = !!error;
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    // Formata o valor recebido do formulário pai
    const formatted = value ? formatPhoneBR(value) : "";
    setLocalValue(formatted);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Apenas remove caracteres não numéricos temporariamente para validação
    const digitsOnly = input.replace(/\D/g, "");

    // Limita a 11 dígitos como o formatador faz
    const limited = digitsOnly.substring(0, 11);

    // Formata para exibição enquanto digita
    const formatted = formatPhoneBR(limited);
    setLocalValue(formatted);

    // Passa o valor bruto (dígitos apenas) para o formulário
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: limited,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Formata o valor quando sair do campo
    let finalValue = localValue;

    if (localValue && localValue.trim()) {
      const formatted = formatPhoneBR(localValue);
      setLocalValue(formatted);
      finalValue = formatted;
    }

    // Atualiza o estado do formulário com o valor formatado
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: finalValue ? parsePhoneBR(finalValue) : "",
        name: name,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);

    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <Label className="text-sm font-medium text-slate-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
          <Phone className="w-4 h-4" />
        </div>
        <Input
          type="text"
          name={name}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={15}
          className={`h-11 rounded-lg mt-1 pl-10 transition-all ${
            hasError
              ? "border-red-500 bg-red-50 text-slate-900 focus:ring-red-500 focus:border-red-500"
              : "bg-white border-slate-200 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500"
          }`}
        />
      </div>

      {hint && !hasError && <p className="text-xs text-slate-500">{hint}</p>}

      {hasError && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
