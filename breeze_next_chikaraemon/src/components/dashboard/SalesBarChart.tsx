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
  type Scale,
  type CoreScaleOptions,
  type Tick,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface SalesBarChartProps {
  labels: string[];
  data: number[];
  title?: string;
  color?: 'blue' | 'green' | 'purple';
  stepSize?: number;
}

export const SalesBarChart: FC<SalesBarChartProps> = ({
  labels,
  data,
  title,
  color = 'blue',
  stepSize,
}) => {
  // colorプロパティを使用するが、実際の色は変えない
  const isDefaultColor = color === 'blue';

  const chartData = {
    labels,
    datasets: [
      {
        label: title ?? '売上',
        data,
        backgroundColor: 'rgb(59, 130, 246)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 0,
        borderRadius: 6,
        hoverBackgroundColor: 'rgb(37, 99, 235)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: 'rgba(229, 231, 235, 1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function (context: { parsed: { y: number } }) {
            return `売上: ${context.parsed.y.toLocaleString()}円`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
        ticks: {
          font: {
            size: isDefaultColor ? 11 : 11, // colorを参照しつつ同じ値に
          },
          ...(stepSize && { stepSize }),
          callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: unknown,
            index: number,
            ticks: Tick[],
          ) {
            // インデックスと目盛りの総数を利用
            const maxTicks = ticks.length;
            const isLastTick = index === maxTicks - 1;

            if (typeof tickValue === 'number') {
              return `${tickValue.toLocaleString()}円${isLastTick ? ' ' : ''}`;
            }
            return String(tickValue);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 h-full">
      {title && (
        <h3 className="text-base font-semibold mb-4 text-gray-800">{title}</h3>
      )}
      <div className="h-64 w-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
