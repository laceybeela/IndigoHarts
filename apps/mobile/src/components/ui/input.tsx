import { View, Text, TextInput, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="gap-1.5">
      {label && (
        <Text className="font-poppins-medium text-sm text-gray-700">
          {label}
        </Text>
      )}
      <TextInput
        className={`rounded-[12px] border bg-white px-4 py-3 font-poppins-regular text-base text-gray-900 ${
          error ? 'border-red-400' : 'border-gray-200'
        }`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="font-poppins-regular text-xs text-red-500">
          {error}
        </Text>
      )}
    </View>
  );
}
