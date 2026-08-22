/** Machine-readable reasons a value can fail validation. */
export type ValidationError =
  | "INVALID_FORMAT"
  | "INVALID_LENGTH"
  | "INVALID_CHECKSUM"
  | "UNSUPPORTED_COUNTRY";

/** The outcome of validating a bank/account value. */
export interface ValidationResult {
  valid: boolean;
  value: string;
  error: ValidationError | null;
}

export function ok(value: string): ValidationResult {
  return { valid: true, value, error: null };
}

export function fail(value: string, error: ValidationError): ValidationResult {
  return { valid: false, value, error };
}
