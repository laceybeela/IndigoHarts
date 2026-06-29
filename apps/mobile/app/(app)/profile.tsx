import { View, Text } from 'react-native';
import { useAuth } from '@indigo-harts/hooks';
import { ScreenHeader, Card, Button } from '@/components/ui';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // Auth state change will handle redirect
    }
  };

  return (
    <View className="flex-1 bg-warm-white">
      <ScreenHeader title="Profile" showBack />
      <View className="p-4">
        <Card>
          <View className="items-center py-4">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-sage-100">
              <Text className="text-3xl">👤</Text>
            </View>
            <Text className="font-poppins-bold text-xl text-gray-900">
              {user?.name ?? 'Employee'}
            </Text>
            <Text className="mt-1 font-poppins-regular text-sm text-gray-500">
              {user?.email}
            </Text>
            {user?.phone && (
              <Text className="mt-0.5 font-poppins-regular text-sm text-gray-500">
                {user.phone}
              </Text>
            )}
          </View>
        </Card>

        <View className="mt-6">
          <Button
            title="Sign Out"
            variant="danger"
            onPress={handleSignOut}
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}
