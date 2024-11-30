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

interface TaskChartProps {
  tasks: TaskRecord[];
}

export function TaskChart({ tasks }: TaskChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Process data to get total tasks per annotator
  const annotatorTasks = tasks.reduce((acc, task) => {
    if (task.fields['[1] Assigned To']?.name && 
        task.fields['[1] Attempt Status'] === 'Done') {
      const annotator = task.fields['[1] Assigned To'].name;
      acc.set(annotator, (acc.get(annotator) || 0) + 1);
    }
    return acc;
  }, new Map<string, number>());

  // Sort annotators by task count
  const sortedAnnotators = Array.from(annotatorTasks.entries())
    .sort(([, a], [, b]) => b - a);

  const data = {
    labels: sortedAnnotators.map(([name]) => name),
    datasets: [{
      label: 'Tasks Completed',
      data: sortedAnnotators.map(([, count]) => count),
      borderColor: getChartColors(0).border,
      backgroundColor: getChartColors(0).background,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      borderWidth: 2,
    }],
  };

  const options = {
    ...getLineChartOptions(isDark),
    scales: {
      ...getLineChartOptions(isDark).scales,
      x: {
        ...getLineChartOptions(isDark).scales?.x,
        ticks: {
          display: false,
        },
        title: {
          display: true,
          text: 'Annotators',
          color: isDark ? '#fff' : '#000',
          font: {
            size: 14,
          },
        },
      },
    },
  };

  if (tasks.length === 0) {
    return (
      <ChartCard title="Task Distribution" index={1}>
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No task data available</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard 
      title="Task Distribution" 
      index={1}
      footer="Hover over points to see annotator details"
    >
      <Line options={options} data={data} />
    </ChartCard>
  );
}