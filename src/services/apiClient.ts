interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

const cache = new Map<string, CacheEntry<unknown>>();

export async function fetchJson<T>(
  url: string,
  options?: { ttlMs?: number; init?: RequestInit }
): Promise<T> {
  const ttlMs = options?.ttlMs ?? 5 * 60 * 1000;
  const cached = cache.get(url);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }

  const response = await fetch(url, options?.init);

  if (!response.ok) {
    let detail = '';
    try {
      const errBody = (await response.json()) as {
        message?: string;
        detail?: string;
        error?: string;
      };
      detail = errBody.error ?? errBody.message ?? errBody.detail ?? '';
    } catch {
      // Response body was not JSON — use status only.
    }

    throw new Error(
      detail
        ? `Request failed (${response.status}): ${detail}`
        : `Request failed (${response.status}): ${url}`
    );
  }

  const value = (await response.json()) as T;
  cache.set(url, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

export function clearApiCache() {
  cache.clear();
}
