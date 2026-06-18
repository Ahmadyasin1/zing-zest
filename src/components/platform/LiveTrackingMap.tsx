'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Star, Clock, Truck, Eye, EyeOff, Gauge, Radio, Zap } from 'lucide-react';
import L from 'leaflet';
import {
  TRUCK,
  TRUCK_SCHEDULE,
  COMPETITORS_GEO,
  canvasKm,
  truckStateAt,
  minutesOfDay,
  demoMinutes,
  type CompetitorPin,
} from '@/lib/data/platform';
import { SectionHead, GlassCard, Tag } from '@/components/ui/primitives';

/* Canvas coords (0-100) → approximate Lahore lat/lng */
const LAT_TOP = 31.560;
const LAT_SPAN = 0.135;
const LNG_LEFT = 74.240;
const LNG_SPAN = 0.185;

function toLatLng(x: number, y: number): [number, number] {
  return [LAT_TOP - (y / 100) * LAT_SPAN, LNG_LEFT + (x / 100) * LNG_SPAN];
}

const KIND_COLOR: Record<CompetitorPin['kind'], string> = {
  'Food Truck': '#fb7185',
  Restaurant: '#a78bfa',
  Aggregator: '#38bdf8',
  Stall: '#fbbf24',
};

function tileLayer(isDark: boolean) {
  return L.tileLayer(
    isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: isDark
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    },
  );
}

function truckIcon() {
  return L.divIcon({
    className: 'leaflet-truck-marker',
    html: `<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(249,115,22,0.25);border:2px solid #fff;box-shadow:0 2px 12px rgba(249,115,22,0.5);font-size:18px;line-height:1;">🚚</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function LeafletMapView({
  truck,
  showComp,
  selected,
  onSelectComp,
  mode,
  setMode,
  isDark,
}: {
  truck: ReturnType<typeof truckStateAt>;
  showComp: boolean;
  selected: CompetitorPin | null;
  onSelectComp: (c: CompetitorPin | null) => void;
  mode: 'live' | 'demo';
  setMode: (m: 'live' | 'demo') => void;
  isDark: boolean;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);
  const routeRef = useRef<L.Polyline | null>(null);
  const stopMarkersRef = useRef<L.CircleMarker[]>([]);
  const compMarkersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const onSelectCompRef = useRef(onSelectComp);
  const selectedRef = useRef(selected);

  onSelectCompRef.current = onSelectComp;
  selectedRef.current = selected;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const center = toLatLng(52, 50);
    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    tileRef.current = tileLayer(isDark).addTo(map);
    mapRef.current = map;

    routeRef.current = L.polyline(TRUCK_SCHEDULE.map((s) => toLatLng(s.x, s.y)), {
      color: '#f97316',
      weight: 3,
      opacity: 0.85,
      dashArray: '8 6',
    }).addTo(map);

    stopMarkersRef.current = TRUCK_SCHEDULE.map((stop) =>
      L.circleMarker(toLatLng(stop.x, stop.y), {
        radius: 7,
        fillColor: '#0a1f2e',
        fillOpacity: 1,
        color: '#f97316',
        weight: 2,
      })
        .bindTooltip(stop.label, { permanent: false, direction: 'top', className: 'leaflet-stop-tip' })
        .addTo(map),
    );

    truckMarkerRef.current = L.marker(toLatLng(truck.x, truck.y), {
      icon: truckIcon(),
      zIndexOffset: 1000,
    })
      .bindTooltip(TRUCK.name, { direction: 'top' })
      .addTo(map);

    COMPETITORS_GEO.forEach((c) => {
      const marker = L.circleMarker(toLatLng(c.x, c.y), {
        radius: 9,
        fillColor: KIND_COLOR[c.kind],
        fillOpacity: 0.9,
        color: '#ffffff',
        weight: 1.5,
      })
        .bindTooltip(`${c.name} · ${c.kind}`, { direction: 'top' })
        .addTo(map);

      marker.on('click', () => {
        const sel = selectedRef.current;
        onSelectCompRef.current(sel?.id === c.id ? null : c);
      });

      compMarkersRef.current.set(c.id, marker);
    });

    map.fitBounds(routeRef.current.getBounds(), { padding: [36, 36] });

    const compMarkers = compMarkersRef.current;

    return () => {
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
      truckMarkerRef.current = null;
      routeRef.current = null;
      stopMarkersRef.current = [];
      compMarkers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    truckMarkerRef.current?.setLatLng(toLatLng(truck.x, truck.y));
  }, [truck.x, truck.y]);

  useEffect(() => {
    compMarkersRef.current.forEach((marker, id) => {
      const c = COMPETITORS_GEO.find((item) => item.id === id);
      if (!c) return;
      const map = mapRef.current;
      if (showComp && map) marker.addTo(map);
      else marker.remove();
      marker.setStyle({
        radius: selected?.id === id ? 12 : 9,
        fillColor: KIND_COLOR[c.kind],
        weight: selected?.id === id ? 2.5 : 1.5,
      });
    });
  }, [showComp, selected]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tileRef.current) return;
    map.removeLayer(tileRef.current);
    tileRef.current = tileLayer(isDark).addTo(map);
  }, [isDark]);

  return (
    <div className="relative h-full">
      <div className="absolute left-3 top-3 z-[1000] flex items-center gap-2">
        <button
          onClick={() => setMode(mode === 'live' ? 'demo' : 'live')}
          className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[0.65rem] font-semibold text-white backdrop-blur transition hover:bg-black/90 shadow"
        >
          {mode === 'live' ? <Radio className="h-3 w-3 text-emerald-400" /> : <Zap className="h-3 w-3 text-amber-400" />}
          {mode === 'live' ? 'Real time' : 'Demo speed'}
        </button>
      </div>
      <div ref={mapContainerRef} className="h-full w-full rounded-xl" />
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-medium)] px-4 py-2 text-[0.62rem] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#f97316]" /> Our Truck
        </span>
        {Object.entries(KIND_COLOR).map(([k, c]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: c }} /> {k}
          </span>
        ))}
        <span className="ml-auto opacity-70">OpenStreetMap · free tiles</span>
      </div>
    </div>
  );
}

export function LiveTrackingMap() {
  const [showComp, setShowComp] = useState(true);
  const [selected, setSelected] = useState<CompetitorPin | null>(null);
  const [mode, setMode] = useState<'live' | 'demo'>('live');
  const [, setTick] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
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
        subtitle="Real-time map of the Zing and Zest truck and nearby competitors across Lahore. Position updates every second. Switch between live clock and demo speed."
      />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass card-hover relative overflow-hidden rounded-xl p-0" style={{ minHeight: 420 }}>
          <div className="absolute left-3 top-3 z-[1000] flex items-center gap-2" style={{ pointerEvents: 'none' }}>
            <span className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[0.65rem] font-bold text-white backdrop-blur shadow">
              <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${statusColor}`} /> {truck.status.toUpperCase()}
            </span>
            <span className="rounded-full bg-black/70 px-3 py-1 text-[0.65rem] font-semibold text-white/80 backdrop-blur shadow">
              Lahore · {TRUCK.plate}
            </span>
          </div>

          <button
            onClick={() => setShowComp((s) => !s)}
            className="absolute right-3 top-3 z-[1000] flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[0.65rem] font-semibold text-white backdrop-blur transition hover:bg-black/90 shadow"
          >
            {showComp ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            Pins
          </button>

          <div className="h-[420px] md:h-[480px]">
            <LeafletMapView
              truck={truck}
              showComp={showComp}
              selected={selected}
              onSelectComp={setSelected}
              mode={mode}
              setMode={setMode}
              isDark={isDark}
            />
          </div>
        </div>

        <div className="space-y-4">
          <GlassCard className="border-t-2 border-t-orange-500">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-xl">🚚</div>
              <div className="flex-1">
                <h3 className="font-display font-bold">{TRUCK.name}</h3>
                <p className="text-muted text-xs">
                  Driver {TRUCK.driver} · {TRUCK.plate}
                </p>
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
              <h3 className="flex items-center gap-1.5 font-semibold">
                <MapPin className="h-4 w-4 text-orange-400" /> Nearby Competitors
              </h3>
              <span className="text-muted text-[0.65rem]">{nearby.length} pins</span>
            </div>
            <div className="space-y-2">
              {nearby.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-200 ${
                    selected?.id === c.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-white/5 hover:border-white/15 hover:bg-white/5'
                  }`}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: KIND_COLOR[c.kind] }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="text-muted text-[0.65rem]">
                      {c.kind} · {c.priceTier} · ⭐ {c.rating}
                    </p>
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

      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <GlassCard className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                  style={{ background: `${KIND_COLOR[selected.kind]}22` }}
                >
                  {selected.kind === 'Restaurant'
                    ? '🍽️'
                    : selected.kind === 'Aggregator'
                      ? '🛵'
                      : selected.kind === 'Food Truck'
                        ? '🚚'
                        : '🥙'}
                </span>
                <div>
                  <h3 className="font-bold">{selected.name}</h3>
                  <p className="text-muted text-xs">
                    {selected.kind} · {selected.priceTier} · {canvasKm(truckPoint, selected)} km away
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {selected.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="h-4 w-4 text-teal-400" /> {selected.busy}% demand
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg px-3 py-1.5 text-xs text-muted transition hover:bg-white/10 hover:text-[var(--text-primary)]"
                >
                  Close ×
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
