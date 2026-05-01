/**
 * n8n sends its webhook HTTP responses in an inconsistent format.
 * The body may be prefixed with junk text (e.g. "null"), the payload
 * may be a plain object, an array, or wrapped inside a { json: ... } envelope.
 *
 * This helper normalises all of those shapes into a single typed value.
 */

interface N8nEnvelope {
    json?: unknown;
}

/**
 * Parses a raw n8n webhook response string and returns the first data item.
 * Handles:
 *   - Junk prefix before the actual JSON (e.g. "null{...}")
 *   - Plain object response  { ... }
 *   - Array response         [{ ... }]
 *   - n8n envelope wrapper   [{ json: { ... } }]
 *
 * @param raw - The raw response body string from the n8n webhook.
 * @returns   The unwrapped first item, typed as T.
 * @throws    Error if no valid JSON object or array is found.
 */
export function parseN8nResponse<T>(raw: string): T {

    // Skip any non-JSON prefix (e.g. "null") by finding the first { or [.
    const jsonStart = raw.search(/[\[{]/);
    if (jsonStart === -1) throw new Error("Invalid n8n response: no JSON found.");

    const parsed = JSON.parse(raw.slice(jsonStart)) as N8nEnvelope | N8nEnvelope[] | T | T[];

    // Unwrap array — n8n always wraps items in an array.
    const first = Array.isArray(parsed) ? parsed[0] : parsed;

    // Unwrap n8n envelope — the node output panel hides the { json: ... } wrapper.
    const item = (first as N8nEnvelope)?.json ?? first;

    return item as T;
}

/**
 * Safely parses a JSON string that may be malformed (e.g. prefixed with junk).
 * Used when reading data back from the database that was stored by an earlier
 * broken version of the code.
 *
 * @param raw      - The raw string from the DB column.
 * @param fallback - Value to return if parsing fails (default: []).
 * @returns        The parsed value, or the fallback.
 */
export function safeParseJson<T>(raw: string | null | undefined, fallback: T): T {
    if (!raw) return fallback;

    // If the DB driver already deserialised it (e.g. MySQL JSON column), return as-is.
    if (typeof raw !== "string") return raw as unknown as T;

    try {
        const jsonStart = raw.search(/[\[{]/);
        const cleaned = jsonStart !== -1 ? raw.slice(jsonStart) : raw;
        return JSON.parse(cleaned) as T;
    }
    catch {
        return fallback;
    }
}
