import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRs(n: number): string {
  if (n >= 1e6) return `Rs. ${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `Rs. ${(n / 1e3).toFixed(0)}K`;
  return `Rs. ${Math.round(n).toLocaleString()}`;
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const text = await res.text();
  let data: { error?: string } & T = {} as { error?: string } & T;
  if (text.trim()) {
    try {
      data = JSON.parse(text) as typeof data;
    } catch {
      throw new Error('Invalid response from server');
    }
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}
