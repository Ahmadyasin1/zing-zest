'use client';

import dynamic from 'next/dynamic';
import { ChartProvider } from './setup';

const ResearchCharts = dynamic(() => import('./ResearchCharts').then((m) => m.ResearchCharts), { ssr: false });
const BrandCharts = dynamic(() => import('./BrandCharts').then((m) => m.BrandCharts), { ssr: false });
const ImcCharts = dynamic(() => import('./ImcCharts').then((m) => m.ImcCharts), { ssr: false });
const PersonaCharts = dynamic(() => import('./PersonaCharts').then((m) => m.PersonaCharts), { ssr: false });
const ForecastCharts = dynamic(() => import('./ForecastCharts').then((m) => m.ForecastCharts), { ssr: false });
const CompetitiveCharts = dynamic(() => import('./CompetitiveCharts').then((m) => m.CompetitiveCharts), { ssr: false });
const AutomationCharts = dynamic(() => import('./AutomationCharts').then((m) => m.AutomationCharts), { ssr: false });
const CrisisCharts = dynamic(() => import('./CrisisCharts').then((m) => m.CrisisCharts), { ssr: false });

export function ChartSection({ name }: { name: string }) {
  return (
    <ChartProvider>
      {name === 'research' && <ResearchCharts />}
      {name === 'brand' && <BrandCharts />}
      {name === 'imc' && <ImcCharts />}
      {name === 'persona' && <PersonaCharts />}
      {name === 'forecast' && <ForecastCharts />}
      {name === 'competitive' && <CompetitiveCharts />}
      {name === 'automation' && <AutomationCharts />}
      {name === 'crisis' && <CrisisCharts />}
    </ChartProvider>
  );
}
