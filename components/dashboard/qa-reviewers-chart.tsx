'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import type { TaskRecord } from '@/lib/airtable';
import { getChartColors } from '@/lib/chart-utils';
import { ChartCard } from '@/components/ui/chart-card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface QAReviewersChartProps {
  tasks: TaskRecord[];
}

export function QAReviewersChart({ tasks }: QAReviewersChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const reviewerStats = tasks.reduce((acc, task) => {
    if (task.fields['[1] Attempt Status'] === 'Done' && 
        task.fields['[1] Reviewer #1']?.name) {
      const reviewer = task.fields['[1] Reviewer #1'].name;
      const stats = acc.get(reviewer) || { total: 0, passed: 0 };
      stats.total++;
      if (task.fields['[1] Revewer #1 Outcome'] === 'Passed') {
        stats.passed++;
      }
      acc.set(reviewer, stats);
    }
    return acc;
  }, new Map<string, { total: number; passed: number }>());

  // Sort reviewers by total reviews
  const sortedReviewers = Array.from(reviewerStats.entries())
    .sort(([, a], [, b]) => b.total - a.total);

  const data = {
    labels: sortedReviewers.map(([name]) => name),
    datasets: [
      {
        label: 'Total Reviews',
        data: sortedReviewers.map(([, stats]) => stats.total),
        backgroundColor: getChartColors(0).background,
        borderColor: getChartColors(0).border,
        borderWidth: 1,
      },
      {
        label: 'Passed Reviews',
        data: sortedReviewers.map(([, stats]) => stats.passed),
        backgroundColor: getChartColors(1).background,
        borderColor: getChartColors(1).border,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#fff' : '#000',
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
            const reviewer = sortedReviewers[context.dataIndex][0];
            const stats = reviewerStats.get(reviewer)!;
            const percentage = ((value / stats.total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#fff' : '#000',
          callback: function(value: any) {
            const name = sortedReviewers[value][0];
            return name.split(' ')[0];
          }
        }
      },
      y: {
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
    },
  };

  if (tasks.length === 0) {
    return (
      <ChartCard title="QA Reviewer Performance" index={4}>
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No QA data available</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard 
      title="QA Reviewer Performance" 
      index={4}
      footer="Showing QA reviewer statistics with pass rates"
    >
      <Bar options={options} data={data} />
    </ChartCard>
  );
}