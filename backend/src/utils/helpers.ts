/**
 * Type-safe helpers for Express 5 request properties (params, query).
 * Express 5 types are stricter: (string | string[] | undefined).
 * These helpers ensure we always get a single string or a fallback.
 */

/**
 * Extracts a single string from a query or param value.
 * If it's an array, takes the first element.
 */
export const qs = (v: unknown, defaultVal = ''): string => {
    if (typeof v === 'string') return v;
    if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
    return defaultVal;
};

/**
 * Extracts a number from a query or param value.
 */
export const qn = (v: unknown, defaultVal?: number): number | undefined => {
    const s = qs(v);
    if (!s) return defaultVal;
    const n = parseInt(s, 10);
    return isNaN(n) ? defaultVal : n;
};
