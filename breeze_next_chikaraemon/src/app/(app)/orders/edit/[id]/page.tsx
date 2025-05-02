import { use } from 'react';
import EditOrderForm from './EditOrderForm';

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = use(params as unknown as Promise<{ id: string }>);
  return <EditOrderForm orderId={id} />;
}
