'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star, Clock, Truck, Eye, EyeOff, Gauge, Radio, Zap } from 'lucide-react';
import {
  TRUCK,
  TRUCK_ROUTE,
  COMPETITORS_GEO,
  canvasKm,
  truckStateAt,
  minutesOfDay,
  demoMinutes,
  type CompetitorPin,
} from '@/lib/data/platform';
import { SectionHead, GlassCard, Tag } from '@/components/ui/primitives';

const KIND_COLOR: Record<CompetitorPin['kind'], string> = {
  'Food Truck': '#fb7185',
  Restaurant: '#a78bfa',
  Aggregator: '#38bdf8',
  Stall: '#fbbf24',
};

export function LiveTrackingMap() {
  const [showComp, setShowComp] = useState(true);
  const [selected, setSelected] = useState<CompetitorPin | null>(null);
  const [mode, setMode] = useState<'live' | 'demo'>('live');
  const [, setTick] = useState(0); // forces a re-read of the clock every second

  // Re-evaluate the truck position every second so movement is real time.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = mode === 'live' ? minutesOfDay(new Date()) : demoMinutes();
  const truck = truckStateAt(mins);
  const truckPoint = { id: TRUCK.id, name: TRUCK.name, x: truck.x, y: truck.y };

  const statusColor =
    truck.status === 'On Route' ? 'bg-emerald-400' : truck.status === 'At Stop' ? 'bg-orange-400' : 'bg-stone-400';

  const headline =
    truck.status === 'At Stop'
      ? `Parked at ${truck.stopLabel}`
      : truck.status === 'On Route'
      ? `Heading to ${truck.nextLabel}`
      : 'Truck is closed';

  const subline =
    truck.status === 'At Stop'
      ? `Leaving in ~${truck.etaMin} min · next stop ${truck.nextLabel}`
      : truck.status === 'On Route'
      ? `Arriving in ~${truck.etaMin} min`
      : truck.nextLabel;

  const nearby = [...COMPETITORS_GEO]
    .map((c) => ({ ...c, dist: canvasKm(truckPoint, c) }))
    .sort((a, b) => a.dist - b.dist);

  return (
    <div className="space-y-6">
      <SectionHead
        eyebrow="Order & Track"
        title="Live Truck Tracking"
        subtitle="Real-time map of the Zing & Zest truck and nearby competitors across Lahore. The truck stays parked at its current stop and only moves while travelling between stops - exactly like Foodpanda or Yango live tracking."
      />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Map canvas */}
        <GlassCard className="relative overflow-hidden p-0">
          <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[0.65rem] font-bold text-white backdrop-blur">
              <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${statusColor}`} /> {truck.status.toUpperCase()}
            </span>
            <span className="rounded-full bg-black/60 px-3 py-1 text-[0.65rem] font-semibold text-white/80 backdrop-blur">
              Lahore · {TRUCK.plate}
            </span>
          </div>
          <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
            <button
              onClick={() => setMode((m) => (m === 'live' ? 'demo' : 'live'))}
              className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[0.65rem] font-semibold text-white backdrop-blur transition hover:bg-black/80"
              title={mode === 'live' ? 'Truck follows the real clock' : 'Compressed day so you can watch it move'}
            >
              {mode === 'live' ? <Radio className="h-3 w-3 text-emerald-400" /> : <Zap className="h-3 w-3 text-amber-400" />}
              {mode === 'live' ? 'Real time' : 'Demo speed'}
            </button>
            <button
              onClick={() => setShowComp((s) => !s)}
              className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[0.65rem] font-semibold text-white backdrop-blur transition hover:bg-black/80"
            >
              {showComp ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              Pins
            </button>
          </div>

          <svg viewBox="0 0 100 70" className="h-[360px] w-full md:h-[440px]" style={{ background: 'linear-gradient(160deg,#0f2a23,#0a1f2e)' }}>
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M8 0H0V8" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
              </pattern>
              <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="100" height="70" fill="url(#grid)" />

            {/* parks & water for map texture */}
            <rect x="6" y="8" width="16" height="12" rx="2" fill="rgba(45,212,191,0.10)" />
            <rect x="80" y="44" width="15" height="18" rx="2" fill="rgba(45,212,191,0.10)" />
            <path d="M0 30 Q30 26 55 38 T100 40" fill="none" stroke="rgba(56,189,248,0.18)" strokeWidth="2.4" strokeLinecap="round" />

            {/* main roads */}
            {[18, 36, 54].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1.4" />
            ))}
            {[24, 50, 74].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="1.4" />
            ))}

            {/* truck route */}
            <polyline
              points={TRUCK_ROUTE.map((p) => `${p.x},${p.y * 0.7}`).join(' ')}
              fill="none"
              stroke="#f97316"
              strokeWidth="0.9"
              strokeDasharray="2 1.6"
              strokeLinecap="round"
              opacity="0.7"
            />
            {TRUCK_ROUTE.map((p) => {
              const isHere = p.label === truck.stopLabel && truck.status === 'At Stop';
              return (
                <g key={p.label}>
                  <circle cx={p.x} cy={p.y * 0.7} r={isHere ? 1.6 : 1.1} fill="#0a1f2e" stroke="#f97316" strokeWidth="0.5" />
                  <text x={p.x} y={p.y * 0.7 - 2} fill="rgba(255,255,255,0.55)" fontSize="2" textAnchor="middle">
                    {p.label}
                  </text>
                </g>
              );
            })}

            {/* competitors */}
            {showComp &&
              COMPETITORS_GEO.map((c) => (
                <g key={c.id} className="cursor-pointer" onClick={() => setSelected(c)} style={{ pointerEvents: 'all' }}>
                  <circle cx={c.x} cy={c.y * 0.7} r={selected?.id === c.id ? 2.4 : 1.8} fill={KIND_COLOR[c.kind]} opacity="0.9" />
                  <circle cx={c.x} cy={c.y * 0.7} r="0.7" fill="#0a1f2e" />
                </g>
              ))}

            {/* our truck - animates smoothly toward the live coordinate */}
            <motion.g
              animate={{ x: truck.x, y: truck.y * 0.7 }}
              transition={{ duration: mode === 'demo' ? 0.9 : 1, ease: 'linear' }}
            >
              <circle r="5" fill="url(#pulse)">
                <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="2.6" fill="#f97316" stroke="#fff" strokeWidth="0.6" />
              <text x="0" y="0.9" fontSize="2.6" textAnchor="middle">🚚</text>
            </motion.g>
          </svg>

          {/* legend */}
          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-medium)] px-4 py-2.5 text-[0.62rem] text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f97316]" /> Our Truck</span>
            {Object.entries(KIND_COLOR).map(([k, c]) => (
              <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c }} /> {k}</span>
            ))}
          </div>
        </GlassCard>

        {/* Live status panel (Foodpanda-style) */}
        <div className="space-y-4">
          <GlassCard className="border-t-2 border-t-orange-500">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-xl">🚚</div>
              <div className="flex-1">
                <h3 className="font-display font-bold">{TRUCK.name}</h3>
                <p className="text-muted text-xs">Driver {TRUCK.driver} · {TRUCK.plate}</p>
              </div>
              <Tag variant="teal">{truck.status}</Tag>
            </div>

            <div className="my-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3">
              <Navigation className="h-4 w-4 shrink-0 text-emerald-400" />
              <p className="text-sm">
                <strong>{headline}</strong>
                <span className="text-muted block text-xs">{subline}</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/5 p-2.5">
                <Clock className="mx-auto h-4 w-4 text-orange-400" />
                <p className="mt-1 text-sm font-bold">{truck.status === 'Closed' ? '--' : `${truck.etaMin}m`}</p>
                <p className="text-muted text-[0.6rem]">{truck.status === 'At Stop' ? 'Leaves in' : 'ETA'}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-2.5">
                <Gauge className="mx-auto h-4 w-4 text-teal-400" />
                <p className="mt-1 text-sm font-bold">{truck.speedKmh}</p>
                <p className="text-muted text-[0.6rem]">km/h</p>
              </div>
              <div className="rounded-xl bg-white/5 p-2.5">
                <Star className="mx-auto h-4 w-4 fill-amber-400 text-amber-400" />
                <p className="mt-1 text-sm font-bold">{TRUCK.rating}</p>
                <p className="text-muted text-[0.6rem]">Rating</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 font-semibold"><MapPin className="h-4 w-4 text-orange-400" /> Nearby Competitors</h3>
              <span className="text-muted text-[0.65rem]">{nearby.length} pins</span>
            </div>
            <div className="space-y-2">
              {nearby.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                    selected?.id === c.id ? 'border-orange-500 bg-orange-500/10' : 'border-white/5 hover:border-white/15'
                  }`}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: KIND_COLOR[c.kind] }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="text-muted text-[0.65rem]">{c.kind} · {c.priceTier} · ⭐ {c.rating}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-orange-400">{c.dist} km</p>
                    <p className="text-muted text-[0.6rem]">{c.busy}% busy</p>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Selected competitor detail */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: `${KIND_COLOR[selected.kind]}22` }}>
                {selected.kind === 'Restaurant' ? '🍽️' : selected.kind === 'Aggregator' ? '🛵' : selected.kind === 'Food Truck' ? '🚚' : '🥙'}
              </span>
              <div>
                <h3 className="font-bold">{selected.name}</h3>
                <p className="text-muted text-xs">{selected.kind} · {selected.priceTier} · {canvasKm(truckPoint, selected)} km away</p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {selected.rating}</span>
              <span className="flex items-center gap-1"><Truck className="h-4 w-4 text-teal-400" /> {selected.busy}% demand</span>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-[var(--text-primary)]">Close</button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
