import { Tabs } from 'expo-router';
import { Home, Ruler, User } from 'lucide-react-native';
import { View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0c1a20',
          borderTopWidth: 0,
          height: 82,
          paddingBottom: 14,
          paddingTop: 14,
        },
        tabBarItemStyle: {
          marginHorizontal: 8,
        },
        tabBarActiveTintColor: '#ffedd8',
        tabBarInactiveTintColor: 'rgba(255, 237, 216, 0.65)',
      }}
    >
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`items-center justify-center ${focused ? 'scale-110 -translate-y-1' : 'scale-100'
                }`}
              style={{
                backgroundColor: focused ? 'rgba(255, 237, 216, 0.12)' : 'transparent',
                borderColor: focused ? 'rgba(255, 237, 216, 0.2)' : 'transparent',
                borderWidth: 1,
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 18,
              }}
            >
              <Home size={24} color={color} strokeWidth={2} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontSize: 12,
                fontFamily: 'Manrope-Medium',
                marginTop: 4,
              }}
            >
              Products
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="our-templates"
        options={{
          title: 'Templates',
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`items-center justify-center ${focused ? 'scale-110 -translate-y-1' : 'scale-100'
                }`}
              style={{
                backgroundColor: focused ? 'rgba(255, 237, 216, 0.12)' : 'transparent',
                borderColor: focused ? 'rgba(255, 237, 216, 0.2)' : 'transparent',
                borderWidth: 1,
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 18,
              }}
            >
              <Ruler size={24} color={color} strokeWidth={2} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontSize: 12,
                fontFamily: 'Manrope-Medium',
                marginTop: 4,
              }}
            >
              Templates
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`items-center justify-center ${focused ? 'scale-110 -translate-y-1' : 'scale-100'
                }`}
              style={{
                backgroundColor: focused ? 'rgba(255, 237, 216, 0.12)' : 'transparent',
                borderColor: focused ? 'rgba(255, 237, 216, 0.2)' : 'transparent',
                borderWidth: 1,
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 18,
              }}
            >
              <User size={24} color={color} strokeWidth={2} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontSize: 12,
                fontFamily: 'Manrope-Medium',
                marginTop: 4,
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
