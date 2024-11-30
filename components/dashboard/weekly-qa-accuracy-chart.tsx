'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import type { TaskRecord } from '@/lib/airtable';
import { getChartColors, getLineChartOptions } from '@/lib/chart-utils';
import { getWeeklyQAAccuracy } from '@/lib/qa-utils';
import { ChartCard } from '@/components/ui/chart-card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeeklyQAAccuracyChartProps {
  tasks: TaskRecord[];
}

export function WeeklyQAAccuracyChart({ tasks }: WeeklyQAAccuracyChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const weeklyData = getWeeklyQAAccuracy(tasks);

  const data = {
    labels: weeklyData.map(d => d.week),
    datasets: [
      {
        label: 'Perfect Rating (%)',
        data: weeklyData.map(d => d.perfectRate),
        borderColor: getChartColors(0).border,
        backgroundColor: getChartColors(0).background,
        tension: 0.4,
        yAxisID: 'y',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Tasks Reviewed',
        data: weeklyData.map(d => d.total),
        borderColor: getChartColors(1).border,
        backgroundColor: getChartColors(1).background,
        tension: 0.4,
        yAxisID: 'y1',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#fff' : '#000',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (context.dataset.yAxisID === 'y') {
              const weekData = weeklyData[context.dataIndex];
              return [
                `${label}: ${value}%`,
                `Perfect Reviews: ${weekData.perfect} of ${weekData.total} tasks`
              ];
            }
            return `${label}: ${value} tasks`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          display: true,
        },
        border: {
          color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        },
        ticks: {
          color: isDark ? '#fff' : '#000',
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Perfect Rating (%)',
          color: isDark ? '#fff' : '#000',
          font: {
            size: 12,
          },
          padding: { bottom: 10 },
        },
        min: 0,
        max: 100,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          display: true,
        },
        border: {
          color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        },
        ticks: {
          color: isDark ? '#fff' : '#000',
          padding: 8,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Tasks Reviewed',
          color: isDark ? '#fff' : '#000',
          font: {
            size: 12,
          },
          padding: { bottom: 10 },
        },
        min: 0,
        grid: {
          display: false,
        },
        border: {
          color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        },
        ticks: {
          color: isDark ? '#fff' : '#000',
          padding: 8,
        },
      },
    },
  };

  if (tasks.length === 0) {
    return (
      <ChartCard title="Weekly Perfect Rating Trends" index={5}>
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No QA data available</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard 
      title="Weekly Perfect Rating Trends" 
      index={5}
      footer="Tracking perfect QA ratings over time"
    >
      <Line options={options} data={data} />
    </ChartCard>
  );
}