import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

base = r'd:\UCP DATA\8th semester\Fundamentals of Marketing_CM\FOM Assignment 4\Assignment 4 (1)'
with open(base + r'\app.js', encoding='utf-8') as f:
    js = f.read()

changes = 0
def rep(js, old, new, label):
    global changes
    if old in js:
        changes += 1
        print(f'OK: {label}')
        return js.replace(old, new)
    else:
        print(f'MISS: {label}')
        return js

# ===== 1. FILE HEADER =====
js = rep(js,
    '/* ══════════════════════════════════════════════════\n   FUSIONBITES AI — APP ENGINE\n   Spring 2026 | AIUE3013\n   ══════════════════════════════════════════════════ */',
    '/* ══════════════════════════════════════════════════\n   ZING & ZEST STREET BITES — APP ENGINE\n   Spring 2026 | AIUE3013 | Fundamentals of Marketing\n   Group: Ahmad Yasin, Abdul Rehman, Eman Sarfraz,\n          Nouman Zakar, Ali Hassan\n   ══════════════════════════════════════════════════ */',
    'File header'
)

# ===== 2. STATUS MESSAGES =====
js = rep(js,
    "const STATUS_MSGS = [\n  'Initializing AI modules...',\n  'Loading persona engine...',\n  'Connecting to analytics...',\n  'Building forecast models...',\n  'Rendering dashboard...',\n];",
    "const STATUS_MSGS = [\n  'Initializing Zing & Zest Dashboard...',\n  'Loading customer persona engine...',\n  'Connecting to IMC analytics...',\n  'Building Rs. 45,150 campaign model...',\n  'Rendering marketing dashboard...',\n];",
    'Status messages'
)

# ===== 3. COLORS - Replace indigo/violet to orange/teal =====
js = rep(js,
    "const C = {\n  indigo: '#6366f1', indigo2: '#818cf8',\n  violet: '#8b5cf6',\n  emerald: '#10b981', emerald2: '#34d399',\n  amber: '#f59e0b', amber2: '#fbbf24',\n  rose: '#f43f5e', rose2: '#fb7185',\n  sky: '#0ea5e9', sky2: '#38bdf8',\n  cyan: '#06b6d4',\n  pink: '#ec4899',\n};",
    "const C = {\n  indigo: '#f97316', indigo2: '#fb923c',   // Zing Orange (primary brand)\n  violet: '#ea580c',                         // Dark Orange\n  emerald: '#0d9488', emerald2: '#14b8a6',   // Zest Teal (secondary brand)\n  amber: '#f59e0b', amber2: '#fbbf24',\n  rose: '#f43f5e', rose2: '#fb7185',\n  sky: '#0ea5e9', sky2: '#38bdf8',\n  cyan: '#06b6d4',\n  pink: '#ec4899',\n};",
    'Colors object'
)

# ===== 4. MONTHLY DATA - Real Zing & Zest projections =====
js = rep(js,
    "const MONTHLY = [\n  { m:'January',   c:2160, rev:720000,   g:0,     s:'Normal',         ci:12 },\n  { m:'February',  c:2419, rev:777600,   g:8,     s:'Normal',         ci:11 },\n  { m:'March',     c:2687, rev:851328,   g:9.5,   s:'Normal',         ci:10 },\n  { m:'April',     c:2930, rev:936461,   g:10,    s:'Summer starts',  ci:11 },\n  { m:'May',       c:2624, rev:795992,   g:-15,   s:'Summer −15%',    ci:12 },\n  { m:'June',      c:1968, rev:676593,   g:-15,   s:'Monsoon −10%',   ci:13 },\n  { m:'July',      c:2143, rev:716789,   g:6,     s:'Recovery',       ci:11 },\n  { m:'August',    c:2271, rev:759397,   g:6,     s:'Eid buildup',    ci:10 },\n  { m:'September', c:2726, rev:1025486,  g:35,    s:'Eid +35% 🎉',    ci:9  },\n  { m:'October',   c:2862, rev:956023,   g:-7,    s:'Post-Eid dip',   ci:10 },\n  { m:'November',  c:2948, rev:1013584,  g:6,     s:'Normal',         ci:9  },\n  { m:'December',  c:3220, rev:1124442,  g:10.9,  s:'Year-end Peak',  ci:8  },\n];",
    "// Real projections based on Assignment 3 targets:\n// Day 1: 100 customers | Avg order: Rs. 380 | 6 days/week\n// Locations: UCP Gate (lunch), Gulberg/DHA (evening)\nconst MONTHLY = [\n  { m:'June (Launch)', c:737,  rev:280000,  g:0,    s:'Launch month 🚀', ci:18 },\n  { m:'July',          c:895,  rev:340000,  g:21,   s:'Word-of-mouth',   ci:15 },\n  { m:'August',        c:1026, rev:390000,  g:15,   s:'Campus returns',  ci:13 },\n  { m:'September',     c:1171, rev:445000,  g:14,   s:'UCP peak season', ci:11 },\n  { m:'October',       c:1342, rev:510000,  g:15,   s:'Strong growth',   ci:10 },\n  { m:'November',      c:1526, rev:580000,  g:14,   s:'Pre-winter peak', ci:9  },\n  { m:'December',      c:1711, rev:650000,  g:12,   s:'Year-end high',   ci:9  },\n  { m:'January',       c:1303, rev:495000,  g:-24,  s:'Exams + weather', ci:12 },\n  { m:'February',      c:1474, rev:560000,  g:13,   s:'Recovery',        ci:11 },\n  { m:'March',         c:1553, rev:590000,  g:5,    s:'Normal',          ci:10 },\n  { m:'April',         c:1395, rev:530000,  g:-10,  s:'Ramadan effect',  ci:12 },\n  { m:'May',           c:1421, rev:540000,  g:2,    s:'Year 1 close',    ci:11 },\n];",
    'Monthly data'
)

# ===== 5. CHART DAILY - Update to Zing & Zest realistic values =====
js = rep(js,
    "  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];\n  const rev = [23040, 29325, 32400, 31240, 35625, 49200, 12530];\n  const cust = [72, 85, 90, 88, 95, 120, 33];",
    "  // UCP open Mon-Fri lunch, Gulberg/DHA evening Fri-Sun\n  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];\n  const rev = [18240, 21280, 23560, 22800, 29640, 38000, 16480];  // Rs. based on Rs.380 avg order\n  const cust = [48, 56, 62, 60, 78, 100, 43];  // Day 1 target: 100 (from Assignment 3)",
    'Daily chart data'
)

# ===== 6. CHANNEL BAR CHART - Update persona names =====
js = rep(js,
    "        { label: 'Ali (Student)', data: [92,85,78,30,25,10], backgroundColor: a(C.indigo,0.8), borderRadius: 6 },\n        { label: 'Sana (Professional)', data: [22,88,55,80,40,65], backgroundColor: a(C.emerald,0.8), borderRadius: 6 },\n        { label: 'Bilal (Explorer)', data: [68,95,42,60,82,30], backgroundColor: a(C.amber,0.8), borderRadius: 6 },",
    "        { label: 'Usama (Student)', data: [84,92,78,28,18,8], backgroundColor: a(C.indigo,0.85), borderRadius: 6 },\n        { label: 'Fatima (Professional)', data: [18,74,86,62,36,44], backgroundColor: a(C.emerald,0.85), borderRadius: 6 },\n        { label: 'Imran (Family)', data: [12,42,80,52,28,72], backgroundColor: a(C.amber,0.85), borderRadius: 6 },",
    'Channel bar persona names'
)

js = rep(js,
    "      labels: ['TikTok', 'Instagram', 'WhatsApp', 'Google Maps', 'YouTube', 'LinkedIn'],",
    "      labels: ['TikTok', 'Instagram', 'WhatsApp', 'Google Maps', 'Facebook', 'Word of Mouth'],",
    'Channel bar labels'
)

# ===== 7. PERSONA VALUE CHART - Update persona names + order values =====
js = rep(js,
    "      labels: ['Ali Hassan\\n(Student)', 'Sana Malik\\n(Professional)', 'Bilal Chaudhry\\n(Explorer)'],\n      datasets: [\n        { label: 'Avg. Order Value (Rs.)', data: [280, 550, 900], backgroundColor: [a(C.indigo,0.85), a(C.emerald,0.85), a(C.amber,0.85)], borderRadius: 8 },\n        { label: 'Revenue Share %', data: [45, 35, 20], backgroundColor: [a(C.indigo,0.35), a(C.emerald,0.35), a(C.amber,0.35)], borderRadius: 8 },",
    "      labels: ['Usama Tariq\\n(Student)', 'Fatima Rizvi\\n(Professional)', 'Imran Sheikh\\n(Family)'],\n      datasets: [\n        { label: 'Avg. Order Value (Rs.)', data: [380, 550, 1100], backgroundColor: [a(C.indigo,0.85), a(C.emerald,0.85), a(C.amber,0.85)], borderRadius: 8 },\n        { label: 'Revenue Share %', data: [60, 28, 12], backgroundColor: [a(C.indigo,0.35), a(C.emerald,0.35), a(C.amber,0.35)], borderRadius: 8 },",
    'Persona value chart'
)

# ===== 8. SCENARIOS - Update to Zing & Zest PKR values =====
old_scenarios = "const SCENARIOS = {"
idx = js.find(old_scenarios)
if idx != -1:
    end_idx = js.find("\n};", idx) + 3
    old_block = js[idx:end_idx]
    new_block = """const SCENARIOS = {
  conservative: {
    rev: 4200000,   // Rs. 4.2M Year 1 (conservative)
    be: 2,          // Break-even month 2
    cust: 850,      // avg customers/month
    npm: 18,        // net profit margin %
    mom: 8          // avg month-over-month growth %
  },
  base: {
    rev: 5900000,   // Rs. 5.9M Year 1 (base case)
    be: 2,          // Break-even month 2 (750 orders/month)
    cust: 1200,     // avg customers/month
    npm: 24,        // net profit margin %
    mom: 12         // avg month-over-month growth %
  },
  optimistic: {
    rev: 8500000,   // Rs. 8.5M Year 1 (optimistic — Foodpanda + 2nd truck)
    be: 1,          // Break-even month 1
    cust: 1800,     // avg customers/month
    npm: 31,        // net profit margin %
    mom: 18         // avg month-over-month growth %
  },
};"""
    js = js.replace(old_block, new_block)
    changes += 1
    print('OK: Scenarios block')
else:
    print('MISS: Scenarios block')

# ===== 9. CHATBOT RESPONSES - Update to Zing & Zest menu =====
old_chat = "case 'location':"
idx = js.find(old_chat)
if idx != -1:
    # Find the chatDemoFn block
    fn_start = js.rfind('function chatDemo', 0, idx)
    fn_end = js.find('\nfunction ', fn_start + 10)
    old_fn = js[fn_start:fn_end]
    new_fn = """function chatDemo(type) {
  const chatDiv = document.getElementById('chatDemo');
  if (!chatDiv) return;

  const responses = {
    location: {
      user: '📍 Where are you today?',
      bot: '📍 <strong>Today\'s Locations:</strong><br>🕐 12:00–3:00 PM → UCP Main Gate (student lunch)<br>🕔 5:00–10:00 PM → Liberty Market / Gulberg III<br><br>📌 <em>Follow @ZingZestStreetBites on Instagram for daily updates!</em>'
    },
    menu: {
      user: '🍔 Show me the menu',
      bot: '🌟 <strong>Zing &amp; Zest Menu:</strong><br>🍔 Zing Classic Burger — Rs. 280<br>🥩 Smoky Grill Burger — Rs. 380<br>🌯 Zesty Chicken Shawarma — Rs. 250<br>🌯 Double Bite Shawarma — Rs. 350<br>🍟 Masala Crunch Fries — Rs. 150<br>🥤 Cold Drink (Large) — Rs. 120<br><br>📦 <strong>Student Combo</strong> (Burger+Fries+Drink): <em>Rs. 380</em> 🔥'
    },
    order: {
      user: '📋 How do I order?',
      bot: '📋 <strong>Order in 3 steps:</strong><br>1️⃣ WhatsApp us your order before arriving<br>2️⃣ We prepare while you\'re on the way<br>3️⃣ Pick up at the truck — no waiting!<br><br>⭐ <strong>Zing Loyalty Card:</strong> Your 5th meal is FREE!<br>DM us on Instagram: @ZingZestStreetBites'
    },
    loyalty: {
      user: '⭐ Tell me about rewards',
      bot: '🎁 <strong>Zing Loyalty Program:</strong><br>✅ Get a loyalty card on your 1st visit<br>✅ Stamp for every order above Rs. 300<br>✅ 5th stamp = FREE meal of your choice!<br><br>📲 Also: Follow us for daily deals &amp; new items.<br>#ZingAndZest #UCPEats #FreshFastFull'
    }
  };

  const r = responses[type] || responses.menu;
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.innerHTML = `<div class="msg-bubble">${r.user}</div>`;
  chatDiv.appendChild(userMsg);

  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'msg bot';
    botMsg.innerHTML = `<div class="msg-bubble">${r.bot}</div>`;
    chatDiv.appendChild(botMsg);
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }, 600);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}
"""
    js = js.replace(old_fn, new_fn)
    changes += 1
    print('OK: Chatbot function')
else:
    print('MISS: Chatbot function')

# ===== 10. COMPETITOR RADAR - Update colors =====
js = rep(js,
    "      labels: ['Quality', 'Price-Value', 'Hygiene', 'Speed', 'Brand', 'Digital Presence', 'Innovation'],\n      datasets: [\n        { label: 'Zing & Zest Street Bites', data: [82,88,90,78,72,85,80],",
    "      labels: ['Quality', 'Price-Value', 'Hygiene', 'Speed', 'Brand', 'Digital Presence', 'Loyalty'],\n      datasets: [\n        { label: 'Zing & Zest Street Bites', data: [85,90,95,80,70,88,82],",
    'Competitor radar data'
)

# ===== 11. Export CSV - Update brand =====
js = rep(js,
    "'Zing & Zest Street Bites AI Marketing Dashboard — Monthly Revenue Report\\n'",
    "'Zing & Zest Street Bites — Monthly Revenue Forecast Report (Assignment 4)\\n'",
    'CSV export header'
)

print(f'\nTotal changes: {changes}')
with open(base + r'\app.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('app.js saved OK')
