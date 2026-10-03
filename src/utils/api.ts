/**
 * Safe JSON parser for Fetch API Responses.
 * Prevents "Unexpected end of JSON input" errors if the server returns empty,
 * HTML, 204 No Content, or malformed responses.
 */
export async function safeParseJson<T = any>(res: Response | null | undefined, fallbackValue: T = {} as T): Promise<T> {
  if (!res) return fallbackValue;
  try {
    let text = '';
    try {
      text = await res.text();
    } catch {
      return fallbackValue;
    }
    if (!text || !text.trim()) {
      return (res.ok ? { success: true } : { success: false, error: `HTTP ${res.status}: ${res.statusText || 'No response data'}` }) as unknown as T;
    }
    const clean = text.trim().replace(/^\uFEFF/, '');
    if (!clean.startsWith('{') && !clean.startsWith('[')) {
      return (res.ok ? { success: true } : { success: false, error: 'Server returned a non-JSON response' }) as unknown as T;
    }
    return JSON.parse(clean) as T;
  } catch (err: any) {
    console.warn(`[SafeAPI] JSON parse warning on ${res?.url || 'request'} (status ${res?.status}):`, err?.message || err);
    return (res.ok ? { success: true } : { success: false, error: 'Server response could not be parsed' }) as unknown as T;
  }
}
