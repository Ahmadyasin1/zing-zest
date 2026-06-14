export const ZZ = {
  brand: {
    name: 'Zing & Zest Street Bites',
    tagline: 'Fresh. Fast. Full of Flavor.',
    promise: 'Affordable-premium food that is quick, clean, and satisfying.',
    positioning:
      'Zing & Zest Street Bites is a modern, hygienic, affordable-premium food truck for students and young urban consumers who want fast, flavorful burgers, shawarma, fries, and cold drinks with a trustworthy and visually attractive brand experience.',
    colors: { orange: '#f97316', charcoal: '#1c1917', teal: '#0d9488' },
    hashtags: ['#ZingAndZest', '#ZingZestStreetBites', '#FreshFastFull', '#FoodTruckLahore', '#UCPEats'],
  },
  research: {
    interviews: 20,
    respondents: { students: 12, employees: 5, families: 3 },
    hygieneMentions: 18,
    priceBands: [
      { label: 'PKR 300–500', pct: 65 },
      { label: 'PKR 500–700', pct: 25 },
      { label: 'Below PKR 300', pct: 7 },
      { label: 'Above PKR 700', pct: 3 },
    ],
    foodPreference: [
      { item: 'Shawarma', pct: 42 },
      { item: 'Burgers', pct: 32 },
      { item: 'Fries', pct: 18 },
      { item: 'Cold Drinks', pct: 8 },
    ],
    mealTiming: [
      { window: 'Lunch (1–3 PM)', pct: 48 },
      { window: 'Evening (5–8 PM)', pct: 38 },
      { window: 'Late Afternoon', pct: 14 },
    ],
  },
  menu: {
    items: [
      { name: 'Zing Classic Burger', price: 280 },
      { name: 'Smoky Grill Burger', price: 380 },
      { name: 'Zesty Chicken Shawarma', price: 250 },
      { name: 'Double Bite Shawarma', price: 350 },
      { name: 'Plain Fries', price: 120 },
      { name: 'Masala Crunch Fries', price: 150 },
      { name: 'Loaded Zing Fries', price: 200 },
      { name: 'Cold Drink (Regular)', price: 80 },
      { name: 'Cold Drink (Large)', price: 120 },
    ],
    combos: [
      { name: 'Student Combo', price: 380, desc: 'Classic Burger + Fries + Drink' },
      { name: 'Wrap Combo', price: 350, desc: 'Shawarma + Fries + Drink' },
      { name: 'Loaded Combo', price: 550, desc: 'Smoky Grill + Loaded Fries + Drink' },
      { name: 'Friends Combo', price: 1200, desc: '2 Burgers + 2 Shawarmas + 4 Fries' },
    ],
    avgOrder: 380,
  },
  imc: {
    budgetTotal: 45150,
    budget: [
      { line: 'Meta Ads (IG + FB)', amount: 14000 },
      { line: 'Campus Sampling', amount: 7500 },
      { line: 'Photography / Video', amount: 5000 },
      { line: 'Nano-Influencer', amount: 5000 },
      { line: 'Branded Packaging', amount: 4000 },
      { line: 'Banners & Stickers', amount: 3500 },
      { line: 'Content Creation', amount: 3000 },
      { line: 'Loyalty Card Printing', amount: 1000 },
      { line: 'Contingency (5%)', amount: 2150 },
    ],
    targets: { impressions: 5000, followers: 100, dmInquiries: 200, day1Customers: 100 },
    aida: [
      { stage: 'Awareness', value: 5000 },
      { stage: 'Interest', value: 500 },
      { stage: 'Desire', value: 200 },
      { stage: 'Action', value: 100 },
    ],
    locations: [
      { name: 'UCP Main Gate', hours: '12:00 PM – 3:00 PM', segment: 'Students & Faculty' },
      { name: 'Liberty / Gulberg III', hours: '5:00 PM – 10:00 PM', segment: 'Professionals & shoppers' },
      { name: 'DHA Phase 5/6', hours: '1–2 PM & 6–9 PM', segment: 'Employees & residents' },
    ],
    loyalty: '5th visit free — orders above Rs. 300 qualify for stamp',
  },
  competitors: [
    { name: 'UCP Campus Canteen', type: 'Direct', price: 200, quality: 3.2, hygiene: 2.8 },
    { name: 'Local Shawarma Stalls', type: 'Direct', price: 175, quality: 3.4, hygiene: 2.5 },
    { name: 'Local Burger Stalls', type: 'Direct', price: 265, quality: 3.6, hygiene: 3.0 },
    { name: 'Standard Burger Outlets', type: 'Indirect', price: 450, quality: 4.2, hygiene: 4.0 },
    { name: 'Premium Cafés', type: 'Indirect', price: 850, quality: 4.5, hygiene: 4.4 },
    { name: 'Foodpanda / Cheetay', type: 'Indirect', price: 350, quality: 3.5, hygiene: 3.2 },
    { name: 'Zing & Zest (Target)', price: 380, quality: 4.6, hygiene: 4.8, highlight: true },
  ],
  forecast: {
    monthly: [
      { m: 'June (Launch)', c: 737, rev: 280000, g: 0, s: 'Launch month', ci: 18 },
      { m: 'July', c: 895, rev: 340000, g: 21, s: 'Word-of-mouth', ci: 15 },
      { m: 'August', c: 1026, rev: 390000, g: 15, s: 'Campus returns', ci: 13 },
      { m: 'September', c: 1171, rev: 445000, g: 14, s: 'UCP peak season', ci: 11 },
      { m: 'October', c: 1342, rev: 510000, g: 15, s: 'Strong growth', ci: 10 },
      { m: 'November', c: 1526, rev: 580000, g: 14, s: 'Pre-winter peak', ci: 9 },
      { m: 'December', c: 1711, rev: 650000, g: 12, s: 'Year-end high', ci: 9 },
      { m: 'January', c: 1303, rev: 495000, g: -24, s: 'Exams + weather', ci: 12 },
      { m: 'February', c: 1474, rev: 560000, g: 13, s: 'Recovery', ci: 11 },
      { m: 'March', c: 1553, rev: 590000, g: 5, s: 'Normal', ci: 10 },
      { m: 'April', c: 1395, rev: 530000, g: -10, s: 'Ramadan effect', ci: 12 },
      { m: 'May', c: 1421, rev: 540000, g: 2, s: 'Year 1 close', ci: 11 },
    ],
    scenarios: {
      conservative: { rev: 4200000, be: 2, cust: 850, npm: 18, mom: 8 },
      base: { rev: 5900000, be: 2, cust: 1200, npm: 24, mom: 12 },
      optimistic: { rev: 8500000, be: 1, cust: 1800, npm: 31, mom: 18 },
    },
    threeYear: [
      { year: 'Year 1', rev: 5900000, margin: 24 },
      { year: 'Year 2', rev: 11000000, margin: 28 },
      { year: 'Year 3', rev: 19000000, margin: 33 },
    ],
    breakeven: { fixed: 85000, variable: 145, price: 380, units: 359 },
  },
  personas: {
    radar: {
      labels: ['Impulsiveness', 'Research Depth', 'Brand Loyalty', 'Social Sharing', 'Quality Focus', 'Adventure', 'Price Sensitivity'],
      p1: [85, 60, 75, 90, 55, 80, 70],
      p2: [40, 90, 85, 35, 95, 65, 90],
      p3: [70, 50, 95, 45, 80, 90, 75],
    },
    channels: {
      labels: ['TikTok', 'Instagram', 'WhatsApp', 'Google Maps', 'Facebook', 'Word of Mouth'],
      p1: [84, 92, 78, 28, 18, 8],
      p2: [18, 74, 86, 62, 36, 44],
      p3: [12, 42, 80, 52, 28, 72],
    },
    value: { aov: [380, 550, 420], share: [60, 28, 12] },
  },
  team: [
    { name: 'Ahmad Yasin', reg: 'L1F22BSAI0052' },
    { name: 'Abdul Rehman', reg: 'L1F22BSAI0031' },
    { name: 'Eman Sarfraz', reg: 'L1F22BSAI0034' },
    { name: 'Nouman Zakar', reg: 'L1F22BSAI0048' },
    { name: 'Ali Hassan', reg: 'L1F22BSAI0059' },
  ],
} as const;

export const LEAD_DEVELOPER = 'Ahmad Yasin';

export const TEAM = [
  {
    name: 'Ahmad Yasin',
    reg: 'L1F22BSAI0052',
    role: 'Main Developer',
    photo: '/team/ahmad-yasin.png',
    lead: true,
  },
  {
    name: 'Abdul Rehman',
    reg: 'L1F22BSAI0031',
    role: 'Team Member',
    photo: '/team/abdul-rehman.png',
    lead: false,
  },
  {
    name: 'Eman Sarfraz',
    reg: 'L1F22BSAI0034',
    role: 'Team Member',
    photo: '/team/eman-sarfraz.png',
    lead: false,
  },
  {
    name: 'Nouman Zakar',
    reg: 'L1F22BSAI0048',
    role: 'Team Member',
    photo: '/team/nouman-zakar.png',
    lead: false,
  },
  {
    name: 'Ali Hassan',
    reg: 'L1F22BSAI0059',
    role: 'Team Member',
    photo: '/team/ali-hassan.png',
    lead: false,
  },
] as const;

export const TEAM_COMBINED = '/team/team-combined.png';
export const BRAND_LOGO = '/zing_zest_logo.png';

export type PageId =
  | 'cover'
  | 'report'
  | 'part1'
  | 'part2'
  | 'part3'
  | 'part4'
  | 'part5'
  | 'transparency'
  | 'conclusion'
  | 'ai';

export const NAV_ITEMS: { id: PageId; label: string; icon: string }[] = [
  { id: 'cover', label: 'Overview', icon: '◆' },
  { id: 'report', label: 'Executive Report', icon: '📄' },
  { id: 'part4', label: 'Personas & IMC', icon: '👥' },
  { id: 'part2', label: 'Forecasting', icon: '📈' },
  { id: 'part3', label: 'Competitors', icon: '🔭' },
  { id: 'part5', label: 'Journey & Recovery', icon: '🗺️' },
  { id: 'part1', label: 'Research & Brand', icon: '🔬' },
  { id: 'transparency', label: 'AI Methodology', icon: '🤖' },
  { id: 'ai', label: 'AI Lab', icon: '✨' },
  { id: 'conclusion', label: 'Executive Close', icon: '🎯' },
];

export const CHART_COLORS = {
  orange: '#ff8c2a',
  orange2: '#ffb347',
  teal: '#2dd4bf',
  teal2: '#5eead4',
  amber: '#fbbf24',
  rose: '#fb7185',
  sky: '#38bdf8',
  violet: '#a78bfa',
  gold: '#f59e0b',
  coral: '#f97316',
};

export function alpha(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}
