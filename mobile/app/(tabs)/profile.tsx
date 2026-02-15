import { View, ScrollView, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import TopBar from '@/components/TopBar';
import { User, Mail, Phone, MapPin, Settings, LogOut, Shield, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getUserOrders } from '../../services/ordersService';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [orderCount, setOrderCount] = useState(0);

  const fetchStats = async () => {
    if (user?._id) {
      const { data } = await getUserOrders(user._id);
      if (data) {
        setOrderCount(data.length);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [user])
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-beige items-center justify-center">
        <ActivityIndicator size="large" color="#022d37" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-beige">
      <TopBar />
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="bg-white rounded-3xl p-6 mb-6 border border-primary/10" style={{ shadowColor: '#022d37', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <Text
            className="text-primary text-2xl font-bold"
            style={{ fontFamily: 'SpaceGrotesk-Bold' }}
          >
            Profile
          </Text>
          <Text
            className="text-primary/60 text-sm mt-2"
            style={{ fontFamily: 'Manrope-Regular' }}
          >
            Manage your Buildex4Syria identity and professional details.
          </Text>
        </View>

        {/* User Info Card */}
        <View
          className="bg-white rounded-xl p-6 mb-4"
          style={{
            shadowColor: '#022d37',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="items-center mb-6">
            <View className="bg-accent/10 rounded-full p-6 mb-3">
              <User size={48} color="#084C5C" strokeWidth={2} />
            </View>
            <Text
              className="text-primary text-xl font-bold"
              style={{ fontFamily: 'SpaceGrotesk-Bold' }}
            >
              {user?.username || 'Guest User'}
            </Text>

            {user?.companyName && (
              <Text
                className="text-primary/60 text-sm mt-1"
                style={{ fontFamily: 'Manrope-Regular' }}
              >
                {user.companyName}
              </Text>
            )}

            <View className="flex-row items-center mt-2">
              <Shield size={14} color="#084C5C" />
              <Text
                className="text-accent text-sm ml-1 capitalize"
                style={{ fontFamily: 'Manrope-Medium' }}
              >
                {user?.role || 'user'}
              </Text>
            </View>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center">
              <View className="bg-accent/10 rounded-lg p-2 mr-3">
                <Mail size={20} color="#084C5C" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text
                  className="text-primary/60 text-xs mb-1"
                  style={{ fontFamily: 'Manrope-Medium' }}
                >
                  Email
                </Text>
                <Text
                  className="text-primary text-sm"
                  style={{ fontFamily: 'Manrope-Regular' }}
                >
                  {user?.email || 'Not signed in'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-accent/10 rounded-lg p-2 mr-3">
                <Phone size={20} color="#084C5C" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text
                  className="text-primary/60 text-xs mb-1"
                  style={{ fontFamily: 'Manrope-Medium' }}
                >
                  Phone
                </Text>
                <Text
                  className={`text-sm ${user?.phone ? 'text-primary' : 'text-primary/40 italic'}`}
                  style={{ fontFamily: 'Manrope-Regular' }}
                >
                  {user?.phone || 'Not set'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-accent/10 rounded-lg p-2 mr-3">
                <MapPin size={20} color="#084C5C" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text
                  className="text-primary/60 text-xs mb-1"
                  style={{ fontFamily: 'Manrope-Medium' }}
                >
                  Location
                </Text>
                <Text
                  className={`text-sm ${user?.address ? 'text-primary' : 'text-primary/40 italic'}`}
                  style={{ fontFamily: 'Manrope-Regular' }}
                >
                  {user?.address || 'Not set'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats / Quick Links */}
        <View
          className="bg-white rounded-xl p-6 mb-6"
          style={{
            shadowColor: '#022d37',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            className="text-primary text-lg font-bold mb-4"
            style={{ fontFamily: 'SpaceGrotesk-Bold' }}
          >
            Your Activity
          </Text>

          <TouchableOpacity
            className="flex-row items-center justify-between py-3 border-b border-primary/5"
            onPress={() => router.push('orders/index')}
          >
            <View className="flex-row items-center">
              <View className="bg-primary/5 p-2 rounded-lg mr-3">
                <Text className="text-xl">📦</Text>
              </View>
              <View>
                <Text className="text-primary font-semibold" style={{ fontFamily: 'Manrope-SemiBold' }}>My Orders</Text>
                <Text className="text-primary/60 text-xs">{orderCount} orders placed</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#084C5C" opacity={0.5} />
          </TouchableOpacity>

          <View className="flex-row items-center justify-between py-3 border-b border-primary/5">
            <View className="flex-row items-center">
              <View className="bg-primary/5 p-2 rounded-lg mr-3">
                <Text className="text-xl">❤️</Text>
              </View>
              <View>
                <Text className="text-primary font-semibold" style={{ fontFamily: 'Manrope-SemiBold' }}>Saved Projects</Text>
                <Text className="text-primary/60 text-xs">0 saved items</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#084C5C" opacity={0.5} />
          </View>
        </View>

        {/* Actions */}
        <View className="gap-3 mb-6">
          <TouchableOpacity
            className="bg-white rounded-xl p-4 flex-row items-center justify-between"
            activeOpacity={0.95}
            onPress={handleLogout}
            style={{
              shadowColor: '#022d37',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center">
              <View className="bg-red-100 rounded-lg p-2 mr-3">
                <LogOut size={20} color="#dc2626" strokeWidth={2} />
              </View>
              <Text
                className="text-red-600 text-base font-semibold"
                style={{ fontFamily: 'Manrope-SemiBold' }}
              >
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
