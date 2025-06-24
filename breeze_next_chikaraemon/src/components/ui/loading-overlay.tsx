'use client';

import { Spinner } from './spinner';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({
  message = 'ページを読み込み中...',
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" className="text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}
