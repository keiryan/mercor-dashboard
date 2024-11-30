'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import type { TaskRecord } from '@/lib/airtable';
import { getChartColors, getPieChartOptions } from '@/lib/chart-utils';
import { ChartCard } from '@/components/ui/chart-card';

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface QAStatusChartProps {
  tasks: TaskRecord[];
}

export function QAStatusChart({ tasks }: QAStatusChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = (() => {
    const qaStatus = tasks.reduce(
      (acc, task) => {
        if (task.fields['[1] Attempt Status'] === 'Done') {
          const status = task.fields['[1] Revewer #1 Outcome'] || 'Todo';
          acc.set(status, (acc.get(status) || 0) + 1);
        }
        return acc;
      },
      new Map<string, number>()
    );

    const labels = Array.from(qaStatus.keys());
    const data = Array.from(qaStatus.values());
    const colors = labels.map((_, i) => getChartColors(i));

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => c.background),
        borderColor: colors.map(c => c.border),
        borderWidth: 2,
      }]
    };
  })();

  if (tasks.length === 0) {
    return (
      <ChartCard title="QA Status Distribution" index={2}>
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No task data available</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="QA Status Distribution" index={2}>
      <Pie options={getPieChartOptions(isDark)} data={chartData} />
    </ChartCard>
  );
}