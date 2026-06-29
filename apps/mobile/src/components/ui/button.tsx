import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string; spinner: string }> = {
  primary: {
    container: 'bg-sage-600 active:bg-sage-700',
    text: 'text-white',
    spinner: '#FFFFFF',
  },
  secondary: {
    container: 'bg-white border border-sage-300 active:bg-sage-50',
    text: 'text-sage-700',
    spinner: '#6B7F3A',
  },
  danger: {
    container: 'bg-red-500 active:bg-red-600',
    text: 'text-white',
    spinner: '#FFFFFF',
  },
  ghost: {
    container: 'bg-transparent active:bg-gray-100',
    text: 'text-sage-700',
    spinner: '#6B7F3A',
  },
  accent: {
    container: 'bg-floral-400 active:bg-floral-500',
    text: 'text-white',
    spinner: '#FFFFFF',
  },
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`flex-row items-center justify-center rounded-[12px] px-6 py-3.5 ${styles.container} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : ''}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={styles.spinner} />
      ) : (
        <Text className={`font-poppins-semibold text-base ${styles.text}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
