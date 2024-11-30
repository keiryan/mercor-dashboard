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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ActivityChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#fff' : '#000',
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#fff' : '#000',
        },
      },
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#fff' : '#000',
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Visitors',
        data: [89887, 85000, 88000, 90000, 87000, 92000, 95000, 91000, 88000, 86000, 89000, 90000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'Product Views',
        data: [77908, 75000, 79000, 76000, 78000, 80000, 77000, 75000, 78000, 76000, 77000, 78000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Add to Cart',
        data: [45361, 44000, 46000, 45000, 47000, 46000, 44000, 45000, 46000, 45000, 44000, 45000],
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
      },
    ],
  };

  return (
    <div className="rounded-lg bg-card p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold">Customer Activities</h3>
      <Line options={options} data={data} />
    </div>
  );
}