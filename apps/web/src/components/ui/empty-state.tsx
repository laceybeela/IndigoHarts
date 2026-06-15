import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 text-gray-300">
        {icon || <Inbox className="h-12 w-12" />}
      </div>
      <p className="mb-4 text-sm text-gray-500">{message}</p>
      {action}
    </div>
  );
}
