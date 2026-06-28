import type { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';
import { loadEnv, type Plugin } from 'vite';
import type { Connect } from 'vite';

type ProxyRequest = IncomingMessage & { url?: string };
type ProxyResponse = ServerResponse;

const CACHE_TTL_MS = 15 * 60 * 1000;
const RATE_LIMIT_PER_HOUR = 120;

const UPSTREAM_BASE = 'https://api.openweathermap.org/data/2.5';

const ALLOWED_ENDPOINTS = new Set([
  'weather',
  'air_pollution',
  'forecast',
  'uvi',
]);

interface RateEntry {
  count: number;
  resetAt: number;
}

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

function createProxyMiddleware(apiKey: string | undefined): Connect.NextHandleFunction {
  const cache = new Map<string, CacheEntry>();
  const rateByIp = new Map<string, RateEntry>();
  let dailyCount = 0;
  let dailyDate = '';

  return async (req, res, next) => {
    const request = req as ProxyRequest;
    const response = res as ProxyResponse;

    if (!request.url?.startsWith('/api/openweather/')) {
      next();
      return;
    }

    if (!apiKey) {
      response.statusCode = 503;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: 'Set OPENWEATHER_API_KEY in .env (server-only)' }));
      return;
    }

    const pathParts = request.url.split('?')[0].split('/');
    const endpoint = pathParts[pathParts.length - 1];

    if (!ALLOWED_ENDPOINTS.has(endpoint)) {
      response.statusCode = 404;
      response.end(JSON.stringify({ error: 'Not found' }));
      return;
    }

    const url = new URL(request.url, 'http://localhost');
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    const zip = url.searchParams.get('zip');

    let upstreamQuery = '';
    let cacheKey = '';

    if (endpoint === 'weather' && zip) {
      upstreamQuery = `zip=${encodeURIComponent(zip)}&units=metric&appid=${apiKey}`;
      cacheKey = `${endpoint}:zip:${zip}`;
    } else if (lat && lon) {
      const latN = parseFloat(lat);
      const lonN = parseFloat(lon);
      if (!Number.isFinite(latN) || !Number.isFinite(lonN)) {
        response.statusCode = 400;
        response.end(JSON.stringify({ error: 'Invalid lat/lon' }));
        return;
      }
      const units = endpoint === 'weather' || endpoint === 'forecast' ? '&units=metric' : '';
      upstreamQuery = `lat=${latN}&lon=${lonN}${units}&appid=${apiKey}`;
      cacheKey = `${endpoint}:point:${latN.toFixed(3)},${lonN.toFixed(3)}`;
    } else {
      response.statusCode = 400;
      response.end(JSON.stringify({ error: 'Provide lat/lon or zip (weather only)' }));
      return;
    }

    const ip = request.socket?.remoteAddress ?? 'local';
    const now = Date.now();
    let rate = rateByIp.get(ip);
    if (!rate || now > rate.resetAt) {
      rate = { count: 0, resetAt: now + 60 * 60 * 1000 };
      rateByIp.set(ip, rate);
    }
    rate.count += 1;
    if (rate.count > RATE_LIMIT_PER_HOUR) {
      response.statusCode = 429;
      response.end(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }));
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (today !== dailyDate) {
      dailyDate = today;
      dailyCount = 0;
    }

    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Cache-Control', 'public, max-age=300');
      response.end(JSON.stringify(cached.value));
      return;
    }

    if (dailyCount >= 1800) {
      response.statusCode = 503;
      response.end(
        JSON.stringify({
          error: 'Daily upstream call limit reached for dev proxy.',
        })
      );
      return;
    }

    dailyCount += 1;

    const upstream = await fetch(`${UPSTREAM_BASE}/${endpoint}?${upstreamQuery}`);
    const body = (await upstream.json()) as { message?: string };

    if (!upstream.ok) {
      response.statusCode = upstream.status;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: body.message ?? 'OpenWeather request failed' }));
      return;
    }

    cache.set(cacheKey, { value: body, expiresAt: now + CACHE_TTL_MS });

    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Cache-Control', 'public, max-age=300');
    response.end(JSON.stringify(body));
  };
}

export function openweatherProxy(): Plugin {
  function attach(server: {
    config: { mode: string; root: string };
    middlewares: { use: (fn: Connect.NextHandleFunction) => void };
  }) {
    const env = loadEnv(server.config.mode, server.config.root, '');
    const apiKey =
      env.OPENWEATHER_API_KEY?.trim() || env.VITE_OPENWEATHER_API_KEY?.trim();
    server.middlewares.use(createProxyMiddleware(apiKey));
  }

  return {
    name: 'openweather-proxy',
    configureServer(server) {
      attach(server);
    },
    configurePreviewServer(server) {
      attach(server);
    },
  };
}
