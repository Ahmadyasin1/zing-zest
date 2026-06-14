'use client';

import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { ZZ, CHART_COLORS as C, alpha } from '@/lib/data/zz';
import { GlassCard, Btn } from '@/components/ui/primitives';
import { formatRs } from '@/lib/utils';

const dailyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dailyCust = [62, 68, 71, 74, 78, 100, 43];
const dailyRev = dailyCust.map((c) => c * 380);

export function ForecastCharts() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [scen, setScen] = useState<keyof typeof ZZ.forecast.scenarios>('base');
  const s = ZZ.forecast.scenarios[scen];

  return (
    <div className="space-y-4">
      <GlassCard>
        <div className="mb-4 flex flex-wrap gap-2">
          {(['conservative', 'base', 'optimistic'] as const).map((k) => (
            <Btn key={k} variant={scen === k ? 'primary' : 'secondary'} onClick={() => setScen(k)}>
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </Btn>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { l: 'Year-1 Revenue', v: formatRs(s.rev) },
            { l: 'Break-even', v: `Month ${s.be}` },
            { l: 'Avg Customers/mo', v: s.cust.toLocaleString() },
            { l: 'Net Margin', v: `${s.npm}%` },
            { l: 'MoM Growth', v: `${s.mom}%` },
          ].map((k) => (
            <div key={k.l} className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-lg font-bold text-orange-400">{k.v}</p>
              <p className="text-[0.65rem] uppercase text-stone-500">{k.l}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="mb-4 flex gap-2">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <Btn key={p} variant={period === p ? 'primary' : 'ghost'} onClick={() => setPeriod(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Btn>
          ))}
        </div>
        {period === 'daily' && (
          <Bar
            data={{
              labels: dailyLabels,
              datasets: [
                { label: 'Customers', data: dailyCust, backgroundColor: alpha(C.orange, 0.85), borderRadius: 6 },
                { type: 'line', label: 'Revenue', data: dailyRev, borderColor: C.teal, yAxisID: 'y1', tension: 0.4 } as never,
              ],
            }}
            options={{ scales: { y1: { position: 'right' as const, grid: { drawOnChartArea: false } } } }}
          />
        )}
        {period === 'weekly' && (
          <Line
            data={{
              labels: Array.from({ length: 12 }, (_, i) => `W${i + 1}`),
              datasets: [{ label: 'Weekly Revenue (Rs.)', data: [214000, 245000, 280000, 310000, 340000, 365000, 390000, 410000, 430000, 455000, 475000, 490000], borderColor: C.teal, backgroundColor: alpha(C.teal, 0.1), fill: true, tension: 0.4 }],
            }}
          />
        )}
        {period === 'monthly' && (
          <Bar
            data={{
              labels: ZZ.forecast.monthly.map((m) => m.m.split(' ')[0]),
              datasets: [{ label: 'Revenue', data: ZZ.forecast.monthly.map((m) => m.rev), backgroundColor: ZZ.forecast.monthly.map((m) => (m.g < 0 ? C.rose : C.orange)), borderRadius: 6 }],
            }}
            options={{ scales: { y: { ticks: { callback: (v) => 'Rs.' + Number(v) / 1000 + 'K' } } } }}
          />
        )}
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold">Break-even Analysis</h3>
          <Line
            data={{
              labels: ['0', '100', '200', '359', '500', '700'],
              datasets: [
                { label: 'Total Cost', data: [85000, 99500, 114000, 137055, 157500, 186500], borderColor: C.rose, tension: 0.3 },
                { label: 'Revenue', data: [0, 38000, 76000, 136420, 190000, 266000], borderColor: C.teal, tension: 0.3 },
              ],
            }}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold">Three-Year Trajectory</h3>
          <Bar
            data={{
              labels: ZZ.forecast.threeYear.map((y) => y.year),
              datasets: [
                { label: 'Revenue', data: ZZ.forecast.threeYear.map((y) => y.rev), backgroundColor: C.orange, borderRadius: 8 },
                { type: 'line', label: 'Margin %', data: ZZ.forecast.threeYear.map((y) => y.margin), borderColor: C.teal, yAxisID: 'y1' } as never,
              ],
            }}
            options={{
              scales: {
                y: { ticks: { callback: (v) => 'Rs.' + Number(v) / 1e6 + 'M' } },
                y1: { position: 'right' as const, min: 15, max: 40, grid: { drawOnChartArea: false } },
              },
            }}
          />
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="mb-3 text-sm font-semibold">Monthly Forecast Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-500">
                <th className="p-2">Month</th><th className="p-2">Customers</th><th className="p-2">Revenue</th><th className="p-2">Growth</th><th className="p-2">Note</th><th className="p-2">CI</th>
              </tr>
            </thead>
            <tbody>
              {ZZ.forecast.monthly.map((m) => (
                <tr key={m.m} className="border-b border-white/5">
                  <td className="p-2 font-medium">{m.m}</td>
                  <td className="p-2">{m.c.toLocaleString()}</td>
                  <td className="p-2 text-orange-400">{formatRs(m.rev)}</td>
                  <td className={`p-2 ${m.g >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>{m.g >= 0 ? '+' : ''}{m.g}%</td>
                  <td className="p-2 text-stone-400">{m.s}</td>
                  <td className="p-2 text-teal-400">±{m.ci}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
