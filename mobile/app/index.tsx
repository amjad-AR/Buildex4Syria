import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      const authenticated = await checkAuth();

      // Small delay for smooth transition
      setTimeout(() => {
        if (authenticated) {
          router.replace('/(tabs)/products');
        } else {
          router.replace('/(auth)/login');
        }
      }, 300);
    };

    if (!isLoading) {
      initAuth();
    }
  }, [isLoading]);

  return (
    <View className="flex-1 bg-beige items-center justify-center">
      <ActivityIndicator size="large" color="#022d37" />
    </View>
  );
}
