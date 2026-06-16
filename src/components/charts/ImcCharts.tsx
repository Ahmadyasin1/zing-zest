'use client';

import { Doughnut, Bar } from 'react-chartjs-2';
import { ZZ, CHART_COLORS as C } from '@/lib/data/zz';
import { GlassCard } from '@/components/ui/primitives';

export function ImcCharts() {
  const b = ZZ.imc.budget;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard>
        <h3 className="mb-3 text-sm font-semibold text-muted">Budget Composition</h3>
        <Doughnut
          data={{
            labels: b.map((x) => x.line),
            datasets: [{ data: b.map((x) => x.amount), backgroundColor: [C.orange, C.teal, C.amber, C.sky, C.rose, C.violet, '#64748b', '#94a3b8', '#cbd5e1'], borderWidth: 0 }],
          }}
          options={{ cutout: '55%', plugins: { legend: { position: 'bottom', labels: { font: { size: 9 }, boxWidth: 10 } } } }}
        />
      </GlassCard>
      <GlassCard>
        <h3 className="mb-3 text-sm font-semibold text-muted">AIDA Funnel</h3>
        <Bar
          data={{
            labels: ZZ.imc.aida.map((a) => a.stage),
            datasets: [{ data: ZZ.imc.aida.map((a) => a.value), backgroundColor: [C.orange, C.teal, C.amber, C.rose], borderRadius: 8 }],
          }}
          options={{ indexAxis: 'y' as const, plugins: { legend: { display: false } } }}
        />
      </GlassCard>
    </div>
  );
}
