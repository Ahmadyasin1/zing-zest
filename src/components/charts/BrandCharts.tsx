'use client';

import { Scatter } from 'react-chartjs-2';
import { ZZ, CHART_COLORS as C, alpha } from '@/lib/data/zz';
import { GlassCard } from '@/components/ui/primitives';

export function BrandCharts() {
  const cats = ZZ.competitors.filter((c) => !('highlight' in c && c.highlight));
  return (
    <GlassCard>
      <h3 className="mb-3 text-sm font-semibold text-muted">Positioning Map</h3>
      <Scatter
        data={{
          datasets: [
            ...cats.map((c) => ({
              label: c.name,
              data: [{ x: c.price, y: c.quality }],
              backgroundColor: alpha(C.amber, 0.7),
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
        }}
        options={{
          plugins: { legend: { position: 'bottom', labels: { font: { size: 9 } } } },
          scales: {
            x: { title: { display: true, text: 'Avg Price (Rs.)' }, min: 100, max: 950 },
            y: { title: { display: true, text: 'Perceived Quality' }, min: 2.5, max: 5 },
          },
        }}
      />
    </GlassCard>
  );
}
