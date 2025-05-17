'use client';

import type { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface SalesBarChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

export const SalesBarChart: FC<SalesBarChartProps> = ({
  labels,
  data,
  title,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title ?? '売上',
        data,
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  } as const;

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm h-full">
      {title && (
        <h3 className="text-base font-semibold mb-4 text-gray-800">{title}</h3>
      )}
      <Bar data={chartData} options={options} />
    </div>
  );
};
