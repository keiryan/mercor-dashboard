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

interface TodayTaskChartProps {
  tasks: TaskRecord[];
}

export function TodayTaskChart({ tasks }: TodayTaskChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = (() => {
    const annotatorTasks = tasks.reduce((acc, task) => {
      if (task.fields['[1] Assigned To']?.name && 
          task.fields['[1] Attempt Status'] === 'Done') {
        const annotator = task.fields['[1] Assigned To']!.name;
        acc.set(annotator, (acc.get(annotator) || 0) + 1);
      }
      return acc;
    }, new Map<string, number>());

    const sortedAnnotators = Array.from(annotatorTasks.entries())
      .sort(([, a], [, b]) => b - a);

    const labels = sortedAnnotators.map(([name]) => name);
    const data = sortedAnnotators.map(([, count]) => count);
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
      <ChartCard title="Total Tasks Distribution by Annotator" index={0}>
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No task data available</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Total Tasks Distribution by Annotator" index={0}>
      <Pie options={getPieChartOptions(isDark)} data={chartData} />
    </ChartCard>
  );
}