/**
 * FormCurrencyInput - Input especializado para moeda brasileira
 * Com formatação automática e validação
 */

import React, { useEffect, useState } from "react";
import { AlertCircle, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseCurrencyBR } from "@/utils/formatters";

interface FormCurrencyInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  minimum?: number;
  maximum?: number;
  hint?: string;
}

/**
 * Input para moeda brasileira com formatação automática
 *
 * @example
 * <FormCurrencyInput
 *   label="Preço de Venda"
 *   name="precoVenda"
 *   value={form.precoVenda}
 *   onChange={handleChange}
 *   error={errors.precoVenda}
 *   required={true}
 *   minimum={0}
 * />
 */
export default function FormCurrencyInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "R$ 0,00",
  required = false,
  disabled = false,
  className = "",
  minimum = 0,
  maximum = 999999.99,
  hint,
}: FormCurrencyInputProps) {
  const hasError = !!error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^\d.,]/g, "");

    setLocalValue(sanitized);

    // Cria um evento sintético com o valor sanitizado
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitized,
      },
    };

    onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  const rawValue = String(value ?? "");
  const displayValue =
    rawValue === "0" || rawValue === "0,00" || rawValue === "0.00"
      ? ""
      : rawValue;
  const numericValue = parseCurrencyBR(String(value));

  const [localValue, setLocalValue] = useState(displayValue);

  useEffect(() => {
    setLocalValue(displayValue);
  }, [displayValue]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (rawValue === "0" || rawValue === "0,00" || rawValue === "0.00") {
      setLocalValue("");
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: "",
        },
      };

      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {numericValue > 0 && (
          <span className="text-xs text-slate-400">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(numericValue)}
          </span>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
          <DollarSign className="w-4 h-4" />
        </div>
        <Input
          type="text"
          name={name}
          value={localValue}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]{0,2}"
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

      {numericValue < minimum && numericValue > 0 && (
        <p className="text-xs text-orange-600">
          Mínimo: R${" "}
          {minimum.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      )}

      {numericValue > maximum && (
        <p className="text-xs text-orange-600">
          Máximo: R${" "}
          {maximum.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      )}
    </div>
  );
}
