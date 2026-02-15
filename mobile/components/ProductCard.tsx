import { View, Text, TouchableOpacity, Image } from 'react-native';

interface ProductCardProps {
    name: string;
    nameEn: string;
    price: number;
    currency: string;
    imageUrl?: string;
    color?: string;
    category?: string;
    type?: string;
    onPress?: () => void;
}

export default function ProductCard({
    name,
    nameEn,
    price,
    currency,
    imageUrl,
    color,
    category,
    type,
    onPress
}: ProductCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.95}
            className="bg-white rounded-2xl overflow-hidden mb-4"
            style={{
                shadowColor: '#022d37',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}
        >
            {/* Image or Color swatch */}
            <View className="h-32 w-full" style={{ backgroundColor: color || '#f5f5f5' }}>
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        className="w-full h-full items-center justify-center"
                        style={{ backgroundColor: color || '#f5f5f5' }}
                    >
                        <View
                            className="w-16 h-16 rounded-full border-2 border-white/50"
                            style={{ backgroundColor: color || '#ddd' }}
                        />
                    </View>
                )}

                {/* Category badge */}
                {category && (
                    <View className="absolute top-3 right-3 bg-primary/70 px-3 py-1 rounded-full">
                        <Text
                            className="text-beige text-xs font-semibold capitalize"
                            style={{ fontFamily: 'Manrope-SemiBold' }}
                        >
                            {category}
                        </Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <View className="p-4">
                <Text
                    className="text-primary text-base font-semibold mb-1"
                    style={{ fontFamily: 'Manrope-SemiBold' }}
                    numberOfLines={1}
                >
                    {nameEn}
                </Text>
                <Text
                    className="text-primary/60 text-sm mb-2"
                    style={{ fontFamily: 'Manrope-Regular' }}
                    numberOfLines={1}
                >
                    {name}
                </Text>

                {/* Price */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-baseline">
                        <Text
                            className="text-accent text-lg font-bold"
                            style={{ fontFamily: 'JetBrainsMono-Medium' }}
                        >
                            ${price.toFixed(2)}
                        </Text>
                        <Text
                            className="text-primary/50 text-xs ml-1"
                            style={{ fontFamily: 'Manrope-Regular' }}
                        >
                            {type === 'furniture' ? '' : '/m²'}
                        </Text>
                    </View>

                    {/* Type indicator */}
                    {type && (
                        <View className="bg-beige/80 px-2 py-1 rounded-lg">
                            <Text
                                className="text-primary/70 text-xs capitalize"
                                style={{ fontFamily: 'Manrope-Medium' }}
                            >
                                {type}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
