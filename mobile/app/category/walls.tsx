import { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import ProductCard from '../../components/ProductCard';
import { getWalls, Material } from '../../services/materialsService';

export default function WallsScreen() {
    const router = useRouter();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMaterials = async () => {
        try {
            setError(null);
            const { data, error: fetchError } = await getWalls();

            if (fetchError) {
                setError(fetchError);
            } else if (data) {
                setMaterials(data);
            }
        } catch (err) {
            setError('Failed to load wall materials');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMaterials();
    };

    return (
        <SafeAreaView className="flex-1 bg-beige">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-primary/10">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-4 p-2 -ml-2"
                >
                    <ArrowLeft size={24} color="#022d37" />
                </TouchableOpacity>
                <View>
                    <Text
                        className="text-primary text-xl font-bold"
                        style={{ fontFamily: 'SpaceGrotesk-Bold' }}
                    >
                        Wall Materials
                    </Text>
                    <Text
                        className="text-primary/60 text-sm"
                        style={{ fontFamily: 'Manrope-Regular' }}
                    >
                        {materials.length} products available
                    </Text>
                </View>
            </View>

            {/* Content */}
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#022d37" />
                    <Text
                        className="text-primary/60 mt-4"
                        style={{ fontFamily: 'Manrope-Regular' }}
                    >
                        Loading materials...
                    </Text>
                </View>
            ) : error ? (
                <View className="flex-1 items-center justify-center px-6">
                    <Text
                        className="text-red-600 text-center mb-4"
                        style={{ fontFamily: 'Manrope-Regular' }}
                    >
                        {error}
                    </Text>
                    <TouchableOpacity
                        className="bg-primary px-6 py-3 rounded-xl"
                        onPress={fetchMaterials}
                    >
                        <Text
                            className="text-beige font-semibold"
                            style={{ fontFamily: 'Manrope-SemiBold' }}
                        >
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    className="flex-1 px-6 pt-4"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View className="pb-10">
                        {materials.map((material) => (
                            <ProductCard
                                key={material._id}
                                name={material.name}
                                nameEn={material.nameEn}
                                price={material.pricePerMeter}
                                currency={material.currency}
                                imageUrl={material.textureUrl || material.thumbnailUrl}
                                color={material.materialType === 'color' ? material.color : undefined}
                                category={material.category}
                                type="wall"
                            />
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
