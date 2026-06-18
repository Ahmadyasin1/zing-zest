'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Star, Clock, Truck, Eye, EyeOff, Gauge, Radio, Zap, AlertCircle } from 'lucide-react';
import {
  TRUCK,
  TRUCK_SCHEDULE,
  TRUCK_ROUTE,
  COMPETITORS_GEO,
  canvasKm,
  truckStateAt,
  minutesOfDay,
  demoMinutes,
  type CompetitorPin,
} from '@/lib/data/platform';
import { SectionHead, GlassCard, Tag } from '@/components/ui/primitives';

/* ── Google Maps API (optional) ── */
let googleMapsLoaded = false;
let googleMapsLoading = false;
const googleMapsCallbacks: (() => void)[] = [];

function loadGoogleMapsApi(key: string): Promise<void> {
  return new Promise((resolve) => {
    if (googleMapsLoaded) { resolve(); return; }
    googleMapsCallbacks.push(resolve);
    if (googleMapsLoading) return;
    googleMapsLoading = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      googleMapsLoaded = true;
      googleMapsCallbacks.forEach(cb => cb());
      googleMapsCallbacks.length = 0;
    };
    document.head.appendChild(script);
  });
}

/* ── Coordinate transformation ──
   Canvas coords (0-100) → approximate Lahore lat/lng
   Calibrated to real Lahore landmarks matching the SVG layout. */
const LAT_TOP = 31.560;
const LAT_SPAN = 0.135;
const LNG_LEFT = 74.240;
const LNG_SPAN = 0.185;

function toLatLng(x: number, y: number) {
  return {
    lat: LAT_TOP - (y / 100) * LAT_SPAN,
    lng: LNG_LEFT + (x / 100) * LNG_SPAN,
  };
}

/* ── Custom dark map style matching brand palette ── */
const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0f1923' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8d9aa3' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a2535' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e2d3d' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#253545' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2a4060' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#183048' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1e2e' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3a5068' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#152030' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0d2a1e' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1a2535' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#1e2d3d' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] },
];

const LIGHT_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
];

/* ── Competitor colours ── */
const KIND_COLOR: Record<CompetitorPin['kind'], string> = {
  'Food Truck': '#fb7185',
  Restaurant: '#a78bfa',
  Aggregator: '#38bdf8',
  Stall: '#fbbf24',
};

/* ── SVG fallback map (shown when no API key) ── */
function SvgMap({ truck, showComp, selected, onSelectComp, mode, setMode }: {
  truck: ReturnType<typeof truckStateAt>;
  showComp: boolean;
  selected: CompetitorPin | null;
  onSelectComp: (c: CompetitorPin | null) => void;
  mode: 'live' | 'demo';
  setMode: (m: 'live' | 'demo') => void;
}) {
  const truckPoint = { x: truck.x, y: truck.y };
  return (
    <div className="relative h-full">
      <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
        <button onClick={() => setMode(mode === 'live' ? 'demo' : 'live')} className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[0.65rem] font-semibold text-white backdrop-blur transition hover:bg-black/80">
          {mode === 'live' ? <Radio className="h-3 w-3 text-emerald-400" /> : <Zap className="h-3 w-3 text-amber-400" />}
          {mode === 'live' ? 'Real time' : 'Demo speed'}
        </button>
      </div>
      <svg viewBox="0 0 100 70" className="h-full w-full" style={{ background: 'linear-gradient(160deg,#0f2a23,#0a1f2e)' }}>
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
        <rect x="6" y="8" width="16" height="12" rx="2" fill="rgba(45,212,191,0.10)" />
        <rect x="80" y="44" width="15" height="18" rx="2" fill="rgba(45,212,191,0.10)" />
        <path d="M0 30 Q30 26 55 38 T100 40" fill="none" stroke="rgba(56,189,248,0.18)" strokeWidth="2.4" strokeLinecap="round" />
        {[18, 36, 54].map(y => <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1.4" />)}
        {[24, 50, 74].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="1.4" />)}
        <polyline points={TRUCK_ROUTE.map(p => `${p.x},${p.y * 0.7}`).join(' ')} fill="none" stroke="#f97316" strokeWidth="0.9" strokeDasharray="2 1.6" strokeLinecap="round" opacity="0.7" />
        {TRUCK_ROUTE.map(p => {
          const isHere = p.label === truck.stopLabel && truck.status === 'At Stop';
          return (
            <g key={p.label}>
              <circle cx={p.x} cy={p.y * 0.7} r={isHere ? 1.6 : 1.1} fill="#0a1f2e" stroke="#f97316" strokeWidth="0.5" />
              <text x={p.x} y={p.y * 0.7 - 2} fill="rgba(255,255,255,0.55)" fontSize="2" textAnchor="middle">{p.label}</text>
            </g>
          );
        })}
        {showComp && COMPETITORS_GEO.map(c => (
          <g key={c.id} className="cursor-pointer" onClick={() => onSelectComp(selected?.id === c.id ? null : c)}>
            <circle cx={c.x} cy={c.y * 0.7} r={selected?.id === c.id ? 2.4 : 1.8} fill={KIND_COLOR[c.kind]} opacity="0.9" />
            <circle cx={c.x} cy={c.y * 0.7} r="0.7" fill="#0a1f2e" />
          </g>
        ))}
        <motion.g animate={{ x: truck.x, y: truck.y * 0.7 }} transition={{ duration: 1, ease: 'linear' }}>
          <circle r="5" fill="url(#pulse)">
            <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="2.6" fill="#f97316" stroke="#fff" strokeWidth="0.6" />
          <text x="0" y="0.9" fontSize="2.6" textAnchor="middle">🚚</text>
        </motion.g>
      </svg>
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-medium)] px-4 py-2 text-[0.62rem] text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f97316]" /> Our Truck</span>
        {Object.entries(KIND_COLOR).map(([k, c]) => (
          <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c }} /> {k}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Google Maps view ── */
function GoogleMapView({ truck, showComp, selected, onSelectComp, mode, setMode, isDark }: {
  truck: ReturnType<typeof truckStateAt>;
  showComp: boolean;
  selected: CompetitorPin | null;
  onSelectComp: (c: CompetitorPin | null) => void;
  mode: 'live' | 'demo';
  setMode: (m: 'live' | 'demo') => void;
  isDark: boolean;
}) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const truckMarkerRef = useRef<google.maps.Marker | null>(null);
  const compMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const routeLineRef = useRef<google.maps.Polyline | null>(null);
  const stopMarkersRef = useRef<google.maps.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const center = toLatLng(52, 50); // center of Lahore canvas
    const map = new google.maps.Map(mapContainerRef.current, {
      center,
      zoom: 12,
      styles: isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      gestureHandling: 'cooperative',
    });
    mapRef.current = map;

    // Route polyline
    routeLineRef.current = new google.maps.Polyline({
      path: TRUCK_SCHEDULE.map(s => toLatLng(s.x, s.y)),
      geodesic: true,
      strokeColor: '#f97316',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      icons: [{ icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, fillColor: '#f97316', fillOpacity: 0.8, strokeColor: '#f97316' }, offset: '50%', repeat: '80px' }],
      map,
    });

    // Stop markers
    stopMarkersRef.current = TRUCK_SCHEDULE.map(stop => {
      const pos = toLatLng(stop.x, stop.y);
      return new google.maps.Marker({
        position: pos,
        map,
        title: stop.label,
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: '#0a1f2e', fillOpacity: 1, strokeColor: '#f97316', strokeWeight: 2 },
        label: { text: stop.label.split(' ')[0], color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: 'bold' },
      });
    });

    // Truck marker
    truckMarkerRef.current = new google.maps.Marker({
      position: toLatLng(truck.x, truck.y),
      map,
      title: TRUCK.name,
      zIndex: 999,
      icon: {
        url: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#f97316" fill-opacity="0.25"/><circle cx="20" cy="20" r="12" fill="#f97316" stroke="white" stroke-width="2"/><text x="20" y="25" font-size="14" text-anchor="middle">🚚</text></svg>`),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20),
      },
    });

    // Competitor markers
    COMPETITORS_GEO.forEach(c => {
      const marker = new google.maps.Marker({
        position: toLatLng(c.x, c.y),
        map,
        title: c.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: KIND_COLOR[c.kind],
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
        },
      });
      marker.addListener('click', () => onSelectComp(selected?.id === c.id ? null : c));
      compMarkersRef.current.set(c.id, marker);
    });

    return () => {
      truckMarkerRef.current?.setMap(null);
      routeLineRef.current?.setMap(null);
      stopMarkersRef.current.forEach(m => m.setMap(null));
      compMarkersRef.current.forEach(m => m.setMap(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update truck position smoothly
  useEffect(() => {
    if (!truckMarkerRef.current) return;
    const pos = toLatLng(truck.x, truck.y);
    truckMarkerRef.current.setPosition(pos);
  }, [truck.x, truck.y]);

  // Show/hide competitor markers
  useEffect(() => {
    compMarkersRef.current.forEach((marker, id) => {
      marker.setMap(showComp ? mapRef.current : null);
      const c = COMPETITORS_GEO.find(c => c.id === id);
      if (c) {
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: selected?.id === id ? 12 : 9,
          fillColor: KIND_COLOR[c.kind],
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: selected?.id === id ? 2.5 : 1.5,
        });
      }
    });
  }, [showComp, selected]);

  // Update map style on theme change
  useEffect(() => {
    mapRef.current?.setOptions({ styles: isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE });
  }, [isDark]);

  return (
    <div className="relative h-full">
      <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
        <button onClick={() => setMode(mode === 'live' ? 'demo' : 'live')} className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[0.65rem] font-semibold text-white backdrop-blur transition hover:bg-black/90 shadow">
          {mode === 'live' ? <Radio className="h-3 w-3 text-emerald-400" /> : <Zap className="h-3 w-3 text-amber-400" />}
          {mode === 'live' ? 'Real time' : 'Demo speed'}
        </button>
      </div>
      <div ref={mapContainerRef} className="h-full w-full rounded-xl" />
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-medium)] px-4 py-2 text-[0.62rem] text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f97316]" /> Our Truck</span>
        {Object.entries(KIND_COLOR).map(([k, c]) => (
          <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c }} /> {k}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */
export function LiveTrackingMap() {
  const [showComp, setShowComp] = useState(true);
  const [selected, setSelected] = useState<CompetitorPin | null>(null);
  const [mode, setMode] = useState<'live' | 'demo'>('live');
  const [, setTick] = useState(0);
  const [mapsReady, setMapsReady] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? '';

  // Re-evaluate truck position every second
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Load Google Maps SDK when API key is present
  useEffect(() => {
    if (!apiKey) return;
    loadGoogleMapsApi(apiKey).then(() => setMapsReady(true));
  }, [apiKey]);

  // Track dark mode
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

  const statusColor = truck.status === 'On Route' ? 'bg-emerald-400' : truck.status === 'At Stop' ? 'bg-orange-400' : 'bg-stone-400';
  const headline = truck.status === 'At Stop' ? `Parked at ${truck.stopLabel}` : truck.status === 'On Route' ? `Heading to ${truck.nextLabel}` : 'Truck is closed';
  const subline = truck.status === 'At Stop' ? `Leaving in ~${truck.etaMin} min · next stop ${truck.nextLabel}` : truck.status === 'On Route' ? `Arriving in ~${truck.etaMin} min` : truck.nextLabel;

  const nearby = [...COMPETITORS_GEO]
    .map(c => ({ ...c, dist: canvasKm(truckPoint, c) }))
    .sort((a, b) => a.dist - b.dist);

  const useGoogleMaps = apiKey && mapsReady;

  return (
    <div className="space-y-6">
      <SectionHead
        eyebrow="Order & Track"
        title="Live Truck Tracking"
        subtitle="Real-time map of the Zing and Zest truck and nearby competitors across Lahore. Position updates every second. Switch between live clock and demo speed."
      />

      {/* API key notice */}
      {!apiKey && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            <strong>Google Maps not configured.</strong> Add <code className="rounded bg-amber-500/15 px-1">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> to <code className="rounded bg-amber-500/15 px-1">.env.local</code> to enable the real tile map. The stylised SVG map is shown below.
          </span>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Map canvas */}
        <div className="glass card-hover relative overflow-hidden rounded-xl p-0" style={{ minHeight: 420 }}>
          {/* Status overlay */}
          <div className="absolute left-3 top-3 z-20 flex items-center gap-2" style={{ pointerEvents: 'none' }}>
            <span className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[0.65rem] font-bold text-white backdrop-blur shadow">
              <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${statusColor}`} /> {truck.status.toUpperCase()}
            </span>
            <span className="rounded-full bg-black/70 px-3 py-1 text-[0.65rem] font-semibold text-white/80 backdrop-blur shadow">
              Lahore · {TRUCK.plate}
            </span>
          </div>

          {/* Toggle competitors overlay */}
          <button
            onClick={() => setShowComp(s => !s)}
            className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[0.65rem] font-semibold text-white backdrop-blur transition hover:bg-black/90 shadow"
          >
            {showComp ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            Pins
          </button>

          <div className="h-[420px] md:h-[480px]">
            {useGoogleMaps ? (
              <GoogleMapView
                truck={truck}
                showComp={showComp}
                selected={selected}
                onSelectComp={setSelected}
                mode={mode}
                setMode={setMode}
                isDark={isDark}
              />
            ) : (
              <SvgMap
                truck={truck}
                showComp={showComp}
                selected={selected}
                onSelectComp={setSelected}
                mode={mode}
                setMode={setMode}
              />
            )}
          </div>
        </div>

        {/* Live status panel */}
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
              <h3 className="flex items-center gap-1.5 font-semibold">
                <MapPin className="h-4 w-4 text-orange-400" /> Nearby Competitors
              </h3>
              <span className="text-muted text-[0.65rem]">{nearby.length} pins</span>
            </div>
            <div className="space-y-2">
              {nearby.slice(0, 5).map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-200 ${
                    selected?.id === c.id ? 'border-orange-500 bg-orange-500/10' : 'border-white/5 hover:border-white/15 hover:bg-white/5'
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
      <AnimatePresence>
        {selected && (
          <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
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
                <button onClick={() => setSelected(null)} className="rounded-lg px-3 py-1.5 text-xs text-muted transition hover:bg-white/10 hover:text-[var(--text-primary)]">
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
