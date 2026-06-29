import { Pressable, View, Text } from 'react-native';

interface ChecklistItemProps {
  taskName: string;
  isCompleted: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}

export function ChecklistItem({
  taskName,
  isCompleted,
  onToggle,
  disabled = false,
}: ChecklistItemProps) {
  return (
    <Pressable
      className={`flex-row items-center gap-3 py-2.5 ${disabled ? 'opacity-60' : ''}`}
      onPress={onToggle}
      disabled={disabled}
    >
      <View
        className={`h-6 w-6 items-center justify-center rounded-md border-2 ${
          isCompleted
            ? 'border-sage-600 bg-sage-600'
            : 'border-gray-300 bg-white'
        }`}
      >
        {isCompleted && (
          <Text className="text-xs font-bold text-white">✓</Text>
        )}
      </View>
      <Text
        className={`flex-1 font-poppins-regular text-base ${
          isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
        }`}
      >
        {taskName}
      </Text>
    </Pressable>
  );
}
