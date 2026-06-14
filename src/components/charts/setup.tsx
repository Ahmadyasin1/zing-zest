'use client';

import {
  Chart as ChartJS,
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  RadarController,
  ScatterController,
  Tooltip,
} from 'chart.js';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useEffect } from 'react';

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  RadarController,
  ScatterController,
  Tooltip,
);

export function ChartProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  useEffect(() => {
    const isDark = theme === 'dark';
    ChartJS.defaults.color = isDark ? '#a8a29e' : '#57534e';
    ChartJS.defaults.borderColor = isDark ? 'rgba(255, 180, 120, 0.08)' : 'rgba(234, 88, 12, 0.1)';
    ChartJS.defaults.font.family = 'var(--font-inter), Inter, system-ui, sans-serif';
    ChartJS.defaults.plugins.legend.labels.usePointStyle = true;
  }, [theme]);
  return <>{children}</>;
}

export { ChartJS };
