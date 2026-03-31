/**
 * Hook reutilizável para validações de formulário
 * Gerencia estado de erros, validação em tempo real e no submit
 */

import { useState, useCallback, useMemo } from "react";

/**
 * Interface para configuração de validação de um campo
 */
export interface FieldValidationConfig {
  validator: (value: any) => {
    isValid: boolean;
    error?: string;
    code?: string;
  };
  sanitizer?: (value: any) => any;
  validateOnChange?: boolean; // Default: true
  validateOnBlur?: boolean; // Default: false
}

/**
 * Map de validadores para cada campo
 */
export type ValidatorsMap = Record<string, FieldValidationConfig>;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  code?: string;
}

export const isMaliciousValidationResult = (
  result?: ValidationResult,
): boolean => {
  return !result?.isValid && result.code === "MALICIOUS_INPUT";
};

/**
 * Hook para gerenciar validações de formulário
 *
 * @example
 * const {
 *   values,
 *   errors,
 *   handleChange,
 *   handleBlur,
 *   handleSubmit,
 *   isValid,
 *   setFieldValue,
 *   setFieldError,
 *   clearErrors,
 *   resetValues,
 * } = useFormValidation(
 *   { name: "", email: "" },
 *   {
 *     name: {
 *       validator: validateProductName,
 *       sanitizer: sanitizeInput,
 *       validateOnChange: true,
 *     },
 *     email: {
 *       validator: validateEmail,
 *       validateOnChange: true,
 *     },
 *   }
 * );
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validators: ValidatorsMap = {},
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  /**
   * Valida um campo individual
   */
  const validateField = useCallback(
    (fieldName: string, fieldValue: any): string | undefined => {
      const config = validators[fieldName];

      if (!config) {
        return undefined;
      }

      const validation = config.validator(fieldValue);

      if (!validation.isValid) {
        return validation.error;
      }

      return undefined;
    },
    [validators],
  );

  /**
   * Valida todos os campos
   */
  const validateAll = useCallback(
    (valuesToValidate: T): Partial<Record<keyof T, string>> => {
      const newErrors: Partial<Record<keyof T, string>> = {};

      Object.keys(validators).forEach((fieldName) => {
        const error = validateField(
          fieldName,
          valuesToValidate[fieldName as keyof T],
        );
        if (error) {
          newErrors[fieldName as keyof T] = error;
        }
      });

      return newErrors;
    },
    [validateField, validators],
  );

  /**
   * Handler para onChange
   */
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;

      let processedValue = value;

      // Aplica sanitização se configurada
      if (validators[name]?.sanitizer) {
        processedValue = validators[name].sanitizer!(value);
      }

      // Bloqueia payloads maliciosos sem alterar a digitação de textos legítimos.
      const changeValidation = validators[name]?.validator?.(processedValue);
      if (isMaliciousValidationResult(changeValidation)) {
        setErrors((prev) => ({ ...prev, [name]: changeValidation.error }));
        return;
      }

      const newValues = { ...values, [name]: processedValue };
      setValues(newValues);

      // Valida em tempo real se configurado
      if (validators[name]?.validateOnChange !== false) {
        const error = validateField(name, processedValue);

        setErrors((prev) => {
          if (error) {
            return { ...prev, [name]: error };
          } else {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          }
        });
      }
    },
    [values, validators, validateField],
  );

  /**
   * Handler para onBlur
   */
  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name } = e.target;

      setTouched((prev) => ({ ...prev, [name]: true }));

      // Valida no blur se configurado
      if (validators[name]?.validateOnBlur) {
        const error = validateField(name, values[name as keyof T]);

        setErrors((prev) => {
          if (error) {
            return { ...prev, [name]: error };
          } else {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          }
        });
      }
    },
    [values, validators, validateField],
  );

  /**
   * Handler para submit
   * Retorna true se todos os campos são válidos
   */
  const handleSubmit = useCallback(
    (onSubmit?: (values: T) => void | Promise<void>) => {
      return async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Marca todos os campos como tocados
        const allTouched = Object.keys(validators).reduce(
          (acc, fieldName) => {
            acc[fieldName as keyof T] = true;
            return acc;
          },
          {} as Partial<Record<keyof T, boolean>>,
        );
        setTouched(allTouched);

        // Valida todos
        const newErrors = validateAll(values);
        setErrors(newErrors);

        // Se há erros, não submete
        if (Object.keys(newErrors).length > 0) {
          return;
        }

        // Chaama callback se fornecido
        if (onSubmit) {
          try {
            await onSubmit(values);
          } catch (error) {
            console.error("Erro ao submeter formulário:", error);
          }
        }
      };
    },
    [values, validators, validateAll],
  );

  /**
   * Define valor de um campo manualmente
   */
  const setFieldValue = useCallback(
    (fieldName: keyof T, value: any) => {
      let processedValue = value;

      if (validators[fieldName as string]?.sanitizer) {
        processedValue = validators[fieldName as string].sanitizer!(value);
      }

      const newValues = { ...values, [fieldName]: processedValue };
      setValues(newValues);

      // Valida o campo se configurado
      if (validators[fieldName as string]?.validateOnChange !== false) {
        const error = validateField(fieldName as string, processedValue);

        setErrors((prev) => {
          if (error) {
            return { ...prev, [fieldName]: error };
          } else {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          }
        });
      }
    },
    [values, validators, validateField],
  );

  /**
   * Define erro de um campo manualmente
   * Útil para erros do servidor
   */
  const setFieldError = useCallback(
    (fieldName: keyof T, error: string | undefined) => {
      setErrors((prev) => {
        if (error) {
          return { ...prev, [fieldName]: error };
        } else {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        }
      });
    },
    [],
  );

  /**
   * Limpa todos os erros
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Limpa um campo específico
   */
  const clearFieldError = useCallback((fieldName: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Reseta valores para inicial
   */
  const resetValues = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Verifica se formulário é válido (nenhum erro)
   */
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  /**
   * Retorna se um campo foi tocado
   */
  const isFieldTouched = useCallback(
    (fieldName: keyof T): boolean => {
      return touched[fieldName] === true;
    },
    [touched],
  );

  /**
   * Retorna se um campo tem erro
   */
  const getFieldError = useCallback(
    (fieldName: keyof T): string | undefined => {
      return errors[fieldName];
    },
    [errors],
  );

  /**
   * Retorna se deve exibir erro (foi tocado ou tentou submeter)
   */
  const shouldShowError = useCallback(
    (fieldName: keyof T): boolean => {
      return isFieldTouched(fieldName) && !!getFieldError(fieldName);
    },
    [isFieldTouched, getFieldError],
  );

  return {
    // Estado
    values,
    errors,
    touched,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Setters manuais
    setFieldValue,
    setFieldError,
    setValues,

    // Limpadores
    clearErrors,
    clearFieldError,
    resetValues,

    // Queries
    isValid,
    isFieldTouched,
    getFieldError,
    shouldShowError,

    // Validação manual
    validateField,
    validateAll,
  };
}

/**
 * Hook alternativo simplificado para validações básicas
 * Ideal para formulários simples
 */
export function useSimpleFormValidation<T extends Record<string, any>>(
  initialValues: T,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      // Remove erro quando usuário começa a corrigir
      if (errors[name as keyof T]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof T];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const setFieldError = useCallback(
    (fieldName: keyof T, error: string | undefined) => {
      setErrors((prev) => {
        if (error) {
          return { ...prev, [fieldName]: error };
        } else {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        }
      });
    },
    [],
  );

  const resetValues = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    values,
    errors,
    handleChange,
    setFieldError,
    setValues,
    resetValues,
    isValid,
  };
}
