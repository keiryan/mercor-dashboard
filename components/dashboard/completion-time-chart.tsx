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
import { getWeeklyCompletionTimes } from '@/lib/time-utils';
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

interface CompletionTimeChartProps {
  tasks: TaskRecord[];
}

export function CompletionTimeChart({ tasks }: CompletionTimeChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const weeklyData = getWeeklyCompletionTimes(tasks);

  const data = {
    labels: weeklyData.map(d => d.week),
    datasets: [
      {
        label: 'Average Completion Time (minutes)',
        data: weeklyData.map(d => d.avgTime),
        borderColor: getChartColors(0).border,
        backgroundColor: getChartColors(0).background,
        tension: 0.4,
      },
      {
        label: 'Tasks Completed',
        data: weeklyData.map(d => d.taskCount),
        borderColor: getChartColors(1).border,
        backgroundColor: getChartColors(1).background,
        tension: 0.4,
      }
    ],
  };

  const options = getLineChartOptions(isDark);

  if (tasks.length === 0) {
    return (
      <ChartCard title="Weekly Completion Times" index={3}>
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No task data available</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Weekly Completion Times" index={3}>
      <Line options={options} data={data} />
    </ChartCard>
  );
}