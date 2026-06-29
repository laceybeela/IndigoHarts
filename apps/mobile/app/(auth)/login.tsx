import { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@indigo-harts/hooks';
import { Button, Card, Input } from '@/components/ui';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-warm-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Branding */}
        <View className="mb-10 items-center">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-sage-100">
            <Text className="text-3xl">🌿</Text>
          </View>
          <Text className="font-poppins-bold text-3xl text-sage-700">
            Indigo Harts
          </Text>
          <Text className="mt-1 font-poppins-regular text-base text-gray-500">
            Employee Portal
          </Text>
        </View>

        {/* Login Form */}
        <Card className="gap-4">
          {error ? (
            <View className="rounded-[12px] bg-red-50 px-4 py-3">
              <Text className="font-poppins-medium text-sm text-red-600">
                {error}
              </Text>
            </View>
          ) : null}

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />

          <View>
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textContentType="password"
              autoComplete="password"
              onSubmitEditing={handleSignIn}
            />
            <Pressable
              className="absolute bottom-3 right-3"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text className="font-poppins-medium text-sm text-sage-600">
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          </View>

          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            fullWidth
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
