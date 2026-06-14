'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { GlassCard, Btn, ErrorBanner } from '@/components/ui/primitives';
import { fetchJson } from '@/lib/utils';
import { useNav } from '@/components/providers/NavProvider';
import type { PageId } from '@/lib/data/zz';

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  category: string;
  score: number;
}

const CAT_TO_PAGE: Record<string, PageId> = {
  report: 'report',
  persona: 'part4',
  forecast: 'part2',
  competitor: 'part3',
  brand: 'part1',
  ai: 'transparency',
};

export function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { goTo } = useNav();

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchJson<{ results: SearchResult[]; source: string }>('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, topK: 8 }),
      });
      setResults(data.results);
      setSource(data.source);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard>
      <div className="mb-4 flex items-center gap-2">
        <Search className="h-5 w-5 text-orange-400" />
        <h3 className="font-bold">Semantic Search & RAG</h3>
        {source && <span className="text-[0.65rem] text-stone-500">{source} retrieval</span>}
      </div>
      <div className="mb-3 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Search report, personas, forecasts..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
        />
        <Btn onClick={search} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Btn>
      </div>
      {error && <ErrorBanner message={error} onRetry={search} />}
      <div className="space-y-2">
        {results.map((r) => (
          <button
            key={r.id}
            onClick={() => goTo(CAT_TO_PAGE[r.category] || 'cover')}
            className="w-full rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition hover:border-orange-500/30"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-orange-300">{r.title}</span>
              <span className="text-[0.6rem] text-stone-500">{r.category}</span>
            </div>
            <p className="mt-1 text-xs text-stone-400 line-clamp-2">{r.snippet}</p>
          </button>
        ))}
        {!results.length && !loading && (
          <p className="text-center text-sm text-stone-500">Try: &quot;hygiene interview findings&quot; or &quot;recovery strategy&quot;</p>
        )}
      </div>
    </GlassCard>
  );
}
