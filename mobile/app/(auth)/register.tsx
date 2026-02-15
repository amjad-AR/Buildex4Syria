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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        username: name,
        email,
        password
      });

      if (result.success) {
        router.replace('/(tabs)/products');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
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
                Join Buildex4Syria
              </Text>
              <Text
                className="text-beige/80 text-sm mt-2"
                style={{ fontFamily: 'Manrope-Regular' }}
              >
                Create an account to manage materials, designs, and estimates.
              </Text>
              <View className="flex-row mt-4 space-x-2">
                <View className="bg-beige/15 rounded-full px-3 py-1 border border-beige/20">
                  <Text
                    className="text-beige text-xs font-semibold"
                    style={{ fontFamily: 'Manrope-SemiBold' }}
                  >
                    Project Hub
                  </Text>
                </View>
                <View className="bg-beige/15 rounded-full px-3 py-1 border border-beige/20">
                  <Text
                    className="text-beige text-xs font-semibold"
                    style={{ fontFamily: 'Manrope-SemiBold' }}
                  >
                    Cost Insights
                  </Text>
                </View>
              </View>
            </View>

            {/* Registration Form */}
            <View className="w-full bg-white rounded-3xl p-6 shadow-sm border border-primary/10">
              <Text
                className="text-2xl font-bold text-primary mb-2"
                style={{ fontFamily: 'SpaceGrotesk-Bold' }}
              >
                Create account
              </Text>
              <Text
                className="text-primary/60 text-sm mb-6"
                style={{ fontFamily: 'Manrope-Regular' }}
              >
                Start your journey with a personalized workspace.
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
                  Full Name
                </Text>
                <TextInput
                  className="bg-beige/40 border border-primary/10 rounded-xl px-4 py-3 text-base text-primary"
                  style={{ fontFamily: 'Manrope-Regular' }}
                  placeholder="John Doe"
                  placeholderTextColor="rgba(2, 45, 55, 0.4)"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>

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

              <View className="mb-4">
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

              <View className="mb-6">
                <Text
                  className="text-sm text-primary/70 mb-2"
                  style={{ fontFamily: 'Manrope-Medium' }}
                >
                  Confirm Password
                </Text>
                <TextInput
                  className="bg-beige/40 border border-primary/10 rounded-xl px-4 py-3 text-base text-primary"
                  style={{ fontFamily: 'Manrope-Regular' }}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(2, 45, 55, 0.4)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center active:opacity-90"
                onPress={handleRegister}
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
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center mt-6">
                <Text
                  className="text-primary/60 text-sm"
                  style={{ fontFamily: 'Manrope-Regular' }}
                >
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
                  <Text
                    className="text-accent text-sm font-semibold"
                    style={{ fontFamily: 'Manrope-SemiBold' }}
                  >
                    Login
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
