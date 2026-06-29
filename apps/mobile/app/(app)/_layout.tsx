import { Redirect, Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@indigo-harts/hooks';

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-warm-white">
        <ActivityIndicator size="large" color="#7D9132" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
