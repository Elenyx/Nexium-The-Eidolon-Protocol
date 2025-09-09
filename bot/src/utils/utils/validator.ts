/**
 * Validate that a value is a non-empty string.
 */
export function isNonEmptyString(val: unknown): val is string {
	return typeof val === 'string' && val.trim().length > 0;
}

/**
 * Validate that a value is a finite number.
 */
export function isNumber(val: unknown): val is number {
	return typeof val === 'number' && Number.isFinite(val);
}

/**
 * Validate that a value is one of the allowed enum values.
 */
export function isEnumValue<T extends string>(val: unknown, allowed: readonly T[]): val is T {
	return typeof val === 'string' && allowed.includes(val as T);
}

/**
 * Validate that a value is not null or undefined.
 */
export function isRequired<T>(val: T | null | undefined): val is T {
	return val !== null && val !== undefined;
}
