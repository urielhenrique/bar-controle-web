/**
 * FormInput - Componente reutilizável de input com validação integrada
 * Exibe label, input, contador de caracteres e mensagem de erro
 */

import React, { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  hint?: string;
  icon?: ReactNode;
  autoComplete?: string;
}

/**
 * Input com validação integrada
 *
 * @example
 * <FormInput
 *   label="Nome do Produto"
 *   name="nome"
 *   value={form.nome}
 *   onChange={handleChange}
 *   onBlur={handleBlur}
 *   error={errors.nome}
 *   maxLength={100}
 *   showCharCount={true}
 *   required={true}
 * />
 */
export default function FormInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  type = "text",
  required = false,
  maxLength,
  showCharCount = false,
  disabled = false,
  className = "",
  inputClassName = "",
  hint,
  icon,
  autoComplete,
}: FormInputProps) {
  const hasError = !!error;
  const charCount = String(value).length;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {showCharCount && maxLength && (
          <span
            className={`text-xs ${
              charCount > maxLength * 0.9
                ? "text-orange-400"
                : charCount === maxLength
                  ? "text-red-500"
                  : "text-slate-400"
            }`}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <Input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`h-11 rounded-lg mt-1 transition-all ${
            icon ? "pl-10" : ""
          } ${
            hasError
              ? "border-red-500 bg-red-50 text-slate-900 focus:ring-red-500 focus:border-red-500"
              : "bg-white border-slate-200 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500"
          } ${inputClassName}`}
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
