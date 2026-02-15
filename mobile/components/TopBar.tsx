import { View, Text, StatusBar, SafeAreaView } from 'react-native';

export default function TopBar() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="bg-primary">
        <View className="bg-primary px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text
                className="text-beige text-lg font-bold tracking-tight"
                style={{ fontFamily: 'SpaceGrotesk-Bold' }}
              >
                Buildex4Syria
              </Text>
              <Text
                className="text-beige/70 text-xs mt-1"
                style={{ fontFamily: 'Manrope-Regular' }}
              >
                Premium design & estimation studio
              </Text>
            </View>

            <View className="bg-beige/10 px-3 py-1 rounded-full border border-beige/20">
              <Text
                className="text-beige text-xs font-semibold"
                style={{ fontFamily: 'Manrope-SemiBold' }}
              >
                Verified Partner
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
