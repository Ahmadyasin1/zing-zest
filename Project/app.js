/* ══════════════════════════════════════════════════
   FUSIONBITES AI — APP ENGINE
   Spring 2026 | AIUE3013
   ══════════════════════════════════════════════════ */

'use strict';

// ── BOOT ──────────────────────────────────────────────────────────────────────
const STATUS_MSGS = [
  'Initializing AI modules...',
  'Loading persona engine...',
  'Connecting to analytics...',
  'Building forecast models...',
  'Rendering dashboard...',
];

document.addEventListener('DOMContentLoaded', () => {
  let i = 0;
  const statusEl = document.getElementById('splashStatus');
  const ticker = setInterval(() => {
    if (statusEl && i < STATUS_MSGS.length) statusEl.textContent = STATUS_MSGS[i++];
    else clearInterval(ticker);
  }, 280);

  setTimeout(() => {
    document.getElementById('splash')?.classList.add('out');
    setTimeout(initApp, 500);
  }, 1650);
});

// ── GLOBAL STATE ──────────────────────────────────────────────────────────────
const state = {
  currentPage: 'cover',
  theme: localStorage.getItem('zz_theme') || 'dark',
  fabOpen: false,
  charts: {},
};

// ── INIT ──────────────────────────────────────────────────────────────────────
function initApp() {
  applyTheme(state.theme);
  setupNav();
  setupTheme();
  setupSidebar();
  setupFAB();
  setupScrollProgress();
  setupPeriodToggle();
  buildMonthlyTable();
  initCharts();
  runCounters();
  animateChannelBars();
  updateClock();
  setInterval(updateClock, 60000);
  setupPresentMode();
  setupScenarios();
  setupROICalc();
}

// ── THEME ─────────────────────────────────────────────────────────────────────
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const btn1 = document.getElementById('themeToggle');
  const btn2 = document.getElementById('topTheme');
  if (btn1) btn1.textContent = t === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode';
  if (btn2) btn2.textContent = t === 'dark' ? '☀' : '🌙';
  Chart.defaults.color = t === 'dark' ? '#8b949e' : '#475569';
  Chart.defaults.borderColor = t === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  Object.values(state.charts).forEach(c => { try { c.update('none'); } catch(_){} });
}

function setupTheme() {
  [document.getElementById('themeToggle'), document.getElementById('topTheme')].forEach(btn => {
    btn?.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('zz_theme', state.theme);
      applyTheme(state.theme);
    });
  });
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function setupSidebar() {
  const sidebar = document.getElementById('sidebar');
  const tbMenu = document.getElementById('tbMenu');
  const sbClose = document.getElementById('sbClose');

  tbMenu?.addEventListener('click', () => sidebar?.classList.toggle('sb-open'));
  sbClose?.addEventListener('click', () => sidebar?.classList.remove('sb-open'));
  document.addEventListener('click', e => {
    if (!e.target.closest('#sidebar') && !e.target.closest('#tbMenu')) {
      sidebar?.classList.remove('sb-open');
    }
  });
}

// ── NAVIGATION ────────────────────────────────────────────────────────────────
const CRUMBS = {
  cover: 'Cover Page',
  part1: 'Part 1 · AI Customer Intelligence',
  part2: 'Part 2 · Sales Forecasting',
  part3: 'Part 3 · Competitive Intelligence',
  part4: 'Part 4 · AI Automation',
  part5: 'Part 5 · Crisis Recovery',
  transparency: 'Appendix · AI Transparency',
  conclusion: 'Appendix · Conclusion',
};

function setupNav() {
  document.querySelectorAll('.sb-link').forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.target;
      if (target) goTo(target);
    });
  });
}

function goTo(pageId) {
  // pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) { page.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  // nav
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  document.querySelector(`.sb-link[data-target="${pageId}"]`)?.classList.add('active');

  // breadcrumb
  const crumbEl = document.getElementById('tbCrumb');
  if (crumbEl) crumbEl.textContent = CRUMBS[pageId] || pageId;

  state.currentPage = pageId;
  document.getElementById('sidebar')?.classList.remove('sb-open');

  // re-run counters for newly visible stat elements
  setTimeout(() => {
    runCounters();
    animateChannelBars();
    animateKPIBars();
    // Refresh charts
    Object.values(state.charts).forEach(c => { try { c.resize(); } catch(_){} });
  }, 100);
}

// ── SCROLL PROGRESS ───────────────────────────────────────────────────────────
function setupScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (bar) bar.style.transform = `scaleX(${pct})`;
  });
}

// ── FAB ───────────────────────────────────────────────────────────────────────
function setupFAB() {
  const main = document.getElementById('fabMain');
  const items = document.getElementById('fabItems');
  main?.addEventListener('click', () => {
    state.fabOpen = !state.fabOpen;
    main.classList.toggle('open', state.fabOpen);
    items?.classList.toggle('visible', state.fabOpen);
  });
}

// ── PERIOD TOGGLE ─────────────────────────────────────────────────────────────
function setupPeriodToggle() {
  document.querySelectorAll('.pt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const period = btn.dataset.period;
      document.querySelectorAll('.pt-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.period-view').forEach(v => v.classList.remove('active-view'));
      btn.classList.add('active');
      document.getElementById(`pv-${period}`)?.classList.add('active-view');
      setTimeout(() => Object.values(state.charts).forEach(c => { try { c.resize(); } catch(_){} }), 50);
    });
  });
}

// ── MONTHLY TABLE ─────────────────────────────────────────────────────────────
const MONTHLY = [
  { m:'January',   c:2160, rev:720000,   g:0,     s:'Normal',         ci:12 },
  { m:'February',  c:2419, rev:777600,   g:8,     s:'Normal',         ci:11 },
  { m:'March',     c:2687, rev:851328,   g:9.5,   s:'Normal',         ci:10 },
  { m:'April',     c:2930, rev:936461,   g:10,    s:'Summer starts',  ci:11 },
  { m:'May',       c:2624, rev:795992,   g:-15,   s:'Summer −15%',    ci:12 },
  { m:'June',      c:1968, rev:676593,   g:-15,   s:'Monsoon −10%',   ci:13 },
  { m:'July',      c:2143, rev:716789,   g:6,     s:'Recovery',       ci:11 },
  { m:'August',    c:2271, rev:759397,   g:6,     s:'Eid buildup',    ci:10 },
  { m:'September', c:2726, rev:1025486,  g:35,    s:'Eid +35% 🎉',    ci:9  },
  { m:'October',   c:2862, rev:956023,   g:-7,    s:'Post-Eid dip',   ci:10 },
  { m:'November',  c:2948, rev:1013584,  g:6,     s:'Normal',         ci:9  },
  { m:'December',  c:3220, rev:1124442,  g:10.9,  s:'Year-end Peak',  ci:8  },
];

function buildMonthlyTable() {
  const tbody = document.getElementById('monthlyTbody');
  if (!tbody) return;
  tbody.innerHTML = MONTHLY.map(d => `
    <tr>
      <td><strong>${d.m}</strong></td>
      <td>${d.c.toLocaleString()}</td>
      <td><strong>Rs. ${(d.rev/1000).toFixed(0)}K</strong></td>
      <td><span class="tt ${d.g >= 0 ? 'up' : 'down'}">${d.g >= 0 ? '+' : ''}${d.g}%</span></td>
      <td>${d.s}</td>
      <td style="color:var(--emerald2);font-weight:700;font-size:.78rem">±${d.ci}%</td>
    </tr>
  `).join('');
}

// ── COUNTERS ─────────────────────────────────────────────────────────────────
function runCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'yes';
    const end = parseFloat(el.dataset.count.replace(/,/g,''));
    const dec = String(el.dataset.count).includes('.') ? 1 : 0;
    const dur = 1200;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = end * ease;
      el.textContent = dec ? val.toFixed(dec) : Math.round(val).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = dec ? end.toFixed(dec) : end.toLocaleString();
    };
    requestAnimationFrame(tick);
  });
}

// ── CHANNEL BARS ──────────────────────────────────────────────────────────────
function animateChannelBars() {
  document.querySelectorAll('.ch-fill').forEach(bar => {
    if (bar.dataset.animated) return;
    bar.dataset.animated = 'yes';
    const w = bar.style.getPropertyValue('--w');
    bar.style.setProperty('--w', '0%');
    setTimeout(() => bar.style.setProperty('--w', w), 200);
  });
}

function animateKPIBars() {
  document.querySelectorAll('.kpib-bar div, .rca-conf-bar').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'yes';
  });
}

// ── CLOCK ────────────────────────────────────────────────────────────────────
function updateClock() {
  const el = document.querySelector('.tb-live');
  if (!el) return;
  const d = new Date();
  const t = d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
  const dt = d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
  el.innerHTML = `<span class="live-dot"></span> ${dt} · ${t}`;
}

// ── CHART HELPERS ─────────────────────────────────────────────────────────────
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 18;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(13,17,23,0.95)';
Chart.defaults.plugins.tooltip.titleFont = { weight: '700', size: 13 };
Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
Chart.defaults.plugins.tooltip.padding = 14;
Chart.defaults.plugins.tooltip.cornerRadius = 10;
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
Chart.defaults.animation.duration = 1000;
Chart.defaults.animation.easing = 'easeInOutQuart';

const C = {
  indigo: '#6366f1', indigo2: '#818cf8',
  violet: '#8b5cf6',
  emerald: '#10b981', emerald2: '#34d399',
  amber: '#f59e0b', amber2: '#fbbf24',
  rose: '#f43f5e', rose2: '#fb7185',
  sky: '#0ea5e9', sky2: '#38bdf8',
  cyan: '#06b6d4',
  pink: '#ec4899',
};
const a = (hex, alpha) => {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
};

function mkChart(id, cfg) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  if (state.charts[id]) { state.charts[id].destroy(); }
  const chart = new Chart(canvas, cfg);
  state.charts[id] = chart;
  return chart;
}

// ── INIT ALL CHARTS ───────────────────────────────────────────────────────────
function initCharts() {
  chartPersonaRadar('radarP1', [85, 60, 75, 90, 55, 80, 70], C.indigo);
  chartPersonaRadar('radarP2', [40, 90, 85, 35, 95, 65, 90], C.emerald);
  chartPersonaRadar('radarP3', [70, 50, 95, 45, 80, 90, 75], C.amber);
  chartChannelBar();
  chartPersonaValue();
  chartDaily();
  chartWeekly();
  chartMonthly();
  chartBreakeven();
  chartPosition();
  chartSocial();
  chartCompetitorRadar();
  chartSentiment();
  chartFunnel();
  chartROI();
  chartRetention();
  chartCrisis();
  chartRecovery();
}

// ── PERSONA BEHAVIOR RADARS ───────────────────────────────────────────────────
function chartPersonaRadar(id, data, color) {
  mkChart(id, {
    type: 'radar',
    data: {
      labels: ['Impulsiveness', 'Research Depth', 'Brand Loyalty', 'Social Sharing', 'Quality Focus', 'Adventure Seeking', 'Price Sensitivity'],
      datasets: [{
        data,
        borderColor: color,
        backgroundColor: a(color, 0.12),
        pointBackgroundColor: color,
        pointRadius: 4,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 100,
          grid: { color: a('#ffffff', 0.06) },
          angleLines: { color: a('#ffffff', 0.06) },
          ticks: { display: false, stepSize: 25 },
          pointLabels: { font: { size: 9 }, color: '#8b949e' }
        }
      }
    }
  });
}

// ── CHANNEL BAR ───────────────────────────────────────────────────────────────
function chartChannelBar() {
  mkChart('channelBarChart', {
    type: 'bar',
    data: {
      labels: ['TikTok', 'Instagram', 'WhatsApp', 'Google Maps', 'YouTube', 'LinkedIn'],
      datasets: [
        { label: 'Ali (Student)', data: [92,85,78,30,25,10], backgroundColor: a(C.indigo,0.8), borderRadius: 6 },
        { label: 'Sana (Professional)', data: [22,88,55,80,40,65], backgroundColor: a(C.emerald,0.8), borderRadius: 6 },
        { label: 'Bilal (Explorer)', data: [68,95,42,60,82,30], backgroundColor: a(C.amber,0.8), borderRadius: 6 },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: v => v+'%' }, grid: { color: a('#fff',0.04) } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── PERSONA VALUE ─────────────────────────────────────────────────────────────
function chartPersonaValue() {
  mkChart('personaValueChart', {
    type: 'bar',
    data: {
      labels: ['Ali Hassan\n(Student)', 'Sana Malik\n(Professional)', 'Bilal Chaudhry\n(Explorer)'],
      datasets: [
        { label: 'Avg. Order Value (Rs.)', data: [280, 550, 900], backgroundColor: [a(C.indigo,0.85), a(C.emerald,0.85), a(C.amber,0.85)], borderRadius: 8 },
        { label: 'Revenue Share %', data: [45, 35, 20], backgroundColor: [a(C.indigo,0.35), a(C.emerald,0.35), a(C.amber,0.35)], borderRadius: 8 },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: true, grid: { color: a('#fff',0.04) } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── DAILY CHART ───────────────────────────────────────────────────────────────
function chartDaily() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const rev = [23040, 29325, 32400, 31240, 35625, 49200, 12530];
  const cust = [72, 85, 90, 88, 95, 120, 33];

  mkChart('dailyChart', {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          type: 'bar', label: 'Revenue (Rs.)', data: rev, yAxisID: 'y',
          backgroundColor: rev.map((_, i) => i === 5 ? a(C.emerald,0.9) : i === 6 ? a(C.rose,0.7) : a(C.indigo,0.75)),
          borderRadius: 8,
        },
        {
          type: 'line', label: 'Customers', data: cust, yAxisID: 'y1',
          borderColor: C.amber2, backgroundColor: a(C.amber,0.1),
          pointBackgroundColor: C.amber2, pointRadius: 6, pointHoverRadius: 9,
          tension: 0.4, fill: true,
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => `Rs.${(v/1000).toFixed(0)}K` }, grid: { color: a('#fff',0.04) } },
        y1: { beginAtZero: true, position: 'right', title: { display: true, text: 'Customers', font: { weight:'600' } }, grid: { drawOnChartArea: false } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── WEEKLY CHART ──────────────────────────────────────────────────────────────
function chartWeekly() {
  const weeks = Array.from({length:12}, (_,i) => `W${i+1}`);
  const base = [214000, 238000, 262000, 290000, 318000, 295000, 335000, 370000, 408000, 450000, 420000, 490000];
  const upper = base.map(v => Math.round(v*1.12));
  const lower = base.map(v => Math.round(v*0.88));

  mkChart('weeklyChart', {
    type: 'line',
    data: {
      labels: weeks,
      datasets: [
        { label: 'Revenue', data: base, borderColor: C.indigo, backgroundColor: a(C.indigo,0.12), fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: C.indigo },
        { label: 'Upper (+12%)', data: upper, borderColor: a(C.emerald,0.5), borderDash:[5,5], pointRadius:0, tension:0.4, fill:false },
        { label: 'Lower (−12%)', data: lower, borderColor: a(C.rose,0.5), borderDash:[5,5], pointRadius:0, tension:0.4, fill:false },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position:'top' } },
      scales: {
        y: { ticks: { callback: v => `Rs.${(v/1000).toFixed(0)}K` }, grid: { color: a('#fff',0.04) } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── MONTHLY CHART ─────────────────────────────────────────────────────────────
function chartMonthly() {
  const months = MONTHLY.map(d => d.m.slice(0,3));
  const revs = MONTHLY.map(d => d.rev);

  mkChart('monthlyChart', {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          type: 'bar', label: 'Revenue (Rs.)', data: revs,
          backgroundColor: revs.map((_, i) => {
            if (i === 8) return a(C.emerald,0.9);
            if (i === 4 || i === 5) return a(C.rose,0.75);
            return a(C.indigo,0.8);
          }),
          borderRadius: 6,
        },
        { type: 'line', label: 'Trend', data: revs, borderColor: C.amber2, pointRadius:4, tension:0.4, fill:false }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position:'top' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: Rs.${ctx.raw.toLocaleString()}` } }
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => `Rs.${(v/1000).toFixed(0)}K` }, grid: { color: a('#fff',0.04) } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── BREAKEVEN CHART ───────────────────────────────────────────────────────────
function chartBreakeven() {
  const units = Array.from({length:20}, (_,i) => (i+1)*50);
  const totalRev = units.map(u => u * 380);
  const totalCost = units.map(u => 85000 + u * 145);

  mkChart('breakevenChart', {
    type: 'line',
    data: {
      labels: units,
      datasets: [
        { label: 'Total Revenue', data: totalRev, borderColor: C.emerald, backgroundColor: a(C.emerald,0.1), fill: true, tension: 0.3, pointRadius: 0 },
        { label: 'Total Costs', data: totalCost, borderColor: C.rose, backgroundColor: a(C.rose,0.05), fill: true, tension: 0.3, pointRadius: 0 },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        annotation: {
          annotations: {
            bePoint: { type: 'point', xValue: 359, yValue: 359*380, backgroundColor: C.amber, radius: 8, borderColor: '#fff', borderWidth: 2 }
          }
        }
      },
      scales: {
        x: { title: { display: true, text: 'Units Sold/Month', font: { weight:'600' } }, grid: { color: a('#fff',0.04) } },
        y: { ticks: { callback: v => `Rs.${(v/1000).toFixed(0)}K` }, grid: { color: a('#fff',0.04) } }
      }
    }
  });
}

// ── POSITIONING MAP ───────────────────────────────────────────────────────────
function chartPosition() {
  mkChart('positionChart', {
    type: 'bubble',
    data: {
      datasets: [
        { label: 'BurgerCraft', data:[{x:350,y:4.3,r:16}], backgroundColor: a(C.indigo,0.75) },
        { label: 'TacoTown PK', data:[{x:265,y:3.9,r:12}], backgroundColor: a(C.emerald,0.75) },
        { label: 'Noodle Nomad', data:[{x:300,y:4.5,r:24}], backgroundColor: a(C.rose,0.75) },
        { label: 'WrapStar', data:[{x:225,y:3.7,r:8}], backgroundColor: a(C.amber,0.75) },
        { label: 'PizzaWheels', data:[{x:450,y:4.1,r:18}], backgroundColor: a(C.violet,0.75) },
        { label: '⭐ Zing & Zest Street Bites (Target)', data:[{x:380,y:4.6,r:20}], backgroundColor: a(C.cyan,0.9), borderColor: C.cyan, borderWidth: 3 },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position:'bottom' } },
      scales: {
        x: { title:{ display:true, text:'Avg Price (Rs.)', font:{weight:'600'} }, min:150, max:550, grid:{ color: a('#fff',0.04) } },
        y: { title:{ display:true, text:'Google Rating', font:{weight:'600'} }, min:3.3, max:5.0, grid:{ color: a('#fff',0.04) } }
      }
    }
  });
}

// ── SOCIAL FOLLOWING ─────────────────────────────────────────────────────────
function chartSocial() {
  mkChart('socialChart', {
    type: 'bar',
    data: {
      labels: ['BurgerCraft', 'TacoTown', 'Noodle Nomad', 'WrapStar', 'PizzaWheels', 'Zing & Zest Street Bites\n(Target)'],
      datasets: [{
        label: 'Social Following',
        data: [28000, 15000, 42000, 8000, 35000, 50000],
        backgroundColor: [a(C.indigo,0.75), a(C.emerald,0.75), a(C.rose,0.75), a(C.amber,0.75), a(C.violet,0.75), a(C.cyan,0.9)],
        borderRadius: 8,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { callback: v => `${(v/1000).toFixed(0)}K` }, grid: { color: a('#fff',0.04) } },
        y: { grid: { display: false } }
      }
    }
  });
}

// ── COMPETITOR RADAR ──────────────────────────────────────────────────────────
function chartCompetitorRadar() {
  mkChart('competitorRadar', {
    type: 'radar',
    data: {
      labels: ['Brand Strength','Price Value','Food Quality','Digital Presence','Loyalty Program','Innovation','Customer Service'],
      datasets: [
        { label: 'Zing & Zest Street Bites (Us)', data:[72,78,85,90,88,92,80], borderColor:C.cyan, backgroundColor:a(C.cyan,0.12), pointBackgroundColor:C.cyan, borderWidth:2, pointRadius:4 },
        { label: 'Noodle Nomad (Rival)', data:[85,65,88,82,30,70,72], borderColor:C.rose, backgroundColor:a(C.rose,0.08), pointBackgroundColor:C.rose, borderWidth:2, pointRadius:3 },
        { label: 'Market Average', data:[60,70,72,55,25,50,60], borderColor:a(C.amber,0.7), backgroundColor:a(C.amber,0.05), borderDash:[5,5], borderWidth:1.5, pointRadius:2 },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position:'bottom' } },
      scales: { r: { min:0, max:100, grid:{ color: a('#fff',0.06) }, angleLines:{ color: a('#fff',0.06) }, ticks:{ display:false }, pointLabels:{ font:{size:10}, color:'#8b949e' } } }
    }
  });
}

// ── SENTIMENT CHART ───────────────────────────────────────────────────────────
function chartSentiment() {
  mkChart('sentimentChart', {
    type: 'doughnut',
    data: {
      labels: ['Positive (4–5★)', 'Neutral (3★)', 'Negative (1–2★)'],
      datasets: [{
        data: [74, 18, 8],
        backgroundColor: [a(C.emerald,0.85), a(C.amber,0.85), a(C.rose,0.85)],
        borderWidth: 3, borderColor: 'rgba(13,17,23,0.5)', hoverOffset: 8,
      }]
    },
    options: { responsive: true, cutout: '65%', plugins: { legend: { position:'bottom' } } }
  });
}

// ── FUNNEL CHART ──────────────────────────────────────────────────────────────
function chartFunnel() {
  const stages = ['Awareness\n50K', 'Consideration\n17.5K', 'Interest\n11K', 'Purchase\n7.5K', 'Loyalty\n5.4K', 'Advocacy\n972'];
  const vals = [50000, 17500, 11000, 7500, 5400, 972];

  mkChart('funnelChart', {
    type: 'bar',
    data: {
      labels: stages,
      datasets: [{
        label: 'Customers',
        data: vals,
        backgroundColor: [a(C.indigo,0.85), a(C.violet,0.85), a(C.sky,0.85), a(C.emerald,0.85), a(C.amber,0.85), a(C.rose,0.85)],
        borderRadius: 6,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display:false } },
      scales: {
        x: { ticks: { callback: v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v }, grid: { color: a('#fff',0.04) } },
        y: { grid: { display: false } }
      }
    }
  });
}

// ── ROI CHART ────────────────────────────────────────────────────────────────
function chartROI() {
  mkChart('roiChart', {
    type: 'bar',
    data: {
      labels: ['WhatsApp\nChatbot', 'Email\nAutomation', 'Loyalty\nProgram', 'Re-engagement\nCampaign', 'Referral\nProgram'],
      datasets: [{
        label: 'ROI Multiple (X)',
        data: [8.2, 5.4, 12.6, 6.8, 9.4],
        backgroundColor: [a(C.indigo,0.85), a(C.emerald,0.85), a(C.amber,0.85), a(C.sky,0.85), a(C.pink,0.85)],
        borderRadius: 10,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: {display:false}, tooltip: { callbacks: { label: ctx => ` ROI: ${ctx.raw}x return per Rs.1 invested` } } },
      scales: {
        y: { beginAtZero: true, title:{ display:true, text:'Return (x)', font:{weight:'600'} }, grid:{ color: a('#fff',0.04) } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── RETENTION CHART ───────────────────────────────────────────────────────────
function chartRetention() {
  const months = Array.from({length:12}, (_,i) => `M${i+1}`);
  const withAI  = [45, 52, 58, 63, 67, 70, 72, 73, 74, 75, 75, 76];
  const without = [45, 42, 40, 38, 36, 35, 34, 33, 32, 31, 31, 30];

  mkChart('retentionChart', {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'With AI Automation', data: withAI, borderColor: C.emerald, backgroundColor: a(C.emerald,0.12), fill:true, tension:0.4, pointRadius:5 },
        { label: 'Without Automation', data: without, borderColor: C.rose, backgroundColor: a(C.rose,0.06), fill:true, tension:0.4, borderDash:[6,4], pointRadius:3 },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position:'top' } },
      scales: {
        y: { min:20, max:85, ticks:{ callback: v => v+'%' }, grid:{ color: a('#fff',0.04) } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── CRISIS CHART ─────────────────────────────────────────────────────────────
function chartCrisis() {
  const labels = ['Oct','Nov','Dec','Jan','Feb','Mar\n(Crisis)','Apr','May','Jun'];
  const forecast = [700000, 760000, 820000, 720000, 780000, 810000, 855000, 900000, 950000];
  const actual =   [700000, 760000, 820000, 720000, 780000, 540000, null, null, null];
  const recovery = [null, null, null, null, null, 540000, 594000, 680000, 792000];

  mkChart('crisisChart', {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Forecasted Revenue', data: forecast, borderColor: a(C.emerald,0.6), borderDash:[6,4], pointRadius:0, tension:0.4, fill:false },
        { label: 'Actual Revenue', data: actual, borderColor: C.indigo, backgroundColor: a(C.indigo,0.1), fill:true, tension:0.4, pointRadius:5,
          pointBackgroundColor: actual.map((v,i) => i===5 ? C.rose : C.indigo) },
        { label: 'Recovery Plan', data: recovery, borderColor: C.amber, backgroundColor: a(C.amber,0.08), fill:true, tension:0.4, pointRadius:5, borderDash:[4,2] },
      ]
    },
    options: {
      responsive: true,
      interaction: { mode:'index', intersect:false },
      plugins: { legend: { position:'top' } },
      scales: {
        y: { min:400000, ticks:{ callback: v => `Rs.${(v/1000).toFixed(0)}K` }, grid:{ color: a('#fff',0.04) } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── RECOVERY CHART ────────────────────────────────────────────────────────────
function chartRecovery() {
  const labels = ['Month 3\n(Crisis)', 'Month 4', 'Month 5', 'Month 6\n(Target)'];
  const rev = [540000, 594000, 680000, 792000];
  const target = [720000, 720000, 720000, 720000];

  mkChart('recoveryChart', {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'bar', label: 'Actual / Projected Revenue', data: rev,
          backgroundColor: [a(C.rose,0.85), a(C.amber,0.85), a(C.sky,0.85), a(C.emerald,0.9)],
          borderRadius: 10,
        },
        { type: 'line', label: 'Pre-Crisis Target (Rs.720K)', data: target, borderColor: a(C.indigo2,0.7), borderDash:[6,3], pointRadius:0, fill:false },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position:'top' } },
      scales: {
        y: { min:400000, ticks:{ callback: v => `Rs.${(v/1000).toFixed(0)}K` }, grid:{ color: a('#fff',0.04) } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ── CHATBOT DEMO ─────────────────────────────────────────────────────────────
const CHAT_RESPONSES = {
  location: {
    user: '📍 Location',
    bot: `🗺️ Zing & Zest Street Bites is currently parked at:<br><br><strong>UCP Main Campus Gate</strong><br>Near Cafeteria Block B<br><br>📱 <em>Opening at 11AM today</em><br>⏱ <em>Queue: ~5 min wait</em>`
  },
  menu: {
    user: '🍜 Menu',
    bot: `Today's Specials 🔥<br><br>🥡 <strong>Korean BBQ Bao</strong> — Rs. 280<br>🌮 <strong>Desi Fusion Taco</strong> — Rs. 220<br>🍜 <strong>Karachi Ramen</strong> — Rs. 350<br>🥤 <strong>Kashmiri Pink Chai</strong> — Rs. 80<br><br><em>Based on your history, you'd love the Korean BBQ Bao! 🤖</em>`
  },
  order: {
    user: '📋 Order',
    bot: `What would you like?<br><br>Simply type the item name or number. We accept:<br><br>💳 JazzCash • Easypaisa<br>💳 Debit/Credit Card<br>💵 Cash<br><br>Your order will be ready in <strong>8–12 minutes</strong> 🎉`
  },
  loyalty: {
    user: '⭐ Rewards',
    bot: `🏆 Your Loyalty Status:<br><br>Tier: <strong>Flavor Fanatic 🥈</strong><br>Points: <strong>847 pts</strong><br>Next tier: 1,153 pts to go<br><br>🎁 Redeem:<br>• 500 pts = Free side dish<br>• 1000 pts = Rs. 100 discount<br><br>Earn <strong>2× points</strong> today! ⚡`
  }
};

function chatDemo(type) {
  const container = document.getElementById('chatDemo');
  if (!container) return;
  const resp = CHAT_RESPONSES[type];
  if (!resp) return;

  // Remove options
  container.querySelectorAll('.chat-options').forEach(el => el.remove());

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.innerHTML = `<div class="msg-bubble">${resp.user}</div>`;
  container.appendChild(userMsg);

  // Add bot response after delay
  setTimeout(() => {
    const typing = document.createElement('div');
    typing.className = 'msg bot';
    typing.innerHTML = `<div class="msg-bubble" style="color:var(--text3)">typing...</div>`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      typing.innerHTML = `<div class="msg-bubble">${resp.bot}</div>`;
      container.scrollTop = container.scrollHeight;

      // Re-add options
      setTimeout(() => {
        const opts = document.createElement('div');
        opts.className = 'chat-options';
        opts.innerHTML = `
          <button class="chat-opt" onclick="chatDemo('location')">📍 Location</button>
          <button class="chat-opt" onclick="chatDemo('menu')">🍜 Menu</button>
          <button class="chat-opt" onclick="chatDemo('order')">📋 Order</button>
          <button class="chat-opt" onclick="chatDemo('loyalty')">⭐ Rewards</button>
        `;
        container.appendChild(opts);
        container.scrollTop = container.scrollHeight;
      }, 500);
    }, 800);
  }, 300);
}

// ── CSV EXPORT ────────────────────────────────────────────────────────────────
function exportCSV() {
  const rows = [['Month','Customers','Revenue (Rs.)','Growth %','Seasonal Factor','Confidence Interval']];
  MONTHLY.forEach(d => rows.push([d.m, d.c, d.rev, d.g, d.s, `±${d.ci}%`]));
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'Zing & Zest Street Bites_Monthly_Forecast.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── WINDOW RESIZE ─────────────────────────────────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    Object.values(state.charts).forEach(c => { try { c.resize(); } catch(_){} });
  }, 200);
});

// ── KEYBOARD SHORTCUTS ────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.altKey) {
    const map = { '1':'cover','2':'part1','3':'part2','4':'part3','5':'part4','6':'part5','7':'transparency','8':'conclusion' };
    if (map[e.key]) { e.preventDefault(); goTo(map[e.key]); }
  }
  if (!e.altKey && !e.ctrlKey && !e.metaKey) {
    if (e.key === 'p' || e.key === 'P') {
      const tag = document.activeElement.tagName.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') { e.preventDefault(); enterPresentation(); }
    }
    if (presentState.active) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); slideNav(1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); slideNav(-1); }
      if (e.key === 'Escape') { e.preventDefault(); exitPresentation(); }
    }
  }
});

// ── INTERSECTION REVEAL ───────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.persona-block, .content-card, .chart-card, .rca-card, .recovery-phase, .insight-card').forEach(el => {
  revealObserver.observe(el);
});

// ── PRESENTATION MODE ─────────────────────────────────────────────────────────
const SLIDE_TITLES = [
  'Cover · Zing & Zest Street Bites','Part 1 · Customer Intel','Part 2 · Sales Forecast',
  'Part 3 · Competitive Intel','Part 4 · AI Automation','Part 5 · Crisis Recovery',
  'AI Transparency','Executive Conclusion'
];
const presentState = { active: false, current: 0 };

function setupPresentMode() {
  const btn = document.getElementById('btnPresent');
  if (btn) btn.addEventListener('click', enterPresentation);
}

function enterPresentation() {
  presentState.active = true;
  presentState.current = 0;
  const overlay = document.getElementById('presentOverlay');
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateSlide(0);
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function exitPresentation() {
  presentState.active = false;
  const overlay = document.getElementById('presentOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  if (document.exitFullscreen && document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function slideNav(dir) {
  const total = 8;
  const prevSlide = document.querySelector('.po-slide.active');
  if (prevSlide) {
    prevSlide.classList.remove('active');
    prevSlide.classList.add('exit');
    setTimeout(() => prevSlide.classList.remove('exit'), 400);
  }
  presentState.current = (presentState.current + dir + total) % total;
  const slides = document.querySelectorAll('.po-slide');
  const next = slides[presentState.current];
  if (next) {
    setTimeout(() => next.classList.add('active'), dir > 0 ? 50 : 10);
  }
  const counter = document.getElementById('pocCounter');
  const title = document.getElementById('pocTitle');
  if (counter) counter.textContent = `${presentState.current + 1} / 8`;
  if (title) title.textContent = SLIDE_TITLES[presentState.current] || '';
}

function updateSlide(idx) {
  document.querySelectorAll('.po-slide').forEach((s, i) => {
    s.classList.toggle('active', i === idx);
    s.classList.remove('exit');
  });
  const counter = document.getElementById('pocCounter');
  const title = document.getElementById('pocTitle');
  if (counter) counter.textContent = `${idx + 1} / 8`;
  if (title) title.textContent = SLIDE_TITLES[idx] || '';
}

// ── SCENARIO SELECTOR ─────────────────────────────────────────────────────────
const SCENARIOS = {
  conservative: { rev:'Rs. 5.8M', be:'Month 3', cust:'16,000', npm:'18%', mom:'3–5%' },
  base:         { rev:'Rs. 8.64M', be:'Month 1', cust:'24,000', npm:'28%', mom:'8–12%' },
  optimistic:   { rev:'Rs. 12.4M', be:'Launch Wk', cust:'35,000', npm:'36%', mom:'15–22%' }
};

function setupScenarios() {
  document.querySelectorAll('.ss-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ss-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scen = SCENARIOS[btn.dataset.scen];
      if (!scen) return;
      const colorMap = { conservative: 'var(--rose)', base: 'var(--emerald)', optimistic: 'var(--sky)' };
      const color = colorMap[btn.dataset.scen];
      const fields = { ssRev: scen.rev, ssBe: scen.be, ssCust: scen.cust, ssNpm: scen.npm, ssMoM: scen.mom };
      Object.entries(fields).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.transform = 'scale(1.15)';
        el.style.transition = 'all .35s';
        setTimeout(() => {
          el.textContent = val;
          el.style.color = color;
          el.style.transform = 'scale(1)';
        }, 160);
      });
    });
  });
}

// ── ROI CALCULATOR ────────────────────────────────────────────────────────────
function setupROICalc() {
  const channels = {
    slSm:  { valId:'rcvSm',  cpm:12,  conv:0.028 },
    slInf: { valId:'rcvInf', cpm:8,   conv:0.042 },
    slEv:  { valId:'rcvEv',  cpm:25,  conv:0.065 },
    slWa:  { valId:'rcvWa',  cpm:3,   conv:0.081 },
  };

  function fmt(n) {
    if (n >= 1000000) return `Rs. ${(n/1000000).toFixed(2)}M`;
    if (n >= 1000) return `Rs. ${(n/1000).toFixed(0)}K`;
    return `Rs. ${Math.round(n)}`;
  }
  function fmtR(n) {
    if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n/1000).toFixed(0)}K`;
    return Math.round(n).toString();
  }

  function recalc() {
    let budget = 0, reach = 0, conversions = 0;
    Object.entries(channels).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const b = parseInt(el.value);
      budget += b;
      const r = b > 0 ? (b / cfg.cpm) * 1000 : 0;
      reach += r;
      conversions += r * cfg.conv;
    });
    const revenue = conversions * 380;
    const roi = budget > 0 ? Math.round((revenue - budget) / budget * 100) : 0;
    const dashMax = 251.2;
    const offset = Math.max(dashMax - Math.min(roi / 1200 * dashMax, dashMax), 0);

    const setv = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    setv('roiPct', `${roi}%`);
    setv('rcReach', fmtR(reach));
    setv('rcConv', Math.round(conversions).toLocaleString());
    setv('rcRevOut', fmt(revenue));
    setv('rcTotalBudget', fmt(budget));

    const g = document.getElementById('gaugePath');
    if (g) g.style.strokeDashoffset = offset;
  }

  Object.entries(channels).forEach(([id, cfg]) => {
    const slider = document.getElementById(id);
    if (!slider) return;
    slider.addEventListener('input', () => {
      const valEl = document.getElementById(cfg.valId);
      if (valEl) valEl.textContent = `Rs. ${parseInt(slider.value).toLocaleString()}`;
      recalc();
    });
  });
  recalc();
}

// ── CONSOLE ───────────────────────────────────────────────────────────────────
console.log('%c🍜 Zing & Zest Street Bites - Marketing Dashboard', 'font-size:16px;font-weight:900;background:linear-gradient(90deg,#6366f1,#8b5cf6);color:#fff;padding:8px 16px;border-radius:8px;');
console.log('%cAIUE3013 · Spring 2026 · University of Central Punjab', 'color:#6366f1;font-weight:600;');
console.log('%cKeyboard shortcuts: Alt+1-8 navigate · P = Presentation Mode · Esc = Exit', 'color:#8b949e;font-size:11px;');
