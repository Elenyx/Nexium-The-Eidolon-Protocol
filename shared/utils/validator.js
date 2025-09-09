/**
 * Validate that a value is a non-empty string.
 */
export function isNonEmptyString(val) {
    return typeof val === 'string' && val.trim().length > 0;
}
/**
 * Validate that a value is a finite number.
 */
export function isNumber(val) {
    return typeof val === 'number' && Number.isFinite(val);
}
/**
 * Validate that a value is one of the allowed enum values.
 */
export function isEnumValue(val, allowed) {
    return typeof val === 'string' && allowed.includes(val);
}
/**
 * Validate that a value is not null or undefined.
 */
export function isRequired(val) {
    return val !== null && val !== undefined;
}
