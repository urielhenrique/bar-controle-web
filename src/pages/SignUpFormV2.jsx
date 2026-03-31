/**
 * SignUpFormV2 - Exemplo de formulário de cadastro com validações robustas
 * Usa: validators, useFormValidation, FormInput
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FormInput from "@/components/shared/FormInput";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/utils/validators";

export default function SignUpFormV2() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Configuração de validadores
  const validators = {
    username: {
      validator: validateUsername,
      validateOnChange: true,
    },
    email: {
      validator: validateEmail,
      sanitizer: (val) => val.toLowerCase().trim(),
      validateOnChange: true,
    },
    password: {
      validator: validatePassword,
      validateOnChange: true,
    },
    passwordConfirm: {
      validator: (val) => {
        if (!val) {
          return {
            isValid: false,
            error: "Confirmação de senha é obrigatória",
          };
        }
        // Será comparado no submit
        return { isValid: true };
      },
      validateOnChange: true,
    },
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    shouldShowError,
  } = useFormValidation(
    {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validators,
  );

  const onSubmit = async (formValues) => {
    setServerError("");
    setSuccessMessage("");

    // Validação extra: comparar senhas
    if (formValues.password !== formValues.passwordConfirm) {
      setServerError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      // Aqui chamaria seu endpoint de cadastro
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar conta");
      }

      setSuccessMessage("Conta criada com sucesso! Redirecionando...");

      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error);
      setServerError(error.message || "Erro ao criar conta. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center border border-emerald-500">
              <span className="text-2xl font-bold text-white">📊</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Criar Conta</h2>
          <p className="mt-2 text-sm text-slate-400">Cadastre-se no BarStock</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
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

          {/* Username */}
          <FormInput
            label="Nome de Usuário"
            name="username"
            type="text"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError("username") ? errors.username : undefined}
            placeholder="seu_usuario"
            required={true}
            hint="3-50 caracteres (letras, números, - e _)"
            autoComplete="username"
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
            placeholder="seu@email.com"
            required={true}
            autoComplete="email"
          />

          {/* Password */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-slate-200">
              Senha
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full h-11 rounded-lg mt-1 px-4 pr-10 transition-all text-sm ${
                  shouldShowError("password")
                    ? "border-red-500 bg-red-50 text-slate-900 focus:ring-red-500 focus:border-red-500"
                    : "bg-slate-100 border-slate-200 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {shouldShowError("password") && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.password}</span>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-1">
              Mínimo 8 caracteres, 1 letra e 1 número
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-slate-200">
              Confirmar Senha
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="passwordConfirm"
                value={values.passwordConfirm}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`w-full h-11 rounded-lg mt-1 px-4 pr-10 transition-all text-sm ${
                  shouldShowError("passwordConfirm")
                    ? "border-red-500 bg-red-50 text-slate-900 focus:ring-red-500 focus:border-red-500"
                    : "bg-slate-100 border-slate-200 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {shouldShowError("passwordConfirm") && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.passwordConfirm}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </Button>

          {/* Link para login */}
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-emerald-500 hover:text-emerald-400 font-medium"
              >
                Faça login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
