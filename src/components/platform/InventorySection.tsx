'use client';

import { useEffect, useMemo, useState } from 'react';
import { Package, AlertTriangle, TrendingDown, Plus, Minus, Sparkles, RotateCcw, Trash2, PackagePlus, X } from 'lucide-react';
import {
  INVENTORY_SEED,
  stockStatus,
  daysLeft,
  suggestedReorder,
  type StockItem,
  type StockStatus,
} from '@/lib/data/platform';
import { SectionHead, GlassCard, Btn, Tag } from '@/components/ui/primitives';
import { formatRs } from '@/lib/utils';

const KEY = 'zz_inventory';

const STATUS_STYLE: Record<StockStatus, { label: string; cls: string; bar: string }> = {
  critical: { label: 'Critical', cls: 'text-rose-400 bg-rose-500/10', bar: 'from-rose-500 to-rose-400' },
  low: { label: 'Low', cls: 'text-amber-400 bg-amber-500/10', bar: 'from-amber-500 to-orange-400' },
  healthy: { label: 'Healthy', cls: 'text-emerald-400 bg-emerald-500/10', bar: 'from-emerald-500 to-teal-400' },
  overstock: { label: 'Overstock', cls: 'text-sky-400 bg-sky-500/10', bar: 'from-sky-500 to-sky-400' },
};

const CATEGORIES: StockItem['category'][] = ['Protein', 'Bakery', 'Produce', 'Sauces', 'Beverages', 'Packaging'];

const inputCls = 'w-full rounded-xl border border-[var(--border-medium)] bg-white/5 px-3 py-2 text-sm outline-none focus:border-orange-500';

const BLANK = { name: '', category: 'Protein' as StockItem['category'], unit: 'pcs', qty: 0, par: 100, reorderAt: 30, dailyUse: 10, cost: 50 };

export function InventorySection() {
  const [items, setItems] = useState<StockItem[]>(INVENTORY_SEED);
  const [filter, setFilter] = useState<'all' | StockStatus>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ ...BLANK });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const save = (next: StockItem[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const adjust = (id: string, delta: number) =>
    save(items.map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)));

  const restock = (id: string) =>
    save(items.map((i) => (i.id === id ? { ...i, qty: i.qty + suggestedReorder(i) } : i)));

  const remove = (id: string) => save(items.filter((i) => i.id !== id));

  const reset = () => save(INVENTORY_SEED);

  const restockAll = () =>
    save(items.map((i) => (['critical', 'low'].includes(stockStatus(i)) ? { ...i, qty: i.qty + suggestedReorder(i) } : i)));

  const addItem = () => {
    if (!draft.name.trim()) return;
    const item: StockItem = {
      ...draft,
      name: draft.name.trim(),
      id: `u${Date.now()}`,
      qty: Math.max(0, Number(draft.qty) || 0),
      par: Math.max(1, Number(draft.par) || 1),
      reorderAt: Math.max(1, Number(draft.reorderAt) || 1),
      dailyUse: Math.max(1, Number(draft.dailyUse) || 1),
      cost: Math.max(0, Number(draft.cost) || 0),
    };
    save([item, ...items]);
    setDraft({ ...BLANK });
    setShowAdd(false);
  };

  const stats = useMemo(() => {
    const value = items.reduce((s, i) => s + i.qty * i.cost, 0);
    const critical = items.filter((i) => stockStatus(i) === 'critical').length;
    const low = items.filter((i) => stockStatus(i) === 'low').length;
    const reorderCost = items
      .filter((i) => ['critical', 'low'].includes(stockStatus(i)))
      .reduce((s, i) => s + suggestedReorder(i) * i.cost, 0);
    return { value, critical, low, reorderCost };
  }, [items]);

  const shown = filter === 'all' ? items : items.filter((i) => stockStatus(i) === filter);
  const alerts = items
    .filter((i) => ['critical', 'low'].includes(stockStatus(i)))
    .sort((a, b) => daysLeft(a) - daysLeft(b));

  return (
    <div className="space-y-6">
      <SectionHead
        eyebrow="Operations"
        title="Inventory Management"
        subtitle="Live stock levels for the truck with AI reorder intelligence - par-level tracking, days-of-cover forecasting, add / remove items, and one-tap smart restock."
      />

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-4">
        <GlassCard className="text-center">
          <Package className="mx-auto h-5 w-5 text-orange-400" />
          <p className="mt-1.5 text-xl font-black text-gradient">{formatRs(stats.value)}</p>
          <p className="text-muted text-[0.65rem]">Stock value on hand</p>
        </GlassCard>
        <GlassCard className="text-center">
          <AlertTriangle className="mx-auto h-5 w-5 text-rose-400" />
          <p className="mt-1.5 text-xl font-black text-rose-400">{stats.critical}</p>
          <p className="text-muted text-[0.65rem]">Critical items</p>
        </GlassCard>
        <GlassCard className="text-center">
          <TrendingDown className="mx-auto h-5 w-5 text-amber-400" />
          <p className="mt-1.5 text-xl font-black text-amber-400">{stats.low}</p>
          <p className="text-muted text-[0.65rem]">Low stock items</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Sparkles className="mx-auto h-5 w-5 text-teal-400" />
          <p className="mt-1.5 text-xl font-black text-teal-400">{formatRs(stats.reorderCost)}</p>
          <p className="text-muted text-[0.65rem]">Suggested reorder cost</p>
        </GlassCard>
      </div>

      {/* AI reorder panel */}
      {alerts.length > 0 && (
        <GlassCard className="border border-orange-500/30 bg-orange-500/5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-orange-400" /> AI Reorder Suggestions
            </h3>
            <Btn onClick={restockAll}>Smart restock all ({alerts.length})</Btn>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-xl bg-white/5 p-2.5 text-xs">
                <div>
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-muted">{daysLeft(i)}d cover · order {suggestedReorder(i)} {i.unit}</p>
                </div>
                <button onClick={() => restock(i.id)} className="rounded-lg bg-orange-500/20 px-2.5 py-1 font-bold text-orange-400 transition hover:bg-orange-500/30">
                  Reorder
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {(['all', 'critical', 'low', 'healthy', 'overstock'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
              filter === f ? 'bg-orange-500 text-white' : 'border border-[var(--border-medium)] text-muted hover:text-[var(--text-primary)]'
            }`}
          >
            {f} {f !== 'all' && `(${items.filter((i) => stockStatus(i) === f).length})`}
          </button>
        ))}
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="ml-auto flex items-center gap-1.5 rounded-full bg-teal-500/15 px-3 py-1.5 text-xs font-bold text-teal-400 transition hover:bg-teal-500/25"
        >
          {showAdd ? <X className="h-3.5 w-3.5" /> : <PackagePlus className="h-3.5 w-3.5" />} {showAdd ? 'Cancel' : 'Add item'}
        </button>
        <button onClick={reset} className="flex items-center gap-1 text-xs text-muted hover:text-[var(--text-primary)]">
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Add-item form */}
      {showAdd && (
        <GlassCard className="border border-teal-500/30">
          <h3 className="mb-3 flex items-center gap-2 font-semibold"><PackagePlus className="h-4 w-4 text-teal-400" /> New stock item</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Item name" className="sm:col-span-2 lg:col-span-2">
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addItem()} placeholder="e.g. Cheese Slices" className={inputCls} />
            </Field>
            <Field label="Category">
              <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as StockItem['category'] })} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Unit">
              <input value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} placeholder="pcs / kg / L" className={inputCls} />
            </Field>
            <Field label="Current qty"><NumIn v={draft.qty} on={(v) => setDraft({ ...draft, qty: v })} /></Field>
            <Field label="Par (target)"><NumIn v={draft.par} on={(v) => setDraft({ ...draft, par: v })} /></Field>
            <Field label="Reorder at"><NumIn v={draft.reorderAt} on={(v) => setDraft({ ...draft, reorderAt: v })} /></Field>
            <Field label="Daily use"><NumIn v={draft.dailyUse} on={(v) => setDraft({ ...draft, dailyUse: v })} /></Field>
            <Field label="Cost / unit (Rs.)"><NumIn v={draft.cost} on={(v) => setDraft({ ...draft, cost: v })} /></Field>
          </div>
          <div className="mt-4 flex gap-2">
            <Btn onClick={addItem} disabled={!draft.name.trim()}>Add to inventory</Btn>
            <Btn variant="secondary" onClick={() => { setShowAdd(false); setDraft({ ...BLANK }); }}>Cancel</Btn>
          </div>
        </GlassCard>
      )}

      {/* Stock table */}
      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border-medium)] text-left text-[0.65rem] uppercase tracking-wide text-muted">
              <th className="p-3">Item</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock level</th>
              <th className="p-3">Cover</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((i) => {
              const st = stockStatus(i);
              const pct = Math.min(100, Math.round((i.qty / i.par) * 100));
              return (
                <tr key={i.id} className="border-b border-white/5 last:border-0">
                  <td className="p-3">
                    <p className="font-semibold">{i.name}</p>
                    <p className="text-muted text-[0.65rem]">{formatRs(i.cost)}/{i.unit}</p>
                  </td>
                  <td className="p-3 text-muted text-xs">{i.category}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full bg-gradient-to-r ${STATUS_STYLE[st].bar}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold">{i.qty}<span className="text-muted">/{i.par} {i.unit}</span></span>
                    </div>
                  </td>
                  <td className="p-3 text-xs">{daysLeft(i)}d</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${STATUS_STYLE[st].cls}`}>{STATUS_STYLE[st].label}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => adjust(i.id, -1)} className="rounded-lg bg-white/5 p-1.5 hover:bg-white/10" aria-label="Decrease">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => adjust(i.id, +1)} className="rounded-lg bg-white/5 p-1.5 hover:bg-white/10" aria-label="Increase">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      {['critical', 'low'].includes(st) && (
                        <button onClick={() => restock(i.id)} className="rounded-lg bg-orange-500/20 px-2 py-1 text-[0.65rem] font-bold text-orange-400 hover:bg-orange-500/30" title="Smart restock to par">
                          +{suggestedReorder(i)}
                        </button>
                      )}
                      <button onClick={() => remove(i.id)} className="rounded-lg bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20" aria-label="Delete item" title="Delete item">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && <p className="text-muted p-6 text-center text-sm">No items in this category. Add one above or switch filters.</p>}
      </GlassCard>

      <p className="text-muted flex items-center gap-1.5 text-xs">
        <Tag variant="teal">Tip</Tag> Every change (add, delete, restock, +/-) is saved in your browser. &ldquo;Days of cover&rdquo; = current stock divided by average daily use.
      </p>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}

function NumIn({ v, on }: { v: number; on: (v: number) => void }) {
  return (
    <input
      type="number"
      min={0}
      value={v}
      onChange={(e) => on(e.target.value === '' ? 0 : Number(e.target.value))}
      className={inputCls}
    />
  );
}
