import { View, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className = '' }: LoadingSpinnerProps) {
  return (
    <View className={`flex-1 items-center justify-center bg-warm-white ${className}`}>
      <ActivityIndicator size="large" color="#7D9132" />
    </View>
  );
}
