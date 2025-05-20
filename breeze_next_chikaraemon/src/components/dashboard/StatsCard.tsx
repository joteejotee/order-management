import type { FC, ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string | ReactNode;
  icon?: ReactNode;
  trend?: number;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'amber';
}

export const StatsCard: FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'blue',
}) => {
  // 色に基づいたテキストカラークラスを取得
  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-500';
      case 'green':
        return 'text-green-500';
      case 'red':
        return 'text-red-500';
      case 'purple':
        return 'text-purple-500';
      case 'amber':
        return 'text-amber-500';
      default:
        return 'text-blue-500';
    }
  };

  // 色に基づいた背景色クラスを取得
  const getBgColorClass = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100';
      case 'green':
        return 'bg-green-100';
      case 'red':
        return 'bg-red-100';
      case 'purple':
        return 'bg-purple-100';
      case 'amber':
        return 'bg-amber-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 h-full relative">
      <div className="flex items-center h-full">
        <div className="flex-1 flex flex-col justify-center space-y-2 pl-0 pr-10 text-center">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {trend !== undefined && (
            <div
              className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        {icon && (
          <div className={`flex items-center justify-center w-24 h-24`}>
            <div
              className={`${getBgColorClass()} rounded-full p-3 flex items-center justify-center w-20 h-20`}
            >
              <div className={getColorClass()}>{icon}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
