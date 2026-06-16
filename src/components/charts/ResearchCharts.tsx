'use client';

import { Doughnut, Bar, PolarArea } from 'react-chartjs-2';
import { ZZ, CHART_COLORS as C } from '@/lib/data/zz';
import { GlassCard } from '@/components/ui/primitives';

export function ResearchCharts() {
  const { respondents, foodPreference, mealTiming, priceBands } = ZZ.research;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <GlassCard>
        <h3 className="mb-3 text-sm font-semibold text-muted">Interview Sample</h3>
        <Doughnut
          data={{
            labels: ['Students', 'Employees', 'Families'],
            datasets: [{ data: [respondents.students, respondents.employees, respondents.families], backgroundColor: [C.orange, C.teal, C.amber], borderWidth: 0 }],
          }}
          options={{ cutout: '58%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }}
        />
      </GlassCard>
      <GlassCard>
        <h3 className="mb-3 text-sm font-semibold text-muted">Food Preference</h3>
        <Bar
          data={{
            labels: foodPreference.map((f) => f.item),
            datasets: [{ data: foodPreference.map((f) => f.pct), backgroundColor: [C.orange, C.teal, C.amber, C.sky], borderRadius: 6 }],
          }}
          options={{ plugins: { legend: { display: false } }, scales: { y: { max: 50, ticks: { callback: (v) => v + '%' } } } }}
        />
      </GlassCard>
      <GlassCard>
        <h3 className="mb-3 text-sm font-semibold text-muted">Meal Timing</h3>
        <PolarArea
          data={{
            labels: mealTiming.map((m) => m.window),
            datasets: [{ data: mealTiming.map((m) => m.pct), backgroundColor: [`${C.orange}bf`, `${C.teal}bf`, `${C.amber}bf`] }],
          }}
          options={{ plugins: { legend: { position: 'bottom', labels: { font: { size: 9 } } } } }}
        />
      </GlassCard>
      <GlassCard>
        <h3 className="mb-3 text-sm font-semibold text-muted">Price Sensitivity</h3>
        <Doughnut
          data={{
            labels: priceBands.map((p) => p.label),
            datasets: [{ data: priceBands.map((p) => p.pct), backgroundColor: [C.teal, C.orange, C.amber, C.rose], borderWidth: 0 }],
          }}
          options={{ cutout: '45%', plugins: { legend: { position: 'bottom', labels: { font: { size: 9 } } } } }}
        />
      </GlassCard>
    </div>
  );
}
