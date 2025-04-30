import { use } from 'react';
import EditPenForm from './EditPenForm';

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = use(params as unknown as Promise<{ id: string }>);
  return <EditPenForm penId={id} />;
}
