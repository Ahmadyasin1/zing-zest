'use client';

import { Line, Bar } from 'react-chartjs-2';
import { CHART_COLORS as C, alpha } from '@/lib/data/zz';
import { GlassCard } from '@/components/ui/primitives';

export function CrisisCharts() {
  const labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const forecast = [700000, 760000, 820000, 720000, 780000, 810000, 855000, 900000, 950000];
  const actual = [700000, 760000, 820000, 720000, 780000, 540000, null, null, null];
  const recovery = [null, null, null, null, null, 540000, 594000, 680000, 792000];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard>
        <h3 className="mb-2 text-sm font-semibold">25% Drop Scenario Curve</h3>
        <Line
          data={{
            labels,
            datasets: [
              { label: 'Forecast', data: forecast, borderColor: alpha(C.teal, 0.5), borderDash: [5, 5], pointRadius: 0, tension: 0.4 },
              { label: 'Actual', data: actual, borderColor: C.orange, backgroundColor: alpha(C.orange, 0.08), fill: true, tension: 0.4 },
              { label: 'Recovery Plan', data: recovery, borderColor: C.amber, borderDash: [4, 2], tension: 0.4 },
            ],
          }}
          options={{ scales: { y: { ticks: { callback: (v) => 'Rs.' + Number(v) / 1000 + 'K' } } } }}
        />
      </GlassCard>
      <GlassCard>
        <h3 className="mb-2 text-sm font-semibold">Recovery Trajectory</h3>
        <Bar
          data={{
            labels: ['Month 3 (Crisis)', 'Month 4', 'Month 5', 'Month 6 (Target)'],
            datasets: [
              { label: 'Revenue', data: [540000, 594000, 680000, 792000], backgroundColor: [alpha(C.rose, 0.85), alpha(C.amber, 0.85), alpha(C.sky, 0.85), alpha(C.teal, 0.9)], borderRadius: 8 },
              { type: 'line', label: 'Pre-Crisis Target', data: [720000, 720000, 720000, 720000], borderColor: alpha(C.orange, 0.6), borderDash: [6, 3], pointRadius: 0 } as never,
            ],
          }}
          options={{ scales: { y: { ticks: { callback: (v) => 'Rs.' + Number(v) / 1000 + 'K' } } } }}
        />
      </GlassCard>
    </div>
  );
}
