import { View, Text, TouchableOpacity, Image } from 'react-native';

interface MaterialCarouselItemProps {
  title: string;
  imageUrl: string;
  price: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function MaterialCarouselItem({ 
  title, 
  imageUrl, 
  price, 
  isSelected, 
  onPress 
}: MaterialCarouselItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      className={`bg-white rounded-xl overflow-hidden mr-3 ${
        isSelected ? 'border-2 border-accent' : 'border border-primary/10'
      }`}
      style={{
        width: 140,
        shadowColor: '#022d37',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-24"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text 
          className="text-primary text-sm font-semibold mb-1" 
          style={{ fontFamily: 'Manrope-SemiBold' }}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text 
          className="text-accent text-xs" 
          style={{ fontFamily: 'JetBrainsMono-Medium' }}
        >
          {price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
