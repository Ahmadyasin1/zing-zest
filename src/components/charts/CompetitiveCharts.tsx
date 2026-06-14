'use client';

import { Radar, Bar, Bubble, Doughnut } from 'react-chartjs-2';
import { CHART_COLORS as C, alpha } from '@/lib/data/zz';
import { GlassCard } from '@/components/ui/primitives';

export function CompetitiveCharts() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { v: '5', l: 'Direct Competitors' },
          { v: '3', l: 'Indirect Competitors' },
          { v: 'Rs. 280', l: 'Market Avg Price' },
          { v: '4.6★', l: 'Target Rating' },
          { v: 'Rs. 380', l: 'Our Avg Price' },
        ].map((k) => (
          <GlassCard key={k.l} className="text-center">
            <p className="text-xl font-bold text-orange-400">{k.v}</p>
            <p className="text-[0.65rem] text-stone-500">{k.l}</p>
          </GlassCard>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold">Competitor Capability Radar</h3>
          <Radar
            data={{
              labels: ['Brand', 'Price-Value', 'Quality', 'Hygiene', 'Digital', 'Speed', 'Loyalty'],
              datasets: [
                { label: 'Zing & Zest', data: [72, 90, 85, 95, 88, 82, 80], borderColor: C.orange, backgroundColor: alpha(C.orange, 0.12), borderWidth: 2 },
                { label: 'Campus Canteen', data: [35, 82, 45, 40, 20, 60, 15], borderColor: C.rose, backgroundColor: alpha(C.rose, 0.06), borderWidth: 1.5 },
                { label: 'Standard Outlets', data: [88, 45, 85, 80, 82, 72, 65], borderColor: C.amber, borderDash: [4, 4], backgroundColor: 'transparent', borderWidth: 1.5 },
              ],
            }}
            options={{ scales: { r: { min: 0, max: 100, ticks: { display: false } } } }}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold">Position Benchmark</h3>
          <Bubble
            data={{
              datasets: [
                { label: 'Campus Canteen', data: [{ x: 200, y: 3.2, r: 10 }], backgroundColor: alpha(C.rose, 0.7) },
                { label: 'Local Stalls', data: [{ x: 175, y: 3.4, r: 12 }], backgroundColor: alpha(C.amber, 0.7) },
                { label: 'Burger Outlets', data: [{ x: 450, y: 4.2, r: 14 }], backgroundColor: alpha(C.sky, 0.7) },
                { label: 'Premium Cafés', data: [{ x: 850, y: 4.5, r: 16 }], backgroundColor: alpha(C.violet, 0.7) },
                { label: 'Zing & Zest', data: [{ x: 380, y: 4.6, r: 18 }], backgroundColor: C.orange, borderColor: '#fff', borderWidth: 2 },
              ],
            }}
            options={{
              scales: {
                x: { title: { display: true, text: 'Price (Rs.)' }, min: 100, max: 950 },
                y: { title: { display: true, text: 'Google Rating' }, min: 3, max: 5 },
              },
            }}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold">Social Presence Index</h3>
          <Bar
            data={{
              labels: ['Campus Canteen', 'Local Stalls', 'Burger Outlets', 'Premium Cafés', 'Zing & Zest (Target)'],
              datasets: [{ data: [8000, 42000, 35000, 28000, 50000], backgroundColor: [alpha(C.rose, 0.7), alpha(C.amber, 0.7), alpha(C.sky, 0.7), alpha(C.violet, 0.7), C.orange], borderRadius: 6 }],
            }}
            options={{ indexAxis: 'y' as const, plugins: { legend: { display: false } } }}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold">Sentiment Distribution</h3>
          <Doughnut
            data={{
              labels: ['Positive (4–5★)', 'Neutral (3★)', 'Negative (1–2★)'],
              datasets: [{ data: [74, 18, 8], backgroundColor: [C.teal, C.amber, C.rose], borderWidth: 0 }],
            }}
            options={{ cutout: '62%' }}
          />
        </GlassCard>
      </div>
    </div>
  );
}
