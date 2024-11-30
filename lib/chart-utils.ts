import { ChartOptions } from 'chart.js';

export function getChartColors(index: number): { border: string; background: string } {
  // Using CSS custom properties for consistent theming
  const colors = [
    { border: '#3b82f6', background: 'rgba(59, 130, 246, 0.8)' }, // Blue
    { border: '#10b981', background: 'rgba(16, 185, 129, 0.8)' }, // Green
    { border: '#f59e0b', background: 'rgba(245, 158, 11, 0.8)' }, // Yellow
    { border: '#ef4444', background: 'rgba(239, 68, 68, 0.8)' },  // Red
    { border: '#8b5cf6', background: 'rgba(139, 92, 246, 0.8)' }, // Purple
  ];
  
  return colors[index % colors.length];
}

export function getLineChartOptions(isDark: boolean, showLegend: boolean = true): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    plugins: {
      legend: {
        display: showLegend,
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
        bodyFont: {
          family: 'Inter, system-ui, sans-serif',
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
        },
      },
      y: {
        beginAtZero: true,
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
}

export function getPieChartOptions(isDark: boolean): ChartOptions<'pie'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: isDark ? '#fff' : '#000',
          padding: 20,
          font: {
            size: 12,
          },
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
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value * 100) / total).toFixed(1);
            return `${label}: ${value} tasks (${percentage}%)`;
          },
        },
      },
      title: {
        display: true,
        text: '',
        color: isDark ? '#fff' : '#000',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
  };
}