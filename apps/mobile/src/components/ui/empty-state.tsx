import { View, Text } from 'react-native';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}

export function EmptyState({ icon = '📋', title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-5xl">{icon}</Text>
      <Text className="mt-4 font-poppins-semibold text-lg text-gray-800">
        {title}
      </Text>
      {message && (
        <Text className="mt-2 text-center font-poppins-regular text-sm text-gray-500">
          {message}
        </Text>
      )}
    </View>
  );
}
