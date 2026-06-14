'use client';

import { Bar, Line } from 'react-chartjs-2';
import { CHART_COLORS as C, alpha } from '@/lib/data/zz';
import { GlassCard } from '@/components/ui/primitives';

export function AutomationCharts() {
  const withAI = [45, 52, 58, 63, 67, 70, 72, 73, 74, 75, 75, 76];
  const without = [45, 42, 40, 38, 36, 35, 34, 33, 32, 31, 31, 30];
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard>
        <h3 className="mb-2 text-sm font-semibold">Automation ROI Multiples</h3>
        <Bar
          data={{
            labels: ['WhatsApp Bot', 'Email Auto', 'Loyalty Program', 'Re-engagement', 'Referral'],
            datasets: [{ data: [8.2, 5.4, 12.6, 6.8, 9.4], backgroundColor: [C.orange, C.teal, C.amber, C.sky, C.rose], borderRadius: 8 }],
          }}
          options={{ plugins: { legend: { display: false } } }}
        />
      </GlassCard>
      <GlassCard>
        <h3 className="mb-2 text-sm font-semibold">Retention Curve</h3>
        <Line
          data={{
            labels: Array.from({ length: 12 }, (_, i) => `M${i + 1}`),
            datasets: [
              { label: 'With Automation', data: withAI, borderColor: C.teal, backgroundColor: alpha(C.teal, 0.1), fill: true, tension: 0.4 },
              { label: 'Without', data: without, borderColor: C.rose, borderDash: [5, 5], tension: 0.4 },
            ],
          }}
          options={{ scales: { y: { min: 20, max: 85, ticks: { callback: (v) => v + '%' } } } }}
        />
      </GlassCard>
    </div>
  );
}
