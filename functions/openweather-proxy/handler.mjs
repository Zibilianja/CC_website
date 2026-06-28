/**
 * AWS Lambda handler (HTTP API / Function URL).
 * Deploy with OPENWEATHER_API_KEY set in Lambda environment — never in the client.
 *
 * Allowed route: GET /weather?lat=39.7392&lon=-104.9903 (fixed Denver sample only)
 */

const DENVER_LAT = 39.7392;
const DENVER_LON = -104.9903;
const CACHE_TTL_MS = 15 * 60 * 1000;
const RATE_LIMIT_PER_HOUR = 30;
const DAILY_CAP = 1800;

const responseCache = { value: null, expiresAt: 0 };
const rateByIp = new Map();
let dailyCount = 0;
let dailyDate = '';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  };
}

function clientIp(event) {
  return (
    event.requestContext?.http?.sourceIp ??
    event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ??
    'unknown'
  );
}

function checkRateLimit(ip) {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  let entry = rateByIp.get(ip);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + hourMs };
    rateByIp.set(ip, entry);
  }

  entry.count += 1;
  return entry.count <= RATE_LIMIT_PER_HOUR;
}

function checkDailyCap() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dailyDate) {
    dailyDate = today;
    dailyCount = 0;
  }
  dailyCount += 1;
  return dailyCount <= DAILY_CAP;
}

function isAllowedQuery(params) {
  const lat = parseFloat(params.lat);
  const lon = parseFloat(params.lon);
  return (
    Math.abs(lat - DENVER_LAT) < 0.01 && Math.abs(lon - DENVER_LON) < 0.01
  );
}

export async function handler(event) {
  const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
  if (!apiKey) {
    return json(503, { error: 'Weather proxy not configured' });
  }

  const path = event.rawPath ?? event.path ?? '';
  if (!path.endsWith('/weather')) {
    return json(404, { error: 'Not found' });
  }

  const params = event.queryStringParameters ?? {};
  if (!isAllowedQuery(params)) {
    return json(400, { error: 'Only the configured sample location is supported' });
  }

  const ip = clientIp(event);
  if (!checkRateLimit(ip)) {
    return json(429, { error: 'Rate limit exceeded. Try again later.' });
  }

  const now = Date.now();
  if (responseCache.value && responseCache.expiresAt > now) {
    return json(200, responseCache.value);
  }

  if (!checkDailyCap()) {
    return json(503, {
      error: 'Daily upstream call limit reached. Data will refresh tomorrow.',
    });
  }

  const query = `lat=${DENVER_LAT}&lon=${DENVER_LON}&units=metric&appid=${apiKey}`;
  const upstream = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${query}`
  );

  const body = await upstream.json();
  if (!upstream.ok) {
    return json(upstream.status, {
      error: body.message ?? 'OpenWeather request failed',
    });
  }

  responseCache.value = body;
  responseCache.expiresAt = now + CACHE_TTL_MS;

  return json(200, body);
}
