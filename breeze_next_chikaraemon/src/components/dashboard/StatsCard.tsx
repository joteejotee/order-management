import type { FC, ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string | ReactNode;
}

export const StatsCard: FC<StatsCardProps> = ({ title, value }) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <span className="text-3xl font-semibold text-gray-900">{value}</span>
    </div>
  );
};
