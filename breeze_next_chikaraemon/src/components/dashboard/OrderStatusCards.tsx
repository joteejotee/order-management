import type { FC } from 'react';
import type { OrderStatusSummary } from '@/types/dashboard';
import { StatsCard } from './StatsCard';

interface OrderStatusCardsProps {
  summary: OrderStatusSummary;
}

export const OrderStatusCards: FC<OrderStatusCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <StatsCard title="未出荷" value={summary.unshipped} />
      <StatsCard title="出荷済" value={summary.shipped} />
    </div>
  );
};
