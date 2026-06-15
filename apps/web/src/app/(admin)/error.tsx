'use client';

import { Button } from '@/components/ui/button';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="mb-2 text-xl font-bold text-gray-900">
        Something went wrong
      </h2>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
