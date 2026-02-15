import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({ email, password });

      if (result.success) {
        router.replace('/(tabs)/products');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-beige">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-10 pb-8">
            {/* Brand hero */}
            <View className="bg-primary rounded-3xl p-6 mb-8 border border-white/10">
              <Text
                className="text-beige text-3xl font-bold tracking-tight"
                style={{ fontFamily: 'SpaceGrotesk-Bold' }}
              >
                Buildex4Syria
              </Text>
              <Text
                className="text-beige/80 text-sm mt-2"
                style={{ fontFamily: 'Manrope-Regular' }}
              >
                Premium design & precise cost estimation for modern builders.
              </Text>
              <View className="flex-row mt-4 space-x-2">
                <View className="bg-beige/15 rounded-full px-3 py-1 border border-beige/20">
                  <Text
                    className="text-beige text-xs font-semibold"
                    style={{ fontFamily: 'Manrope-SemiBold' }}
                  >
                    Secure Access
                  </Text>
                </View>
                <View className="bg-beige/15 rounded-full px-3 py-1 border border-beige/20">
                  <Text
                    className="text-beige text-xs font-semibold"
                    style={{ fontFamily: 'Manrope-SemiBold' }}
                  >
                    Verified Partners
                  </Text>
                </View>
              </View>
            </View>

            {/* Login Form */}
            <View className="w-full bg-white rounded-3xl p-6 shadow-sm border border-primary/10">
              <Text
                className="text-2xl font-bold text-primary mb-2"
                style={{ fontFamily: 'SpaceGrotesk-Bold' }}
              >
                Welcome back
              </Text>
              <Text
                className="text-primary/60 text-sm mb-6"
                style={{ fontFamily: 'Manrope-Regular' }}
              >
                Sign in to continue your projects and materials.
              </Text>

              {error ? (
                <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
                  <Text
                    className="text-red-700 text-sm"
                    style={{ fontFamily: 'Manrope-Regular' }}
                  >
                    {error}
                  </Text>
                </View>
              ) : null}

              <View className="mb-4">
                <Text
                  className="text-sm text-primary/70 mb-2"
                  style={{ fontFamily: 'Manrope-Medium' }}
                >
                  Email
                </Text>
                <TextInput
                  className="bg-beige/40 border border-primary/10 rounded-xl px-4 py-3 text-base text-primary"
                  style={{ fontFamily: 'Manrope-Regular' }}
                  placeholder="your@email.com"
                  placeholderTextColor="rgba(2, 45, 55, 0.4)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              <View className="mb-2">
                <Text
                  className="text-sm text-primary/70 mb-2"
                  style={{ fontFamily: 'Manrope-Medium' }}
                >
                  Password
                </Text>
                <TextInput
                  className="bg-beige/40 border border-primary/10 rounded-xl px-4 py-3 text-base text-primary"
                  style={{ fontFamily: 'Manrope-Regular' }}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(2, 45, 55, 0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              <Text
                className="text-primary/50 text-xs text-right mb-6"
                style={{ fontFamily: 'Manrope-Regular' }}
              >
                Forgot password?
              </Text>

              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center active:opacity-90"
                onPress={handleLogin}
                activeOpacity={0.95}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffedd8" />
                ) : (
                  <Text
                    className="text-beige text-base font-semibold"
                    style={{ fontFamily: 'Manrope-SemiBold' }}
                  >
                    Login
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center mt-6">
                <Text
                  className="text-primary/60 text-sm"
                  style={{ fontFamily: 'Manrope-Regular' }}
                >
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={isLoading}>
                  <Text
                    className="text-accent text-sm font-semibold"
                    style={{ fontFamily: 'Manrope-SemiBold' }}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
