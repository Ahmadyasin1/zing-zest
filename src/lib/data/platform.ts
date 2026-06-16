import { ZZ } from '@/lib/data/zz';

/* ──────────────────────────────────────────────────────────────
   LIVE TRACKING - Lahore food-truck network
   Positions are normalized to a 0-100 stylized map canvas so the
   tracking view renders fully offline (no tile server / API key).
   Coordinates loosely mirror real Lahore landmark geography.
   ────────────────────────────────────────────────────────────── */

export interface MapPoint {
  id: string;
  name: string;
  x: number; // 0-100 across canvas
  y: number; // 0-100 down canvas
}

export interface TruckUnit extends MapPoint {
  plate: string;
  status: 'On Route' | 'At Stop' | 'Returning';
  rating: number;
  driver: string;
}

export interface CompetitorPin extends MapPoint {
  kind: 'Food Truck' | 'Restaurant' | 'Aggregator' | 'Stall';
  rating: number;
  priceTier: '$' | '$$' | '$$$';
  busy: number; // 0-100 live demand index
}

// Our truck (static identity - its live position is computed from the schedule).
export const TRUCK: TruckUnit = {
  id: 'zz-01',
  name: 'Zing & Zest Truck',
  plate: 'LEB-2026',
  status: 'On Route',
  rating: 4.6,
  driver: 'Ahmad Y.',
  x: 28,
  y: 62,
};

// Real daily operating schedule. `arrive`/`depart` are minutes from midnight.
// The truck PARKS at each stop during its window and only moves (in real time)
// while travelling between stops - so its map position always reflects reality.
export interface ScheduleStop {
  label: string;
  x: number;
  y: number;
  arrive: number; // minutes from midnight
  depart: number;
}

const H = (h: number, m = 0) => h * 60 + m;

export const TRUCK_SCHEDULE: ScheduleStop[] = [
  { label: 'UCP Main Gate', x: 28, y: 62, arrive: H(12), depart: H(15) },
  { label: 'Gulberg III', x: 44, y: 48, arrive: H(15, 40), depart: H(17) },
  { label: 'Liberty Market', x: 63, y: 35, arrive: H(17, 40), depart: H(19, 30) },
  { label: 'MM Alam Road', x: 78, y: 52, arrive: H(20), depart: H(21, 15) },
  { label: 'DHA Phase 5', x: 70, y: 74, arrive: H(21, 45), depart: H(23) },
];

// Ordered stop coordinates (used to draw the dashed route line on the map).
export const TRUCK_ROUTE = TRUCK_SCHEDULE.map((s) => ({ x: s.x, y: s.y, label: s.label }));

export const OPEN_AT = TRUCK_SCHEDULE[0].arrive;
export const CLOSE_AT = TRUCK_SCHEDULE[TRUCK_SCHEDULE.length - 1].depart;

export interface TruckState {
  x: number;
  y: number;
  status: 'At Stop' | 'On Route' | 'Closed';
  stopLabel: string; // current stop, or the stop just left
  nextLabel: string; // where it's heading (or next opening stop)
  etaMin: number; // minutes until it reaches nextLabel (0 when parked)
  progress: number; // 0..1 of the current travel leg
  speedKmh: number;
}

function fmtMin(min: number) {
  const h = Math.floor(min / 60) % 24;
  const m = Math.round(min % 60);
  const ap = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`;
}

// Pure function: the truck's live state at a given minutes-of-day value.
export function truckStateAt(minutesOfDay: number): TruckState {
  const stops = TRUCK_SCHEDULE;

  // Before opening or after close → parked at base, closed.
  if (minutesOfDay < stops[0].arrive || minutesOfDay >= CLOSE_AT) {
    return {
      x: stops[0].x,
      y: stops[0].y,
      status: 'Closed',
      stopLabel: 'Base (closed)',
      nextLabel: `${stops[0].label} · opens ${fmtMin(OPEN_AT)}`,
      etaMin: 0,
      progress: 0,
      speedKmh: 0,
    };
  }

  for (let i = 0; i < stops.length; i++) {
    const s = stops[i];
    // Parked at this stop.
    if (minutesOfDay >= s.arrive && minutesOfDay < s.depart) {
      const next = stops[i + 1];
      return {
        x: s.x,
        y: s.y,
        status: 'At Stop',
        stopLabel: s.label,
        nextLabel: next ? next.label : 'Base',
        etaMin: Math.round(s.depart - minutesOfDay),
        progress: 0,
        speedKmh: 0,
      };
    }
    // Travelling from this stop to the next.
    const next = stops[i + 1];
    if (next && minutesOfDay >= s.depart && minutesOfDay < next.arrive) {
      const leg = next.arrive - s.depart;
      const t = (minutesOfDay - s.depart) / leg;
      return {
        x: s.x + (next.x - s.x) * t,
        y: s.y + (next.y - s.y) * t,
        status: 'On Route',
        stopLabel: s.label,
        nextLabel: next.label,
        etaMin: Math.round(next.arrive - minutesOfDay),
        progress: t,
        speedKmh: Math.round(22 + (canvasKm(s, next) / leg) * 60 * 4),
      };
    }
  }

  // Fallback (shouldn't hit) - parked at last stop.
  const last = stops[stops.length - 1];
  return { x: last.x, y: last.y, status: 'At Stop', stopLabel: last.label, nextLabel: 'Base', etaMin: 0, progress: 0, speedKmh: 0 };
}

export function minutesOfDay(d: Date) {
  return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
}

// Demo clock: compress the full operating day into `cycleSec` real seconds so
// the truck's travel between stops is visible quickly. Returns minutes-of-day.
export function demoMinutes(cycleSec = 90) {
  const span = CLOSE_AT - OPEN_AT;
  const phase = (Date.now() / 1000 / cycleSec) % 1;
  return OPEN_AT + phase * span;
}

export const COMPETITORS_GEO: CompetitorPin[] = [
  { id: 'c1', name: 'Campus Canteen', x: 22, y: 70, kind: 'Stall', rating: 3.2, priceTier: '$', busy: 64 },
  { id: 'c2', name: 'Shawarma Junction', x: 38, y: 40, kind: 'Stall', rating: 3.4, priceTier: '$', busy: 78 },
  { id: 'c3', name: 'Burger Lab Truck', x: 58, y: 28, kind: 'Food Truck', rating: 3.9, priceTier: '$$', busy: 55 },
  { id: 'c4', name: 'Howdy Liberty', x: 67, y: 44, kind: 'Restaurant', rating: 4.2, priceTier: '$$$', busy: 41 },
  { id: 'c5', name: 'Street Grill Co.', x: 82, y: 66, kind: 'Food Truck', rating: 4.0, priceTier: '$$', busy: 69 },
  { id: 'c6', name: 'Foodpanda Hub', x: 52, y: 60, kind: 'Aggregator', rating: 3.5, priceTier: '$$', busy: 88 },
  { id: 'c7', name: 'Cafe Aylanto', x: 74, y: 30, kind: 'Restaurant', rating: 4.5, priceTier: '$$$', busy: 33 },
];

// Distance on the stylized canvas -> an approximate km figure for UX copy.
export function canvasKm(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const d = Math.hypot(a.x - b.x, a.y - b.y);
  return Math.round(d * 0.14 * 10) / 10; // ~0.14 km per canvas unit
}

/* ──────────────────────────────────────────────────────────────
   INVENTORY - live stock with AI reorder intelligence
   ────────────────────────────────────────────────────────────── */

export interface StockItem {
  id: string;
  name: string;
  category: 'Protein' | 'Bakery' | 'Produce' | 'Sauces' | 'Beverages' | 'Packaging';
  unit: string;
  qty: number;
  par: number; // ideal/target stock level
  reorderAt: number; // threshold that triggers a reorder
  dailyUse: number; // average units consumed per day
  cost: number; // PKR per unit
}

export const INVENTORY_SEED: StockItem[] = [
  { id: 'i1', name: 'Beef Patties', category: 'Protein', unit: 'pcs', qty: 38, par: 120, reorderAt: 40, dailyUse: 46, cost: 95 },
  { id: 'i2', name: 'Chicken Fillets', category: 'Protein', unit: 'pcs', qty: 64, par: 140, reorderAt: 50, dailyUse: 52, cost: 78 },
  { id: 'i3', name: 'Burger Buns', category: 'Bakery', unit: 'pcs', qty: 90, par: 200, reorderAt: 60, dailyUse: 70, cost: 22 },
  { id: 'i4', name: 'Pita / Wraps', category: 'Bakery', unit: 'pcs', qty: 45, par: 160, reorderAt: 55, dailyUse: 58, cost: 18 },
  { id: 'i5', name: 'Frozen Fries', category: 'Produce', unit: 'kg', qty: 12, par: 40, reorderAt: 14, dailyUse: 11, cost: 240 },
  { id: 'i6', name: 'Fresh Veg (LTO)', category: 'Produce', unit: 'kg', qty: 9, par: 25, reorderAt: 8, dailyUse: 7, cost: 130 },
  { id: 'i7', name: 'Zing Sauce', category: 'Sauces', unit: 'L', qty: 6, par: 18, reorderAt: 6, dailyUse: 4, cost: 380 },
  { id: 'i8', name: 'Garlic / Tahini', category: 'Sauces', unit: 'L', qty: 4, par: 14, reorderAt: 5, dailyUse: 3, cost: 320 },
  { id: 'i9', name: 'Soft Drinks', category: 'Beverages', unit: 'cans', qty: 120, par: 300, reorderAt: 90, dailyUse: 85, cost: 60 },
  { id: 'i10', name: 'Cups & Lids', category: 'Beverages', unit: 'pcs', qty: 210, par: 400, reorderAt: 120, dailyUse: 95, cost: 9 },
  { id: 'i11', name: 'Burger Boxes', category: 'Packaging', unit: 'pcs', qty: 75, par: 250, reorderAt: 80, dailyUse: 66, cost: 14 },
  { id: 'i12', name: 'Wrap Foil', category: 'Packaging', unit: 'pcs', qty: 160, par: 300, reorderAt: 90, dailyUse: 60, cost: 6 },
];

export type StockStatus = 'critical' | 'low' | 'healthy' | 'overstock';

export function stockStatus(item: StockItem): StockStatus {
  if (item.qty <= item.reorderAt * 0.6) return 'critical';
  if (item.qty <= item.reorderAt) return 'low';
  if (item.qty > item.par * 1.15) return 'overstock';
  return 'healthy';
}

// Days of cover left at current consumption.
export function daysLeft(item: StockItem): number {
  return item.dailyUse > 0 ? Math.round((item.qty / item.dailyUse) * 10) / 10 : 99;
}

// AI-style reorder suggestion: bring back to par, rounded to a sensible pack.
export function suggestedReorder(item: StockItem): number {
  const gap = Math.max(0, item.par - item.qty);
  if (gap === 0) return 0;
  const buffer = Math.ceil(item.dailyUse * 1.5); // 1.5-day safety buffer
  return gap + buffer;
}

/* ──────────────────────────────────────────────────────────────
   AI RECOMMENDATION ENGINE - preference-weighted menu scoring
   ────────────────────────────────────────────────────────────── */

export interface RecoItem {
  name: string;
  price: number;
  category: string;
  image: string;
  desc: string;
  spicy: number; // 0-3
  filling: number; // 0-3
  veg: boolean;
  popularity: number; // 0-100
}

// Attribute catalogue derived from the live menu (kept in sync by name).
const ATTR: Record<string, { spicy: number; filling: number; veg: boolean; popularity: number }> = {
  'Zing Classic Burger': { spicy: 1, filling: 2, veg: false, popularity: 82 },
  'Smoky Grill Burger': { spicy: 1, filling: 3, veg: false, popularity: 91 },
  'The Zesty Classic': { spicy: 1, filling: 3, veg: false, popularity: 88 },
  'Spicy Street Blaze': { spicy: 3, filling: 3, veg: false, popularity: 86 },
  'Veggie Vibe Burger': { spicy: 1, filling: 2, veg: true, popularity: 64 },
  'Zesty Chicken Shawarma': { spicy: 2, filling: 2, veg: false, popularity: 89 },
  'Double Bite Shawarma': { spicy: 2, filling: 3, veg: false, popularity: 80 },
  'Zingy Chicken Shawarma': { spicy: 2, filling: 3, veg: false, popularity: 90 },
  'Beef Street Wrap': { spicy: 2, filling: 3, veg: false, popularity: 78 },
  'Falafel Fresh Wrap': { spicy: 1, filling: 2, veg: true, popularity: 66 },
  'Plain Fries': { spicy: 0, filling: 1, veg: true, popularity: 70 },
  'Masala Crunch Fries': { spicy: 2, filling: 1, veg: true, popularity: 76 },
  'Loaded Zing Fries': { spicy: 1, filling: 2, veg: true, popularity: 84 },
  'Loaded Zest Fries': { spicy: 1, filling: 2, veg: false, popularity: 81 },
  'Teal-Wave Fries': { spicy: 0, filling: 2, veg: true, popularity: 72 },
  'Cold Drink (Regular)': { spicy: 0, filling: 0, veg: true, popularity: 60 },
  'Cold Drink (Large)': { spicy: 0, filling: 0, veg: true, popularity: 58 },
  'Lemon Zest Cooler': { spicy: 0, filling: 0, veg: true, popularity: 74 },
  'Street Mango Shake': { spicy: 0, filling: 1, veg: true, popularity: 83 },
  'Iced Karak Chai': { spicy: 0, filling: 0, veg: true, popularity: 69 },
};

export const RECO_CATALOG: RecoItem[] = ZZ.menu.items.map((m) => ({
  name: m.name,
  price: m.price,
  category: m.category,
  image: m.image,
  desc: m.desc,
  ...(ATTR[m.name] ?? { spicy: 1, filling: 2, veg: false, popularity: 60 }),
}));

export interface RecoPrefs {
  budget: number; // max PKR willing to spend on the item
  spicy: number; // desired heat 0-3
  hunger: number; // desired fullness 0-3
  vegOnly: boolean;
  category: 'any' | 'burgers' | 'shawarma' | 'sides' | 'drinks';
}

export interface ScoredReco extends RecoItem {
  score: number;
  reasons: string[];
}

/* Weighted scoring. Budget is treated as "what I'm willing to spend", so a
   bigger budget surfaces the premium option (e.g. budget Rs. 1000 + shawarma →
   the most expensive shawarma), while taste preferences can still override.
   Items priced over budget are excluded entirely. */
export function recommend(prefs: RecoPrefs, limit = 4): ScoredReco[] {
  const pool = RECO_CATALOG.filter((i) => {
    if (prefs.vegOnly && !i.veg) return false;
    if (prefs.category !== 'any' && i.category !== prefs.category) return false;
    if (i.price > prefs.budget) return false; // hard budget ceiling
    return true;
  });

  const scored = pool.map((i): ScoredReco => {
    const reasons: string[] = [];

    // Premium affinity: the closer the price is to the budget, the better the
    // "treat yourself within budget" match. This is the dominant signal.
    const premium = (i.price / prefs.budget) * 45;

    // Taste fit (0 distance = full marks).
    const spice = (1 - Math.abs(i.spicy - prefs.spicy) / 3) * 16;
    const hunger = (1 - Math.abs(i.filling - prefs.hunger) / 3) * 16;

    // Popularity prior (smaller influence so it can't beat a clear premium pick).
    const pop = (i.popularity / 100) * 10;

    const score = Math.round(Math.min(100, 6 + premium + spice + hunger + pop));

    if (i.price >= prefs.budget * 0.7) reasons.push('Premium pick for your budget');
    else reasons.push('Easy on your budget');
    if (Math.abs(i.spicy - prefs.spicy) === 0 && prefs.spicy >= 2) reasons.push('Matches your heat level');
    if (i.filling >= prefs.hunger && prefs.hunger >= 2) reasons.push('Filling enough');
    if (i.popularity >= 85) reasons.push('Customer favourite');
    if (i.veg && prefs.vegOnly) reasons.push('Vegetarian');

    return { ...i, score, reasons: reasons.slice(0, 3) };
  });

  // Sort by score, then break ties toward the pricier (more premium) item.
  return scored.sort((a, b) => b.score - a.score || b.price - a.price).slice(0, limit);
}
