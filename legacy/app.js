'use strict';

const state = { theme: localStorage.getItem('zz_theme') || 'dark', charts: {}, fabOpen: false, present: { active: false, idx: 0 } };

const C = {
  orange: '#f97316', orange2: '#fb923c', teal: '#0d9488', teal2: '#14b8a6',
  amber: '#f59e0b', rose: '#f43f5e', sky: '#0ea5e9', violet: '#8b5cf6',
};
const a = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const CRUMBS = {
  cover: 'Executive Overview',
  report: 'Executive Report',
  part1: 'Research & Brand',
  part2: 'Forecasting Models',
  part3: 'Competitor Dashboard',
  part4: 'Customer Personas',
  part5: 'Journey & Recovery',
  transparency: 'AI Methodology',
  conclusion: 'Executive Summary',
};

const SPLASH_MSGS = [
  'Loading market research data…',
  'Syncing brand architecture…',
  'Building forecast models…',
  'Preparing intelligence dashboard…',
];

document.addEventListener('DOMContentLoaded', () => {
  let i = 0;
  const statusEl = document.getElementById('splashStatus');
  const ticker = setInterval(() => {
    if (statusEl && i < SPLASH_MSGS.length) statusEl.textContent = SPLASH_MSGS[i++];
    else clearInterval(ticker);
  }, 300);
  setTimeout(() => {
    document.getElementById('splash')?.classList.add('out');
    setTimeout(init, 450);
  }, 1600);
});

function init() {
  applyTheme(state.theme);
  setupTheme();
  setupNav();
  setupSidebar();
  setupScroll();
  setupFAB();
  setupPresent();
  setupScenarios();
  setupROI();
  setupPeriodToggle();
  buildMonthlyTable();
  renderDeliverables();
  renderReport();
  renderPersonas();
  renderAIGallery();
  setupJourney();
  initCharts();
  updateClock();
  setInterval(updateClock, 60000);
}

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const label = t === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode';
  const icon = t === 'dark' ? '☀' : '🌙';
  const btn1 = document.getElementById('themeToggle');
  const btn2 = document.getElementById('topTheme');
  if (btn1) btn1.textContent = label;
  if (btn2) btn2.textContent = icon;
  if (typeof Chart !== 'undefined') {
    Chart.defaults.color = t === 'dark' ? '#a8a29e' : '#57534e';
    Chart.defaults.borderColor = t === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    Object.values(state.charts).forEach(c => { try { c.update('none'); } catch (_) {} });
  }
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

function setupSidebar() {
  const sidebar = document.getElementById('sidebar');
  document.getElementById('tbMenu')?.addEventListener('click', () => sidebar?.classList.toggle('sb-open'));
  document.getElementById('sbClose')?.addEventListener('click', () => sidebar?.classList.remove('sb-open'));
  document.addEventListener('click', e => {
    if (!e.target.closest('#sidebar') && !e.target.closest('#tbMenu')) sidebar?.classList.remove('sb-open');
  });
}

function setupNav() {
  document.querySelectorAll('.sb-link').forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.target;
      if (target) goTo(target);
    });
  });
}

function goTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelectorAll('.sb-link').forEach(l => l.classList.toggle('active', l.dataset.target === pageId));
  const crumb = document.getElementById('tbCrumb');
  if (crumb) crumb.textContent = CRUMBS[pageId] || pageId;
  document.getElementById('sidebar')?.classList.remove('sb-open');
  setTimeout(() => Object.values(state.charts).forEach(c => { try { c.resize(); } catch (_) {} }), 120);
}

function setupScroll() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = h.scrollHeight > h.clientHeight ? h.scrollTop / (h.scrollHeight - h.clientHeight) : 0;
    if (bar) bar.style.transform = `scaleX(${pct})`;
  });
}

function setupFAB() {
  const main = document.getElementById('fabMain');
  const items = document.getElementById('fabItems');
  main?.addEventListener('click', () => {
    state.fabOpen = !state.fabOpen;
    main.classList.toggle('open', state.fabOpen);
    items?.classList.toggle('visible', state.fabOpen);
  });
}

function updateClock() {
  const el = document.querySelector('.tb-live');
  if (!el) return;
  const d = new Date();
  const t = d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
  const dt = d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
  el.innerHTML = `<span class="live-dot"></span> Lahore · ${dt} · ${t}`;
}

function mkChart(id, cfg) {
  if (typeof Chart === 'undefined') return null;
  const canvases = document.querySelectorAll(`canvas[id="${id}"]`);
  const canvas = [...canvases].find(c => c.getAttribute('aria-hidden') !== 'true') || canvases[0];
  if (!canvas || canvas.getAttribute('aria-hidden') === 'true') return null;
  if (state.charts[id]) state.charts[id].destroy();
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  const chart = new Chart(canvas, cfg);
  state.charts[id] = chart;
  return chart;
}

function initCharts() {
  if (typeof Chart === 'undefined') {
    showChartLoadError();
    return;
  }
  chartResearch();
  chartBrand();
  chartIMC();
  chartPersonas();
  chartForecast();
  chartCompetitive();
  chartAutomation();
  chartCrisis();
}

function chartResearch() {
  const { respondents, foodPreference, mealTiming, priceBands } = ZZ.research;
  mkChart('researchRespondents', {
    type: 'doughnut',
    data: {
      labels: ['Students', 'Employees', 'Families'],
      datasets: [{ data: [respondents.students, respondents.employees, respondents.families], backgroundColor: [C.orange, C.teal, C.amber], borderWidth: 0 }],
    },
    options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } }, cutout: '58%' },
  });
  mkChart('foodPreference', {
    type: 'bar',
    data: {
      labels: foodPreference.map(f => f.item),
      datasets: [{ data: foodPreference.map(f => f.pct), backgroundColor: [C.orange, C.teal, C.amber, C.sky], borderRadius: 6 }],
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { max: 50, ticks: { callback: v => v + '%' } }, x: { grid: { display: false } } } },
  });
  mkChart('mealTiming', {
    type: 'polarArea',
    data: {
      labels: mealTiming.map(m => m.window),
      datasets: [{ data: mealTiming.map(m => m.pct), backgroundColor: [a(C.orange, 0.75), a(C.teal, 0.75), a(C.amber, 0.75)] }],
    },
    options: { plugins: { legend: { position: 'bottom', labels: { font: { size: 9 } } } } },
  });
  mkChart('priceSensitivity', {
    type: 'doughnut',
    data: {
      labels: priceBands.map(p => p.label),
      datasets: [{ data: priceBands.map(p => p.pct), backgroundColor: [C.teal, C.orange, C.amber, C.rose], borderWidth: 0 }],
    },
    options: { plugins: { legend: { position: 'bottom', labels: { font: { size: 9 } } } }, cutout: '45%' },
  });
}

function chartBrand() {
  const cats = ZZ.competitors.filter(c => !c.highlight);
  mkChart('positioningMap', {
    type: 'scatter',
    data: {
      datasets: [
        ...cats.map(c => ({
          label: c.name,
          data: [{ x: c.price, y: c.quality }],
          backgroundColor: a(C.amber, 0.7),
          pointRadius: 8,
        })),
        {
          label: 'Zing & Zest Street Bites',
          data: [{ x: 380, y: 4.6 }],
          backgroundColor: C.orange,
          pointRadius: 12,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      plugins: { legend: { position: 'bottom', labels: { font: { size: 9 } } } },
      scales: {
        x: { title: { display: true, text: 'Avg Price (Rs.)' }, min: 100, max: 950 },
        y: { title: { display: true, text: 'Perceived Quality' }, min: 2.5, max: 5 },
      },
    },
  });
}

function chartIMC() {
  const b = ZZ.imc.budget;
  const doughnutCfg = {
    type: 'doughnut',
    data: {
      labels: b.map(x => x.line),
      datasets: [{ data: b.map(x => x.amount), backgroundColor: [C.orange, C.teal, C.amber, C.sky, C.rose, C.violet, '#64748b', '#94a3b8', '#cbd5e1'], borderWidth: 0 }],
    },
    options: {
      cutout: '55%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 9 }, boxWidth: 10 } },
        tooltip: { callbacks: { label: ctx => ` Rs. ${ctx.raw.toLocaleString()} (${((ctx.raw / ZZ.imc.budgetTotal) * 100).toFixed(1)}%)` } },
      },
    },
  };
  mkChart('imcBudget', doughnutCfg);

  const aida = ZZ.imc.aida;
  mkChart('aidaFunnel', {
    type: 'bar',
    data: {
      labels: aida.map(x => x.stage),
      datasets: [{ data: aida.map(x => x.value), backgroundColor: [C.orange, C.teal, C.amber, C.teal2], borderRadius: 8 }],
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { callback: v => v >= 1000 ? (v / 1000) + 'K' : v } } },
    },
  });
}

function chartPersonas() {
  const { labels, p1, p2, p3 } = ZZ.personas.radar;
  const radarOpts = {
    options: {
      plugins: { legend: { display: false } },
      scales: { r: { min: 0, max: 100, ticks: { display: false }, pointLabels: { font: { size: 8 } } } },
    },
  };
  mkChart('radarP1', { type: 'radar', data: { labels, datasets: [{ data: p1, borderColor: C.orange, backgroundColor: a(C.orange, 0.12), borderWidth: 2, pointRadius: 3 }] }, ...radarOpts });
  mkChart('radarP2', { type: 'radar', data: { labels, datasets: [{ data: p2, borderColor: C.teal, backgroundColor: a(C.teal, 0.12), borderWidth: 2, pointRadius: 3 }] }, ...radarOpts });
  mkChart('radarP3', { type: 'radar', data: { labels, datasets: [{ data: p3, borderColor: C.amber, backgroundColor: a(C.amber, 0.12), borderWidth: 2, pointRadius: 3 }] }, ...radarOpts });

  const ch = ZZ.personas.channels;
  mkChart('channelBarChart', {
    type: 'bar',
    data: {
      labels: ch.labels,
      datasets: [
        { label: 'UCP Student', data: ch.p1, backgroundColor: a(C.orange, 0.85), borderRadius: 4 },
        { label: 'Office Worker', data: ch.p2, backgroundColor: a(C.teal, 0.85), borderRadius: 4 },
        { label: 'Late-Night Explorer', data: ch.p3, backgroundColor: a(C.amber, 0.85), borderRadius: 4 },
      ],
    },
    options: { scales: { y: { max: 100, ticks: { callback: v => v + '%' } } }, plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } } },
  });

  const v = ZZ.personas.value;
  mkChart('personaValueChart', {
    type: 'bar',
    data: {
      labels: ['UCP Student', 'Office Worker', 'Late-Night Explorer'],
      datasets: [
        { label: 'Avg Order (Rs.)', data: v.aov, backgroundColor: [a(C.orange, 0.85), a(C.teal, 0.85), a(C.amber, 0.85)], borderRadius: 6, yAxisID: 'y' },
        { label: 'Revenue Share %', data: v.share, backgroundColor: [a(C.orange, 0.3), a(C.teal, 0.3), a(C.amber, 0.3)], borderRadius: 6, yAxisID: 'y1' },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true, position: 'left' },
        y1: { beginAtZero: true, max: 70, position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: v => v + '%' } },
      },
    },
  });
}

function chartForecast() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const rev = [18240, 21280, 23560, 22800, 29640, 38000, 16480];
  const cust = [48, 56, 62, 60, 78, 100, 43];
  mkChart('dailyChart', {
    data: {
      labels: days,
      datasets: [
        { type: 'bar', label: 'Revenue (Rs.)', data: rev, backgroundColor: a(C.orange, 0.8), borderRadius: 6, yAxisID: 'y' },
        { type: 'line', label: 'Customers', data: cust, borderColor: C.teal, tension: 0.4, yAxisID: 'y1' },
      ],
    },
    options: {
      scales: {
        y: { ticks: { callback: v => 'Rs.' + (v / 1000).toFixed(0) + 'K' } },
        y1: { position: 'right', grid: { drawOnChartArea: false } },
      },
    },
  });

  const weeks = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
  const base = [214000, 238000, 262000, 290000, 318000, 295000, 335000, 370000, 408000, 450000, 420000, 490000];
  mkChart('weeklyChart', {
    type: 'line',
    data: {
      labels: weeks,
      datasets: [{ label: 'Weekly Revenue', data: base, borderColor: C.orange, backgroundColor: a(C.orange, 0.1), fill: true, tension: 0.4 }],
    },
    options: { scales: { y: { ticks: { callback: v => 'Rs.' + (v / 1000).toFixed(0) + 'K' } } } },
  });

  const m = ZZ.forecast.monthly;
  mkChart('monthlyChart', {
    type: 'bar',
    data: {
      labels: m.map(d => d.m.slice(0, 3)),
      datasets: [{ label: 'Revenue', data: m.map(d => d.rev), backgroundColor: m.map((_, i) => i === 7 ? a(C.rose, 0.8) : a(C.orange, 0.75)), borderRadius: 6 }],
    },
    options: { scales: { y: { ticks: { callback: v => 'Rs.' + (v / 1000).toFixed(0) + 'K' } } } },
  });

  const be = ZZ.forecast.breakeven;
  const units = Array.from({ length: 20 }, (_, i) => (i + 1) * 50);
  mkChart('breakevenChart', {
    type: 'line',
    data: {
      labels: units,
      datasets: [
        { label: 'Revenue', data: units.map(u => u * be.price), borderColor: C.teal, fill: false, pointRadius: 0, tension: 0.3 },
        { label: 'Total Cost', data: units.map(u => be.fixed + u * be.variable), borderColor: C.rose, fill: false, pointRadius: 0, tension: 0.3 },
      ],
    },
    options: { scales: { x: { title: { display: true, text: 'Units / Month' } }, y: { ticks: { callback: v => 'Rs.' + (v / 1000).toFixed(0) + 'K' } } } },
  });

  const ty = ZZ.forecast.threeYear;
  mkChart('threeYearChart', {
    data: {
      labels: ty.map(y => y.year),
      datasets: [
        { type: 'bar', label: 'Revenue', data: ty.map(y => y.rev), backgroundColor: [a(C.orange, 0.75), a(C.teal, 0.75), a(C.violet, 0.75)], borderRadius: 8, yAxisID: 'y' },
        { type: 'line', label: 'Net Margin %', data: ty.map(y => y.margin), borderColor: C.amber, yAxisID: 'y1', tension: 0.4 },
      ],
    },
    options: {
      scales: {
        y: { ticks: { callback: v => 'Rs.' + (v / 1e6).toFixed(0) + 'M' } },
        y1: { position: 'right', min: 15, max: 40, grid: { drawOnChartArea: false }, ticks: { callback: v => v + '%' } },
      },
    },
  });
}

function chartCompetitive() {
  mkChart('competitorRadar', {
    type: 'radar',
    data: {
      labels: ['Brand Strength', 'Price-Value', 'Food Quality', 'Hygiene', 'Digital Presence', 'Speed', 'Loyalty'],
      datasets: [
        { label: 'Zing & Zest', data: [72, 90, 85, 95, 88, 82, 80], borderColor: C.orange, backgroundColor: a(C.orange, 0.12), borderWidth: 2 },
        { label: 'Campus Canteen', data: [35, 82, 45, 40, 20, 60, 15], borderColor: C.rose, backgroundColor: a(C.rose, 0.06), borderWidth: 1.5 },
        { label: 'Standard Outlets', data: [88, 45, 85, 80, 82, 72, 65], borderColor: C.amber, borderDash: [4, 4], backgroundColor: 'transparent', borderWidth: 1.5 },
      ],
    },
    options: { scales: { r: { min: 0, max: 100, ticks: { display: false }, pointLabels: { font: { size: 9 } } } } },
  });

  mkChart('positionChart', {
    type: 'bubble',
    data: {
      datasets: [
        { label: 'Campus Canteen', data: [{ x: 200, y: 3.2, r: 10 }], backgroundColor: a(C.rose, 0.7) },
        { label: 'Local Stalls', data: [{ x: 175, y: 3.4, r: 12 }], backgroundColor: a(C.amber, 0.7) },
        { label: 'Burger Outlets', data: [{ x: 450, y: 4.2, r: 14 }], backgroundColor: a(C.sky, 0.7) },
        { label: 'Premium Cafés', data: [{ x: 850, y: 4.5, r: 16 }], backgroundColor: a(C.violet, 0.7) },
        { label: 'Zing & Zest', data: [{ x: 380, y: 4.6, r: 18 }], backgroundColor: C.orange, borderColor: '#fff', borderWidth: 2 },
      ],
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Price (Rs.)' }, min: 100, max: 950 },
        y: { title: { display: true, text: 'Google Rating' }, min: 3, max: 5 },
      },
    },
  });

  mkChart('socialChart', {
    type: 'bar',
    indexAxis: 'y',
    data: {
      labels: ['Campus Canteen', 'Local Stalls', 'Burger Outlets', 'Premium Cafés', 'Zing & Zest (Target)'],
      datasets: [{ data: [8000, 42000, 35000, 28000, 50000], backgroundColor: [a(C.rose, 0.7), a(C.amber, 0.7), a(C.sky, 0.7), a(C.violet, 0.7), C.orange], borderRadius: 6 }],
    },
    options: { plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: v => (v / 1000) + 'K' } } } },
  });

  mkChart('sentimentChart', {
    type: 'doughnut',
    data: {
      labels: ['Positive (4–5★)', 'Neutral (3★)', 'Negative (1–2★)'],
      datasets: [{ data: [74, 18, 8], backgroundColor: [C.teal, C.amber, C.rose], borderWidth: 0 }],
    },
    options: { cutout: '62%', plugins: { legend: { position: 'bottom' } } },
  });
}

function chartAutomation() {
  mkChart('roiChart', {
    type: 'bar',
    data: {
      labels: ['WhatsApp Bot', 'Email Auto', 'Loyalty Program', 'Re-engagement', 'Referral'],
      datasets: [{ data: [8.2, 5.4, 12.6, 6.8, 9.4], backgroundColor: [C.orange, C.teal, C.amber, C.sky, C.rose], borderRadius: 8 }],
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { title: { display: true, text: 'ROI Multiple (×)' } } } },
  });

  const withAI = [45, 52, 58, 63, 67, 70, 72, 73, 74, 75, 75, 76];
  const without = [45, 42, 40, 38, 36, 35, 34, 33, 32, 31, 31, 30];
  mkChart('retentionChart', {
    type: 'line',
    data: {
      labels: Array.from({ length: 12 }, (_, i) => `M${i + 1}`),
      datasets: [
        { label: 'With Automation', data: withAI, borderColor: C.teal, backgroundColor: a(C.teal, 0.1), fill: true, tension: 0.4 },
        { label: 'Without', data: without, borderColor: C.rose, borderDash: [5, 5], tension: 0.4 },
      ],
    },
    options: { scales: { y: { min: 20, max: 85, ticks: { callback: v => v + '%' } } } },
  });
}

function chartCrisis() {
  const labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const forecast = [700000, 760000, 820000, 720000, 780000, 810000, 855000, 900000, 950000];
  const actual = [700000, 760000, 820000, 720000, 780000, 540000, null, null, null];
  const recovery = [null, null, null, null, null, 540000, 594000, 680000, 792000];
  mkChart('crisisChart', {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Forecast', data: forecast, borderColor: a(C.teal, 0.5), borderDash: [5, 5], pointRadius: 0, tension: 0.4 },
        { label: 'Actual', data: actual, borderColor: C.orange, backgroundColor: a(C.orange, 0.08), fill: true, tension: 0.4 },
        { label: 'Recovery Plan', data: recovery, borderColor: C.amber, borderDash: [4, 2], tension: 0.4 },
      ],
    },
    options: { scales: { y: { ticks: { callback: v => 'Rs.' + (v / 1000).toFixed(0) + 'K' } } } },
  });

  mkChart('recoveryChart', {
    type: 'bar',
    data: {
      labels: ['Month 3 (Crisis)', 'Month 4', 'Month 5', 'Month 6 (Target)'],
      datasets: [
        { label: 'Revenue', data: [540000, 594000, 680000, 792000], backgroundColor: [a(C.rose, 0.85), a(C.amber, 0.85), a(C.sky, 0.85), a(C.teal, 0.9)], borderRadius: 8 },
        { type: 'line', label: 'Pre-Crisis Target', data: [720000, 720000, 720000, 720000], borderColor: a(C.orange, 0.6), borderDash: [6, 3], pointRadius: 0 },
      ],
    },
    options: { scales: { y: { ticks: { callback: v => 'Rs.' + (v / 1000).toFixed(0) + 'K' } } } },
  });
}

function buildMonthlyTable() {
  const tbody = document.getElementById('monthlyTbody');
  if (!tbody) return;
  tbody.innerHTML = ZZ.forecast.monthly.map(d => `
    <tr>
      <td><strong>${d.m}</strong></td>
      <td>${d.c.toLocaleString()}</td>
      <td><strong>Rs. ${(d.rev / 1000).toFixed(0)}K</strong></td>
      <td><span class="tt ${d.g >= 0 ? 'up' : 'down'}">${d.g >= 0 ? '+' : ''}${d.g}%</span></td>
      <td>${d.s}</td>
      <td style="color:var(--teal);font-weight:700;font-size:0.78rem">±${d.ci}%</td>
    </tr>
  `).join('');
}

function setupPeriodToggle() {
  document.querySelectorAll('.pt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const period = btn.dataset.period;
      document.querySelectorAll('.pt-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.period-view').forEach(v => v.classList.remove('active-view'));
      btn.classList.add('active');
      document.getElementById(`pv-${period}`)?.classList.add('active-view');
      setTimeout(() => Object.values(state.charts).forEach(c => { try { c.resize(); } catch (_) {} }), 80);
    });
  });
}

function setupScenarios() {
  document.querySelectorAll('.ss-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ss-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const s = ZZ.forecast.scenarios[btn.dataset.scen];
      if (!s) return;
      const fmt = n => n >= 1e6 ? `Rs. ${(n / 1e6).toFixed(1)}M` : n.toLocaleString();
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('ssRev', fmt(s.rev));
      set('ssBe', `Month ${s.be}`);
      set('ssCust', s.cust.toLocaleString());
      set('ssNpm', `${s.npm}%`);
      set('ssMoM', `${s.mom}%`);
    });
  });
  document.querySelector('.ss-btn[data-scen="base"]')?.click();
}

function showChartLoadError() {
  document.querySelectorAll('.chart-card, .persona-block').forEach(card => {
    if (card.querySelector('canvas') && !card.querySelector('.chart-fallback')) {
      card.insertAdjacentHTML('beforeend', '<p class="chart-fallback">Charts require internet — reload with Chart.js CDN available.</p>');
    }
  });
}

function setupROI() {
  const channels = {
    slSm: { valId: 'rcvSm', cpm: 12, conv: 0.028 },
    slInf: { valId: 'rcvInf', cpm: 8, conv: 0.042 },
    slEv: { valId: 'rcvEv', cpm: 25, conv: 0.065 },
    slWa: { valId: 'rcvWa', cpm: 3, conv: 0.081 },
  };
  const fmt = n => n >= 1e6 ? `Rs. ${(n / 1e6).toFixed(2)}M` : n >= 1000 ? `Rs. ${(n / 1000).toFixed(0)}K` : `Rs. ${Math.round(n)}`;

  function recalc() {
    let budget = 0, reach = 0, conv = 0;
    Object.entries(channels).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const b = parseInt(el.value, 10);
      budget += b;
      const r = b > 0 ? (b / cfg.cpm) * 1000 : 0;
      reach += r;
      conv += r * cfg.conv;
    });
    const revenue = conv * ZZ.menu.avgOrder;
    const roi = budget > 0 ? Math.round((revenue - budget) / budget * 100) : 0;
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('roiPct', roi + '%');
    set('rcReach', reach >= 1000 ? Math.round(reach / 1000) + 'K' : Math.round(reach));
    set('rcConv', Math.round(conv).toLocaleString());
    set('rcRevOut', fmt(revenue));
    set('rcTotalBudget', fmt(budget));
    const g = document.getElementById('gaugePath');
    if (g) g.style.strokeDashoffset = Math.max(251.2 - Math.min(roi / 1200 * 251.2, 251.2), 0);
  }

  Object.entries(channels).forEach(([id, cfg]) => {
    document.getElementById(id)?.addEventListener('input', () => {
      const v = document.getElementById(cfg.valId);
      if (v) v.textContent = `Rs. ${parseInt(document.getElementById(id).value, 10).toLocaleString()}`;
      recalc();
    });
  });
  recalc();
}

function renderDeliverables() {
  const el = document.getElementById('deliverablesGrid');
  if (!el || typeof DELIVERABLES === 'undefined') return;
  el.innerHTML = DELIVERABLES.map(d => `
    <article class="deliverable-card" data-page="${d.page}" tabindex="0" role="button" aria-label="Open ${d.title}">
      <div class="dc-icon">${d.icon}</div>
      <h3>${d.title}</h3>
      <p class="dc-desc">${d.desc}</p>
      <div class="dc-meta">${d.words ? `${d.words} words` : d.count || ''}</div>
      <span class="dc-arrow">View →</span>
    </article>
  `).join('');
  el.querySelectorAll('.deliverable-card').forEach(card => {
    const nav = () => goTo(card.dataset.page);
    card.addEventListener('click', nav);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav(); } });
  });
}

function renderReport() {
  const el = document.getElementById('reportContent');
  if (!el || typeof REPORT === 'undefined') return;
  const badge = document.getElementById('reportWordCount');
  if (badge) badge.textContent = `${REPORT.wordCount.toLocaleString()} words`;
  el.innerHTML = REPORT.sections.map((s, i) => `
    <article class="report-section" id="report-sec-${i}">
      <div class="report-sec-head">
        <span class="report-sec-num">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="report-sec-title">${s.title}</h3>
      </div>
      <div class="report-body">${s.body.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
    </article>
  `).join('');
}

function renderPersonas() {
  const el = document.getElementById('personaCards');
  if (!el || typeof PERSONAS === 'undefined') return;
  const themeMap = { orange: 'ps-orange', teal: 'ps-teal', amber: 'ps-amber' };
  el.innerHTML = PERSONAS.map(p => `
    <article class="persona-card ${themeMap[p.theme] || ''}">
      <div class="pc-top">
        <div class="pc-avatar">${p.avatar}</div>
        <div class="pc-id">
          <h3>${p.name}</h3>
          <p class="pc-role">${p.role}</p>
          <span class="pc-segment">${p.segment} Segment</span>
        </div>
        <div class="pc-share">${p.share}</div>
      </div>
      <blockquote class="pc-quote">${p.quote}</blockquote>
      <div class="pc-stats">
        <div><span>Age</span><strong>${p.age}</strong></div>
        <div><span>Budget</span><strong>${p.budget}</strong></div>
        <div><span>AOV</span><strong>Rs. ${p.aov}</strong></div>
        <div><span>Frequency</span><strong>${p.frequency}</strong></div>
      </div>
      <div class="pc-block">
        <h4>Pain Points</h4>
        <ul>${p.pains.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
      <div class="pc-block">
        <h4>Channels</h4>
        <div class="pc-chips">${p.channels.map(c => `<span class="tag">${c}</span>`).join('')}</div>
      </div>
      <div class="pc-block">
        <h4>Conversion Triggers</h4>
        <div class="pc-chips">${p.triggers.map(t => `<span class="tag tag-outline">${t}</span>`).join('')}</div>
      </div>
      <p class="pc-location">📍 ${p.location}</p>
    </article>
  `).join('');
}

function renderAIGallery() {
  const el = document.getElementById('aiPromptGallery');
  if (!el || typeof AI_PROMPTS === 'undefined') return;
  el.innerHTML = AI_PROMPTS.map(p => `
    <article class="ai-shot">
      <header class="ai-shot-head">
        <div class="ai-shot-dots"><span></span><span></span><span></span></div>
        <span class="ai-shot-title">${p.tool} — ${p.title}</span>
        <span class="ai-validated">${p.validated ? '✓ Validated' : 'Pending'}</span>
      </header>
      <div class="ai-shot-body">
        <div class="ai-msg user">
          <div class="ai-avatar">👤</div>
          <div class="ai-bubble">
            <span class="ai-label">Prompt #${p.id}</span>
            <p>${p.prompt}</p>
          </div>
        </div>
        <div class="ai-msg bot">
          <div class="ai-avatar">🤖</div>
          <div class="ai-bubble">
            <span class="ai-label">AI Response</span>
            <p>${p.response}</p>
          </div>
        </div>
      </div>
      <footer class="ai-shot-foot">
        <span>Cross-checked against Assignments 1–3 source data</span>
        <button type="button" class="ai-copy-btn" data-prompt="${encodeURIComponent(p.prompt)}">Copy Prompt</button>
      </footer>
    </article>
  `).join('');
  el.querySelectorAll('.ai-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = decodeURIComponent(btn.dataset.prompt);
      navigator.clipboard?.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy Prompt'; }, 1800);
      }).catch(() => {});
    });
  });
}

function setupJourney() {
  const stages = document.querySelectorAll('.jp-stage');
  stages.forEach(stage => {
    stage.addEventListener('click', () => {
      stages.forEach(s => s.classList.remove('active'));
      stage.classList.add('active');
    });
  });
  stages[0]?.classList.add('active');
}

const CHAT = {
  location: {
    user: '📍 Where are you today?',
    bot: '📍 <strong>Today\'s Schedule</strong><br><br>🕛 <strong>12:00–3:00 PM</strong> → UCP Main Gate<br>🕔 <strong>5:00–10:00 PM</strong> → Liberty Market / Gulberg III<br>🕐 <strong>1–2 PM & 6–9 PM</strong> → DHA Phase 5/6<br><br>Follow <strong>@ZingZestStreetBites</strong> for daily location updates.',
  },
  menu: {
    user: '🍔 Show me the menu',
    bot: '🌟 <strong>Menu Highlights</strong><br><br>🍔 Zing Classic — <strong>Rs. 280</strong><br>🍔 Smoky Grill — <strong>Rs. 380</strong><br>🌯 Zesty Shawarma — <strong>Rs. 250</strong><br>🌯 Double Bite — <strong>Rs. 350</strong><br>🍟 Masala Crunch Fries — <strong>Rs. 150</strong><br><br>🎁 <strong>Student Combo</strong> — Rs. 380 (Burger + Fries + Drink)',
  },
  order: {
    user: '📋 How do I order?',
    bot: '📋 <strong>3 Easy Steps</strong><br><br>1️⃣ WhatsApp your order before arriving<br>2️⃣ We prepare while you\'re on the way<br>3️⃣ Pick up at the truck — no waiting!<br><br>📱 DM: @ZingZestStreetBites',
  },
  loyalty: {
    user: '⭐ Loyalty program?',
    bot: '🎁 <strong>Zing Loyalty Card</strong><br><br>✅ Stamp on orders above Rs. 300<br>✅ <strong>5th visit = FREE meal</strong><br><br>Fresh. Fast. Full of Flavor.',
  },
};

function chatDemo(type) {
  const box = document.getElementById('chatDemo');
  const resp = CHAT[type];
  if (!box || !resp) return;
  box.querySelectorAll('.chat-options').forEach(el => el.remove());
  box.insertAdjacentHTML('beforeend', `<div class="msg user"><div class="msg-bubble">${resp.user}</div></div>`);
  setTimeout(() => {
    box.insertAdjacentHTML('beforeend', `<div class="msg bot"><div class="msg-bubble">${resp.bot}</div></div>`);
    box.scrollTop = box.scrollHeight;
    box.insertAdjacentHTML('beforeend', `<div class="chat-options">
      <button class="chat-opt" onclick="chatDemo('location')">📍 Location</button>
      <button class="chat-opt" onclick="chatDemo('menu')">🍔 Menu</button>
      <button class="chat-opt" onclick="chatDemo('order')">📋 Order</button>
      <button class="chat-opt" onclick="chatDemo('loyalty')">⭐ Loyalty</button>
    </div>`);
    box.scrollTop = box.scrollHeight;
  }, 500);
}

function setupPresent() {
  document.getElementById('btnPresent')?.addEventListener('click', enterPresentation);
}

function enterPresentation() {
  state.present.active = true;
  state.present.idx = 0;
  const overlay = document.getElementById('presentOverlay');
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateSlide(0);
  document.documentElement.requestFullscreen?.().catch(() => {});
}

function exitPresentation() {
  state.present.active = false;
  document.getElementById('presentOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
  document.exitFullscreen?.().catch(() => {});
}

function slideNav(dir) {
  const slides = document.querySelectorAll('.po-slide');
  const total = slides.length;
  slides[state.present.idx]?.classList.remove('active');
  state.present.idx = (state.present.idx + dir + total) % total;
  updateSlide(state.present.idx);
}

function updateSlide(i) {
  document.querySelectorAll('.po-slide').forEach((s, idx) => s.classList.toggle('active', idx === i));
  const counter = document.getElementById('pocCounter');
  const title = document.getElementById('pocTitle');
  if (counter) counter.textContent = `${i + 1} / 8`;
  if (title) title.textContent = document.querySelectorAll('.po-slide')[i]?.querySelector('h2')?.textContent || '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'p' || e.key === 'P') {
    if (document.activeElement.tagName.match(/input|textarea/i)) return;
    e.preventDefault();
    state.present.active ? exitPresentation() : enterPresentation();
  }
  if (state.present.active) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); slideNav(1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); slideNav(-1); }
    if (e.key === 'Escape') { e.preventDefault(); exitPresentation(); }
  }
  if (e.altKey) {
    const map = { 1: 'cover', 2: 'report', 3: 'part4', 4: 'part2', 5: 'part3', 6: 'part5', 7: 'transparency', 8: 'conclusion' };
    if (map[e.key]) { e.preventDefault(); goTo(map[e.key]); }
  }
});

window.addEventListener('resize', () => {
  clearTimeout(window._rz);
  window._rz = setTimeout(() => Object.values(state.charts).forEach(c => { try { c.resize(); } catch (_) {} }), 200);
});

window.goTo = goTo;
window.chatDemo = chatDemo;
window.enterPresentation = enterPresentation;
window.exitPresentation = exitPresentation;
window.slideNav = slideNav;
