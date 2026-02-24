/**
 * FormPhoneInput - Input especializado para telefone brasileiro
 * Com máscara automática e validação
 */

import React from "react";
import { AlertCircle, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhoneBR } from "@/utils/formatters";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneBR(e.target.value);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formatted,
      },
    };
    
    onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
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
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={15}
          className={`h-11 rounded-lg mt-1 pl-10 transition-all ${
            hasError
              ? "border-red-500 bg-red-50 text-slate-900 focus:ring-red-500 focus:border-red-500"
              : "bg-slate-100 border-slate-200 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500"
          }`}
        />
      </div>

      {hint && !hasError && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}

      {hasError && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
