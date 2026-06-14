import { NextResponse } from 'next/server';

export function jsonOk<T extends Record<string, unknown>>(data: T, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: true, ...data, ...extra });
}

export function jsonError(message: string, status = 500, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export async function parseBody<T>(req: Request): Promise<T> {
  const text = await req.text();
  if (!text.trim()) {
    throw new Error('Request body is required');
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Invalid JSON in request body');
  }
}

export function rateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'local';
}

const hits = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(key: string, max = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
