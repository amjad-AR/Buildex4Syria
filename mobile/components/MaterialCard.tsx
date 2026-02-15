import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface MaterialCardProps {
  title: string;
  icon: LucideIcon;
  imageUrl: string;
  onPress: () => void;
}

export default function MaterialCard({ title, icon: Icon, imageUrl, onPress }: MaterialCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      className="bg-white rounded-2xl overflow-hidden active:scale-95"
      style={{
        shadowColor: '#022d37',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View>
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-32"
          resizeMode="cover"
        />
        <View className="absolute top-3 right-3 bg-primary/70 px-3 py-1 rounded-full">
          <Text
            className="text-beige text-xs font-semibold"
            style={{ fontFamily: 'Manrope-SemiBold' }}
          >
            Featured
          </Text>
        </View>
      </View>
      <View className="p-4 flex-row items-center justify-between">
        <Text 
          className="text-primary text-lg font-semibold flex-1" 
          style={{ fontFamily: 'Manrope-SemiBold' }}
        >
          {title}
        </Text>
        <Icon size={24} color="#084C5C" strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );
}
