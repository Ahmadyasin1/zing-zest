import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

base = r'd:\UCP DATA\8th semester\Fundamentals of Marketing_CM\FOM Assignment 4\Assignment 4 (1)'
with open(base + r'\index.html', encoding='utf-8') as f:
    html = f.read()

changes = 0

def rep(html, old, new, label):
    global changes
    if old in html:
        changes += 1
        print(f'OK: {label}')
        return html.replace(old, new)
    else:
        print(f'MISS: {label}')
        return html

# ===== PERSONA 1 name & role =====
html = rep(html,
    '<h3>Ali Hassan</h3>\n            <div class="pb-role">The Trend-Hungry Student</div>\n            <div class="pb-tags">\n              <span>Age 19–23</span><span>BSCS Student</span><span>Rs. 150–400 budget</span><span>UCP Campus</span>',
    '<h3>Usama Tariq</h3>\n            <div class="pb-role">The Campus Foodie (Primary Segment — 12/20 Research Respondents)</div>\n            <div class="pb-tags">\n              <span>Age 18–24</span><span>BSAI Student · UCP</span><span>Rs. 300–500 budget</span><span>UCP Campus Area</span>',
    'P1 header'
)

html = rep(html,
    'Highly social, trend-conscious university student who discovers food through short-form video content. Motivated by <strong>FOMO (Fear of Missing Out)</strong> and social currency — what he eats defines his digital identity. Seeks Instagrammable food experiences within a tight student budget. Makes impulsive, emotion-driven purchase decisions. Tech-savvy early adopter who loves exclusive limited-edition drops.',
    'UCP campus student representing the <strong>primary target segment</strong> of Zing &amp; Zest Street Bites — 12 out of 20 respondents in our Assignment 1 field research were students. Discovers food through Instagram and TikTok, strongly influenced by peer recommendations via WhatsApp. Budget-conscious but hygiene-aware — our research found hygiene was the #1 expectation (18/20 mentions). Prefers Shawarma and Burgers, typically orders during lunch break (1–3 PM) or evening (5–8 PM). The <strong>Student Combo at Rs. 380</strong> is perfectly designed for this persona.',
    'P1 psycho'
)

html = rep(html,
    '<li><span class="pain-tag red">Critical</span> Overpriced food vs. actual quality received</li>\n                  <li><span class="pain-tag orange">High</span> Long queues during peak lunch hours (12–2 PM)</li>\n                  <li><span class="pain-tag orange">High</span> No live location tracking — truck may have moved</li>\n                  <li><span class="pain-tag yellow">Medium</span> Limited healthy/high-protein halal options</li>',
    '<li><span class="pain-tag red">Critical</span> Hygiene uncertainty at campus food stalls (18/20 research mentions)</li>\n                  <li><span class="pain-tag red">Critical</span> Poor value — Rs. 300+ for low-quality or unsafe food</li>\n                  <li><span class="pain-tag orange">High</span> Long queues at UCP canteen during 1–3 PM rush</li>\n                  <li><span class="pain-tag yellow">Medium</span> No student combo offers — forced to buy items separately</li>',
    'P1 pains'
)

html = rep(html,
    '<li>\U0001f4f1 Viral TikTok/Instagram Reel of the dish</li>\n                  <li>\U0001f46b Direct recommendation from friend in WhatsApp</li>\n                  <li>\U0001f3f7️ Student discount combo (e.g., "Student Meal: Rs.199")</li>\n                  <li>\U0001f195 "New Item Alert" push notification on WhatsApp</li>',
    '<li>\U0001f4f1 Instagram Reel / TikTok video: #UCPEats #ZingAndZest</li>\n                  <li>\U0001f46b WhatsApp: "Bhai ye try karo — Zing &amp; Zest gate pe hai"</li>\n                  <li>\U0001f3f7️ Student Combo Rs. 380: Classic Burger + Fries + Cold Drink</li>\n                  <li>✅ Visible hygiene — gloves, clean prep area, covered trays</li>',
    'P1 triggers'
)

html = rep(html,
    '<div class="ch-row"><span>TikTok</span><div class="ch-track"><div class="ch-fill" style="--w:92%;--c:#818cf8"></div></div><strong>92%</strong></div>\n              <div class="ch-row"><span>Instagram Reels</span><div class="ch-track"><div class="ch-fill" style="--w:85%;--c:#a78bfa"></div></div><strong>85%</strong></div>\n              <div class="ch-row"><span>WhatsApp Broadcast</span><div class="ch-track"><div class="ch-fill" style="--w:78%;--c:#7c3aed"></div></div><strong>78%</strong></div>\n              <div class="ch-row"><span>Word of Mouth</span><div class="ch-track"><div class="ch-fill" style="--w:70%;--c:#6d28d9"></div></div><strong>70%</strong></div>',
    '<div class="ch-row"><span>Instagram Reels / Stories</span><div class="ch-track"><div class="ch-fill" style="--w:92%;--c:#f97316"></div></div><strong>92%</strong></div>\n              <div class="ch-row"><span>TikTok Videos</span><div class="ch-track"><div class="ch-fill" style="--w:84%;--c:#ea580c"></div></div><strong>84%</strong></div>\n              <div class="ch-row"><span>WhatsApp (Peer Rec.)</span><div class="ch-track"><div class="ch-fill" style="--w:78%;--c:#0d9488"></div></div><strong>78%</strong></div>\n              <div class="ch-row"><span>Word of Mouth (Campus)</span><div class="ch-track"><div class="ch-fill" style="--w:66%;--c:#14b8a6"></div></div><strong>66%</strong></div>',
    'P1 channels'
)

html = rep(html,
    '<div class="pbk"><div class="pbk-v">Rs. 280</div><div class="pbk-l">Avg. Order Value</div></div>\n              <div class="pbk"><div class="pbk-v">2–3×/wk</div><div class="pbk-l">Visit Frequency</div></div>\n              <div class="pbk"><div class="pbk-v">45%</div><div class="pbk-l">Revenue Share</div></div>\n              <div class="pbk"><div class="pbk-v">High</div><div class="pbk-l">Referral Power</div></div>',
    '<div class="pbk"><div class="pbk-v">Rs. 380</div><div class="pbk-l">Avg. Order Value</div></div>\n              <div class="pbk"><div class="pbk-v">3–4×/wk</div><div class="pbk-l">Visit Frequency</div></div>\n              <div class="pbk"><div class="pbk-v">60%</div><div class="pbk-l">Revenue Share</div></div>\n              <div class="pbk"><div class="pbk-v">Very High</div><div class="pbk-l">Referral Power</div></div>',
    'P1 KPIs'
)

# ===== PERSONA 2 name & role =====
html = rep(html,
    '<h3>Sana Malik</h3>\n            <div class="pb-role">The Quality-Conscious Professional</div>\n            <div class="pb-tags">\n              <span>Age 25–35</span><span>Marketing Manager</span><span>Rs. 400–800 budget</span><span>Gulberg III</span>',
    '<h3>Fatima Rizvi</h3>\n            <div class="pb-role">The Efficiency-First Professional (Secondary Segment)</div>\n            <div class="pb-tags">\n              <span>Age 26–38</span><span>Office Executive · Gulberg / DHA</span><span>Rs. 500–700 budget</span><span>Gulberg III / DHA Phase 5–6</span>',
    'P2 header'
)

html = rep(html,
    'Health-conscious urban professional who meticulously plans meals and prioritizes <strong>nutrition transparency and brand authenticity</strong>. Micro-influencer with 4K Instagram followers; trusts peer reviews over advertisements. Values consistency, hygiene certification, and digital receipt availability. Will become a brand advocate if quality consistently exceeds expectations.',
    'Office professional working near Gulberg III or DHA — representing the <strong>secondary segment</strong> from Assignment 1 research. Has a tight 45-minute lunch window and demands speed AND quality simultaneously. Hygiene is her #1 non-negotiable. Discovered Zing &amp; Zest through a colleague’s WhatsApp recommendation or Instagram. Orders the <strong>Wrap Combo (Rs. 350) or Smoky Grill Burger (Rs. 380)</strong>. Our DHA Phase 5/6 location (1–2 PM &amp; 6–9 PM) was designed specifically for this persona.',
    'P2 psycho'
)

html = rep(html,
    '<li><span class="pain-tag red">Critical</span> No calorie/nutritional information displayed</li>\n                  <li><span class="pain-tag red">Critical</span> Visible hygiene concerns at food preparation</li>\n                  <li><span class="pain-tag orange">High</span> Inconsistent taste quality between visits</li>\n                  <li><span class="pain-tag yellow">Medium</span> No digital payment or receipt system</li>',
    '<li><span class="pain-tag red">Critical</span> Hygiene doubt — cannot see the food prep area at stalls</li>\n                  <li><span class="pain-tag red">Critical</span> Long wait — cannot spend 30 min in queue on lunch break</li>\n                  <li><span class="pain-tag orange">High</span> Inconsistent quality — "was excellent once, average next"</li>\n                  <li><span class="pain-tag yellow">Medium</span> No WhatsApp pre-order for pickup</li>',
    'P2 pains'
)

html = rep(html,
    '<li>⭐ 4.5+ star Google Maps rating with 100+ reviews</li>\n                  <li>\U0001f4ca Visible nutritional chart and ingredient sourcing info</li>\n                  <li>\U0001f331 "Locally-sourced fresh ingredients" claim verified</li>\n                  <li>\U0001f4b3 Loyalty rewards — points accumulate per visit</li>',
    '<li>✅ Clean workspace, gloves, covered food displayed visibly</li>\n                  <li>\U0001f464 Colleague recommendation: "best shawarma near office"</li>\n                  <li>\U0001f4f1 WhatsApp location pin at 12 PM: DHA Phase 5/6</li>\n                  <li>\U0001f381 Zing Loyalty Card — 5th visit free (from Assignment 3 plan)</li>',
    'P2 triggers'
)

html = rep(html,
    '<div class="ch-row"><span>Instagram Stories</span><div class="ch-track"><div class="ch-fill" style="--w:88%;--c:#10b981"></div></div><strong>88%</strong></div>\n              <div class="ch-row"><span>Google Maps/Reviews</span><div class="ch-track"><div class="ch-fill" style="--w:80%;--c:#34d399"></div></div><strong>80%</strong></div>\n              <div class="ch-row"><span>Email Newsletter</span><div class="ch-track"><div class="ch-fill" style="--w:65%;--c:#6ee7b7"></div></div><strong>65%</strong></div>\n              <div class="ch-row"><span>LinkedIn Feed</span><div class="ch-track"><div class="ch-fill" style="--w:60%;--c:#a7f3d0"></div></div><strong>60%</strong></div>',
    '<div class="ch-row"><span>WhatsApp Broadcast</span><div class="ch-track"><div class="ch-fill" style="--w:86%;--c:#0d9488"></div></div><strong>86%</strong></div>\n              <div class="ch-row"><span>Instagram Stories</span><div class="ch-track"><div class="ch-fill" style="--w:74%;--c:#14b8a6"></div></div><strong>74%</strong></div>\n              <div class="ch-row"><span>Google Maps Reviews</span><div class="ch-track"><div class="ch-fill" style="--w:62%;--c:#0f766e"></div></div><strong>62%</strong></div>\n              <div class="ch-row"><span>Facebook (Groups)</span><div class="ch-track"><div class="ch-fill" style="--w:44%;--c:#134e4a"></div></div><strong>44%</strong></div>',
    'P2 channels'
)

html = rep(html,
    '<div class="pbk"><div class="pbk-v">Rs. 550</div><div class="pbk-l">Avg. Order Value</div></div>\n              <div class="pbk"><div class="pbk-v">1×/wk</div><div class="pbk-l">Visit Frequency</div></div>\n              <div class="pbk"><div class="pbk-v">35%</div><div class="pbk-l">Revenue Share</div></div>\n              <div class="pbk"><div class="pbk-v">3.2×</div><div class="pbk-l">LTV Multiplier</div></div>',
    '<div class="pbk"><div class="pbk-v">Rs. 550</div><div class="pbk-l">Avg. Order Value</div></div>\n              <div class="pbk"><div class="pbk-v">2×/wk</div><div class="pbk-l">Visit Frequency</div></div>\n              <div class="pbk"><div class="pbk-v">28%</div><div class="pbk-l">Revenue Share</div></div>\n              <div class="pbk"><div class="pbk-v">2.6×</div><div class="pbk-l">LTV Multiplier</div></div>',
    'P2 KPIs'
)

# ===== PERSONA 3 name & role =====
html = rep(html,
    '<h3>Bilal Chaudhry</h3>\n            <div class="pb-role">The Adventure-Seeking Food Explorer</div>\n            <div class="pb-tags">\n              <span>Age 28–42</span><span>Food Blogger</span><span>Rs. 500–1,500 budget</span><span>Lahore-wide</span>',
    '<h3>Imran Sheikh</h3>\n            <div class="pb-role">The Trust-First Family Buyer (Tertiary Segment)</div>\n            <div class="pb-tags">\n              <span>Age 32–48</span><span>IT Manager · DHA / Model Town</span><span>Rs. 800–1,500 family order</span><span>DHA Phase 5–6 / Liberty Market</span>',
    'P3 header'
)

html = rep(html,
    'Passionate food enthusiast and lifestyle content creator who actively hunts for <strong>unique, undiscovered culinary experiences</strong> before they go viral. Strong local food community presence with 15K Instagram followers and a personal blog. Values the origin story and cultural narrative behind food as much as the taste itself. One authentic review drives 50+ new customers.',
    'Family head from DHA Phase 5/6 or Model Town — the <strong>tertiary segment</strong> identified in our Assignment 1 field interviews. Visits Zing &amp; Zest on evenings and weekends with family. Puts highest importance on hygiene and food safety (children are present). Discovers the brand through a neighbour’s or friend’s recommendation on WhatsApp or Facebook. Orders the <strong>Friends Combo (Rs. 1,200)</strong> or multiple individual items. Our branded packaging (burger box, carry bag) and visible clean setup directly build trust with this persona.',
    'P3 psycho'
)

html = rep(html,
    '<li><span class="pain-tag orange">High</span> No unique/fusion concept differentiates trucks</li>\n                  <li><span class="pain-tag orange">High</span> Poor lighting/presentation for food photography</li>\n                  <li><span class="pain-tag yellow">Medium</span> No story or chef narrative behind the food</li>\n                  <li><span class="pain-tag yellow">Medium</span> Menus never change — no seasonal specials</li>',
    '<li><span class="pain-tag red">Critical</span> Hygiene doubt — is this food safe for my children?</li>\n                  <li><span class="pain-tag red">Critical</span> No family-sized combo or group deal available</li>\n                  <li><span class="pain-tag orange">High</span> Truck’s location is unpredictable — no fixed schedule</li>\n                  <li><span class="pain-tag yellow">Medium</span> No seating area or shade near the truck</li>',
    'P3 pains'
)

html = rep(html,
    '<li>\U0001f30d Genuinely novel Korean-Desi/Italian-Pakistani fusion</li>\n                  <li>\U0001f468‍\U0001f373 Chef\'s secret menu or limited-edition item</li>\n                  <li>\U0001f91d Personal collaboration/brand ambassador invite</li>\n                  <li>\U0001f4f8 Aesthetically photo-worthy presentation setup</li>',
    '<li>\U0001f468‍\U0001f469‍\U0001f467 Friends Combo: 2 Burgers + 2 Shawarmas + 4 Fries = Rs. 1,200</li>\n                  <li>\U0001f9fc Visibly clean setup, gloves, sealed trays, branded packaging</li>\n                  <li>\U0001f4f1 Facebook review: "Excellent hygiene, kids loved it"</li>\n                  <li>\U0001f4e6 Proper carry bag + burger box + labelled packaging</li>',
    'P3 triggers'
)

html = rep(html,
    '<div class="ch-row"><span>Instagram Feed/Reels</span><div class="ch-track"><div class="ch-fill" style="--w:95%;--c:#f59e0b"></div></div><strong>95%</strong></div>\n              <div class="ch-row"><span>YouTube Vlogs</span><div class="ch-track"><div class="ch-fill" style="--w:82%;--c:#fbbf24"></div></div><strong>82%</strong></div>\n              <div class="ch-row"><span>Personal Food Blog</span><div class="ch-track"><div class="ch-fill" style="--w:75%;--c:#fcd34d"></div></div><strong>75%</strong></div>\n              <div class="ch-row"><span>Facebook Groups</span><div class="ch-track"><div class="ch-fill" style="--w:68%;--c:#fde68a"></div></div><strong>68%</strong></div>',
    '<div class="ch-row"><span>WhatsApp Family Groups</span><div class="ch-track"><div class="ch-fill" style="--w:88%;--c:#f59e0b"></div></div><strong>88%</strong></div>\n              <div class="ch-row"><span>Facebook (Lahore groups)</span><div class="ch-track"><div class="ch-fill" style="--w:72%;--c:#fbbf24"></div></div><strong>72%</strong></div>\n              <div class="ch-row"><span>Word of Mouth (Trusted)</span><div class="ch-track"><div class="ch-fill" style="--w:90%;--c:#f97316"></div></div><strong>90%</strong></div>\n              <div class="ch-row"><span>Google Maps Reviews</span><div class="ch-track"><div class="ch-fill" style="--w:52%;--c:#fcd34d"></div></div><strong>52%</strong></div>',
    'P3 channels'
)

with open(base + r'\index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f'\nTotal changes: {changes}')
print('Personas saved OK')
