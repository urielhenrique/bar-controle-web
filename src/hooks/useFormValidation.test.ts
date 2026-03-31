import { describe, expect, it } from "vitest";
import {
  isMaliciousValidationResult,
  type ValidationResult,
} from "./useFormValidation";

describe("useFormValidation security helpers", () => {
  it("returns true when validation result is malicious", () => {
    const result: ValidationResult = {
      isValid: false,
      error: "Payload bloqueado",
      code: "MALICIOUS_INPUT",
    };

    expect(isMaliciousValidationResult(result)).toBe(true);
  });

  it("returns false for regular validation errors", () => {
    const result: ValidationResult = {
      isValid: false,
      error: "Campo obrigatório",
      code: "REQUIRED",
    };

    expect(isMaliciousValidationResult(result)).toBe(false);
  });

  it("returns false for valid results or undefined", () => {
    const valid: ValidationResult = { isValid: true };

    expect(isMaliciousValidationResult(valid)).toBe(false);
    expect(isMaliciousValidationResult(undefined)).toBe(false);
  });
});
