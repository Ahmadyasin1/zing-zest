'use client';

import { Radar, Bar } from 'react-chartjs-2';
import { ZZ, CHART_COLORS as C, alpha } from '@/lib/data/zz';
import { GlassCard } from '@/components/ui/primitives';

export function PersonaCharts() {
  const { labels: radarLabels, p1, p2, p3 } = ZZ.personas.radar;
  const labels = [...radarLabels];
  const ch = ZZ.personas.channels;
  const chLabels = [...ch.labels];
  const radarOpts = { scales: { r: { min: 0, max: 100, ticks: { display: false }, pointLabels: { font: { size: 8 } } } } };
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { data: p1, color: C.orange, title: 'Student' },
          { data: p2, color: C.teal, title: 'Professional' },
          { data: p3, color: C.amber, title: 'Explorer' },
        ].map((r) => (
          <GlassCard key={r.title}>
            <h3 className="mb-2 text-sm font-semibold">Behavior Radar - {r.title}</h3>
            <Radar
              data={{ labels, datasets: [{ data: [...r.data], borderColor: r.color, backgroundColor: alpha(r.color, 0.12), borderWidth: 2, pointRadius: 3 }] }}
              options={radarOpts}
            />
          </GlassCard>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold">Channel Preference</h3>
          <Bar
            data={{
              labels: chLabels,
              datasets: [
                { label: 'Student', data: [...ch.p1], backgroundColor: alpha(C.orange, 0.8) },
                { label: 'Professional', data: [...ch.p2], backgroundColor: alpha(C.teal, 0.8) },
                { label: 'Explorer', data: [...ch.p3], backgroundColor: alpha(C.amber, 0.8) },
              ],
            }}
            options={{ scales: { y: { max: 100, ticks: { callback: (v) => v + '%' } } } }}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold">Persona Value Concentration</h3>
          <Bar
            data={{
              labels: ['Student', 'Professional', 'Explorer'],
              datasets: [
                { label: 'Revenue Share %', data: [...ZZ.personas.value.share], backgroundColor: C.orange, yAxisID: 'y' },
                { label: 'AOV (Rs.)', data: [...ZZ.personas.value.aov], backgroundColor: C.teal, yAxisID: 'y1' },
              ],
            }}
            options={{
              scales: {
                y: { position: 'left' as const, max: 70 },
                y1: { position: 'right' as const, grid: { drawOnChartArea: false }, min: 300, max: 600 },
              },
            }}
          />
        </GlassCard>
      </div>
    </div>
  );
}
