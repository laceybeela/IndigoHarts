import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@indigo-harts/hooks';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Redirect href="/(app)/jobs" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
