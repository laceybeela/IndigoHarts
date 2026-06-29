import { View, Text } from 'react-native';
import { JobStatus } from '@indigo-harts/types';

interface StatusBadgeProps {
  status: JobStatus | string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  [JobStatus.Assigned]: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    label: 'Assigned',
  },
  [JobStatus.Accepted]: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    label: 'Accepted',
  },
  [JobStatus.InProgress]: {
    bg: 'bg-sage-100',
    text: 'text-sage-700',
    label: 'In Progress',
  },
  [JobStatus.Completed]: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'Completed',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    label: status,
  };

  return (
    <View className={`self-start rounded-full px-3 py-1 ${config.bg}`}>
      <Text className={`font-poppins-medium text-xs ${config.text}`}>
        {config.label}
      </Text>
    </View>
  );
}
