'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type SearchParamsHandlerProps = {
  setStatus: (status: string | null) => void;
  errors: { [key: string]: string[] };
};

export function SearchParamsHandler({
  setStatus,
  errors,
}: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const reset = searchParams.get('reset');
    if (reset && Object.keys(errors).length === 0) {
      setStatus(atob(reset));
    } else {
      setStatus(null);
    }
  }, [searchParams, errors, setStatus]);

  return null;
}
