/**
 * Validate that a value is a non-empty string.
 */
export declare function isNonEmptyString(val: unknown): val is string;
/**
 * Validate that a value is a finite number.
 */
export declare function isNumber(val: unknown): val is number;
/**
 * Validate that a value is one of the allowed enum values.
 */
export declare function isEnumValue<T extends string>(val: unknown, allowed: readonly T[]): val is T;
/**
 * Validate that a value is not null or undefined.
 */
export declare function isRequired<T>(val: T | null | undefined): val is T;
