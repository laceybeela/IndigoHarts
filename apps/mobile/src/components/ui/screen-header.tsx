import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function ScreenHeader({ title, showBack = false, rightAction }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      className="border-b border-gray-100 bg-white px-4 pb-3"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {showBack && (
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
            >
              <Text className="text-xl text-sage-700">←</Text>
            </Pressable>
          )}
          <Text className="font-poppins-bold text-xl text-gray-900">
            {title}
          </Text>
        </View>
        {rightAction && <View>{rightAction}</View>}
      </View>
    </View>
  );
}
