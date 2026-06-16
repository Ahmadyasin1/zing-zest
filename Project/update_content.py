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

# ===== P3 KPIs (was blogger, now family) =====
html = rep(html,
    '<div class="pbk"><div class="pbk-v">Rs. 900</div><div class="pbk-l">Avg. Order Value</div></div>\n              <div class="pbk"><div class="pbk-v">2×/month</div><div class="pbk-l">Visit Frequency</div></div>\n              <div class="pbk"><div class="pbk-v">8×</div><div class="pbk-l">Marketing ROI</div></div>\n              <div class="pbk"><div class="pbk-v">50+</div><div class="pbk-l">Customers Driven</div></div>',
    '<div class="pbk"><div class="pbk-v">Rs. 1,100</div><div class="pbk-l">Avg. Family Order</div></div>\n              <div class="pbk"><div class="pbk-v">2×/month</div><div class="pbk-l">Visit Frequency</div></div>\n              <div class="pbk"><div class="pbk-v">12%</div><div class="pbk-l">Revenue Share</div></div>\n              <div class="pbk"><div class="pbk-v">High</div><div class="pbk-l">Trust Multiplier</div></div>',
    'P3 KPIs'
)

# ===== GAP ANALYSIS TABLE =====
html = rep(html,
    '<td>Social currency (P1), health (P2), uniqueness/story (P3)</td>',
    '<td>Hygiene + value (P1 students), speed + hygiene (P2 employees), trust + family-safety (P3 families)</td>',
    'Gap table motivation'
)

html = rep(html,
    '<td>TikTok (P1), Google Maps (P2), YouTube (P3)</td>',
    '<td>Instagram/TikTok (P1 students), WhatsApp/Instagram (P2 professionals), WhatsApp/Facebook (P3 families)</td>',
    'Gap table channels'
)

html = rep(html,
    '<td>3×/week (P1), 1×/week (P2), 2×/month (P3)</td>',
    '<td>3–4×/week (P1 students), 2×/week (P2 employees), 2×/month (P3 family)</td>',
    'Gap table frequency'
)

html = rep(html,
    '<td>Social currency (P1), health (P2), uniqueness/story (P3)</td>\n                <td><span class="gap major">Over-simplified</span></td>\n                <td>Multi-motive messaging strategy</td>',
    '<td>Hygiene+value (P1), speed+hygiene (P2), trust+family-safety (P3)</td>\n                <td><span class="gap major">Over-simplified</span></td>\n                <td>Persona-specific messaging: combo deals, WhatsApp location, family packs</td>',
    'Gap table motivation + action'
)

html = rep(html,
    '<td>Trendy (P1), Professional (P2), Storytelling (P3)</td>',
    '<td>Casual/trendy (P1 student), Reliable/concise (P2 professional), Trustworthy/warm (P3 family)</td>',
    'Gap table tone'
)

# ===== KEY INSIGHTS CARDS =====
html = rep(html,
    'A single marketing message serves none of the three personas optimally. AI revealed 3 distinct value propositions: affordability+trends (P1), quality+health (P2), uniqueness+story (P3).',
    'A single message serves none of our three segments optimally. Assignment 1 research shows: students want hygiene + value (Rs. 300–500), professionals want speed + consistency, families want trust + safety.',
    'Insight 1'
)

html = rep(html,
    'TikTok reaches 92% of Persona 1 but only 22% of Persona 2. Multi-platform approach increases total addressable reach by <strong>145%</strong> vs. Instagram-only strategy.',
    'Instagram/TikTok reaches 92% of students; WhatsApp is #1 for professionals (86%). Assignment 3 uses Meta Ads (Rs. 14,000) + nano-influencer (Rs. 5,000) + campus sampling (Rs. 7,500) for multi-platform reach.',
    'Insight 2'
)

html = rep(html,
    'One Bilal visit generates Rs. 15,000 equivalent marketing value. Blogger outreach delivers <strong>8× better ROI</strong> than paid social ads — highest return per rupee.',
    'Our Assignment 3 nano-influencer (3K–8K followers, Lahore food niche) drives authentic UGC at Rs. 5,000 — generating estimated 2,000+ impressions vs. Rs. 14,000 Meta Ads target of 3,000. Best ROI per rupee spent.',
    'Insight 3'
)

# ===== TESTIMONIALS - Update to Zing & Zest context =====
html = rep(html,
    '"Best food truck in Lahore! Ordered the spicy fusion bowl and it was absolutely incredible. Worth every rupee."',
    '"Best food truck near UCP! Ordered the Student Combo — Classic Burger + Fries + Drink for Rs. 380. Absolutely worth it!"',
    'Testimonial 1'
)

html = rep(html,
    '"The AI-powered personalization actually works. Got a recommendation for the Chili Cheese Burst Wrap and it\'s now my weekly staple."',
    '"The Zesty Chicken Shawarma is the best shawarma I\'ve had near campus. Hygiene is visibly maintained — love it!"',
    'Testimonial 2'
)

html = rep(html,
    '"Location tracking feature saved me 20 minutes. Knew exactly where the truck would be during my lunch break!"',
    '"WhatsApp location update at 12 PM is so helpful. I know exactly where the truck is at Gulberg — saved my lunch break!"',
    'Testimonial 3'
)

html = rep(html,
    '"Finally a food truck that understands students! The combo deal fits perfectly within my monthly budget."',
    '"Finally a food truck that understands students! The Student Combo at Rs. 380 fits perfectly in my budget. 10/10!"',
    'Testimonial 4'
)

html = rep(html,
    '"Brought my team for lunch and everyone loved it. The corporate order system worked perfectly for 15 people."',
    '"Brought my whole family on Saturday evening. The Friends Combo fed 4 of us for Rs. 1,200 — amazing value!"',
    'Testimonial 5'
)

html = rep(html,
    '"The loyalty rewards program is genius. Already earned 2 free meals in my first month of regular visits!"',
    '"Zing Loyalty Card — 5th visit is free! Already earned my first free meal. Quality stays consistent every time."',
    'Testimonial 6'
)

html = rep(html,
    '"Hygiene standards are impeccable. As a health-conscious professional, this level of food safety commitment earns my loyalty."',
    '"As an office worker, hygiene matters most. Zing &amp; Zest\'s setup is visibly clean — gloves, covered prep. My go-to!"',
    'Testimonial 7'
)

html = rep(html,
    '"The brand\'s social media content made me drive across Lahore to try it. And it delivered beyond expectations!"',
    '"Saw the #ZingAndZest reel on TikTok, drove to UCP Main Gate to try it. The Smoky Grill Burger exceeded expectations!"',
    'Testimonial 8'
)

# ===== FOOTER LOGO - replace tagline =====
html = rep(html,
    'Where Every Bite Tells a Story',
    'Fresh. Fast. Full of Flavor.',
    'Footer tagline'
)

# ===== CHATBOT name updates =====
html = rep(html,
    'Hello! I\'m <strong>ZestBot</strong>',
    'Hello! I\'m <strong>ZestBot 🌟</strong>',
    'Chatbot greeting'
)

# ===== Update chatbot menu items in Part 4 =====
# Look for chatbot-specific content
if 'What\'s today\'s special?' in html:
    html = rep(html,
        'What\'s today\'s special?',
        'Show me the menu',
        'Chatbot prompt 1'
    )

print(f'\nTotal changes: {changes}')

with open(base + r'\index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Content saved OK')
