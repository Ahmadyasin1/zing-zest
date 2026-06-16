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

# Update testimonial 1 (student - Korean-Desi reference is wrong)
html = rep(html,
    '"Found Zing &amp; Zest Street Bites on TikTok and literally came the next day. Korean-Desi burger at Rs. 280 is unbeatable. The chatbot even remembered my last order — this is next level!"',
    '"Found Zing &amp; Zest on TikTok via #UCPEats and came to UCP Main Gate the very next day. The Student Combo (Rs. 380) is perfect for my budget — Classic Burger + Fries + Drink. Will never eat at the canteen again!"',
    'Testimonial 1'
)

# Update testimonial 2 (professional - already good about pre-order)
html = rep(html,
    '"I pre-order via WhatsApp at 12:15 PM every day — food ready at 12:30 PM sharp. No queue, no stress.',
    '"WhatsApp location pin at 12 PM tells me exactly where they are. Wrap Combo Rs. 350 — ready in 5 min. No queue, no stress.',
    'Testimonial 2'
)

# Update testimonial 3 (food blogger - update to family/trust angle)
html = rep(html,
    '"Reviewed 200+ Lahore spots this year. Zing &amp; Zest Street Bites is the only food truck using AI',
    '"Brought the family to Liberty Market on Saturday. The Friends Combo (Rs. 1,200) was great value for 4 people. Kids loved the Zesty Chicken Shawarma — and the packaging was so hygienic!',
    'Testimonial 3'
)

# Update testimonial 4 (chatbot recommendation - update to real menu)
html = rep(html,
    '"The chatbot recommended a new combo I\'d never tried. It was perfect. They know my taste better than',
    '"ZestBot on WhatsApp told me the Smoky Grill Burger (Rs. 380) matches my order history. Tried it — absolutely perfect. Hygiene is top-tier.',
    'Testimonial 4'
)

# Find the footer "Where Every Bite"
html = rep(html,
    'Where Every Bite Tells a Story',
    'Fresh. Fast. Full of Flavor.',
    'Brand tagline in footer'
)

# Also look for the brand tagline badge on cover
html = rep(html,
    '"Where Every Bite Tells a Story"',
    '"Fresh. Fast. Full of Flavor."',
    'Cover tagline badge'
)

# Update chatbot avatar emoji
html = rep(html,
    '<div class="chat-avatar">🌟</div>',
    '<div class="chat-avatar" style="font-size:0;"><img src="zing_zest_logo.png" style="width:36px;height:36px;object-fit:contain;background:#fff;border-radius:50%;"></div>',
    'Chatbot avatar logo'
)

# ===== UPDATE PART 2 scenarios to use real Zing & Zest numbers =====
# Conservative/Base/Optimistic values
html = rep(html,
    'data-scenario="conservative" data-rev="4200000"',
    'data-scenario="conservative" data-rev="4200000"',
    'Scenario conservative attr'  # no-op, just check
)

# ===== COVER STUDENT FORM - Add group member label =====
html = rep(html,
    '<div class="csb-title">📝 Student Information</div>',
    '<div class="csb-title">📝 Group Submission — 5 Members</div>',
    'Student form title'
)

# ===== UPDATE FOOTER BRAND NAME =====
html = rep(html,
    'Zing &amp; Zest Street Bites AI Marketing Dashboard',
    'Zing &amp; Zest Street Bites — Marketing Analytics Dashboard',
    'Footer brand name'
)

print(f'\nTotal changes: {changes}')
with open(base + r'\index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Testimonials and misc content saved OK')
