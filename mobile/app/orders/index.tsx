import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package, Clock, Calendar, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { getUserOrders, Order } from '../../services/ordersService';
import TopBar from '@/components/TopBar';

export default function OrderHistoryScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        if (!user?._id) return;

        try {
            setError(null);
            const { data, error: fetchError } = await getUserOrders(user._id);

            if (fetchError) {
                setError(fetchError);
            } else if (data) {
                setOrders(data);
            }
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders();
    }, [user]);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return dateString;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatPrice = (price: number) => {
        return price?.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) || '0.00';
    };

    return (
        <SafeAreaView className="flex-1 bg-beige">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-primary/10 bg-beige">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2">
                    <ArrowLeft size={24} color="#022d37" />
                </TouchableOpacity>
                <Text className="text-primary text-xl font-bold" style={{ fontFamily: 'SpaceGrotesk-Bold' }}>
                    My Orders
                </Text>
            </View>

            <ScrollView
                className="flex-1 px-6 pt-6"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {loading ? (
                    <View className="py-20 items-center">
                        <ActivityIndicator size="large" color="#022d37" />
                    </View>
                ) : error ? (
                    <View className="py-20 items-center">
                        <Text className="text-red-500 mb-4 font-medium">{error}</Text>
                        <TouchableOpacity onPress={fetchOrders} className="bg-primary px-6 py-2 rounded-lg">
                            <Text className="text-beige font-bold">Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : orders.length === 0 ? (
                    <View className="py-20 items-center">
                        <View className="bg-primary/5 p-6 rounded-full mb-4">
                            <Package size={48} color="#022d37" opacity={0.4} />
                        </View>
                        <Text className="text-primary/60 text-lg font-medium">No orders yet</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/our-templates')}
                            className="mt-6 bg-primary px-8 py-3 rounded-xl"
                        >
                            <Text className="text-beige font-semibold">Browse Templates</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="gap-4 pb-10">
                        {orders.map((order) => (
                            <View
                                key={order._id}
                                className="bg-white rounded-xl p-4 border border-primary/10"
                                style={{
                                    shadowColor: '#022d37',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 4,
                                    elevation: 2,
                                }}
                            >
                                {/* Order Header */}
                                <View className="flex-row justify-between items-start mb-3 border-b border-primary/5 pb-3">
                                    <View>
                                        <Text className="text-primary font-bold text-lg" style={{ fontFamily: 'Manrope-Bold' }}>
                                            #{order.orderNumber}
                                        </Text>
                                        <View className="flex-row items-center mt-1">
                                            <Calendar size={12} color="#084C5C" opacity={0.6} />
                                            <Text className="text-primary/60 text-xs ml-1" style={{ fontFamily: 'Manrope-Regular' }}>
                                                {formatDate(order.createdAt)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status).split(' ')[0]}`}>
                                        <Text className={`text-xs font-bold capitalize ${getStatusColor(order.status).split(' ')[1]}`}>
                                            {order.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* Order Type */}
                                <View className="mb-3">
                                    {order.projectId ? (
                                        <View className="flex-row items-center">
                                            <Package size={16} color="#084C5C" />
                                            <Text className="text-primary ml-2 font-medium" style={{ fontFamily: 'Manrope-Medium' }}>
                                                Project Order
                                            </Text>
                                        </View>
                                    ) : (
                                        <View className="flex-row items-center">
                                            <Package size={16} color="#084C5C" />
                                            <Text className="text-primary ml-2 font-medium" style={{ fontFamily: 'Manrope-Medium' }}>
                                                Custom Order
                                            </Text>
                                        </View>
                                    )}
                                    <Text className="text-primary/60 text-sm mt-1 ml-6">
                                        {order.items?.length || 0} items
                                    </Text>
                                </View>

                                {/* Footer */}
                                <View className="flex-row justify-between items-center pt-2">
                                    <Text className="text-accent font-bold text-lg" style={{ fontFamily: 'JetBrainsMono-Medium' }}>
                                        ${formatPrice(order.totalAmount)}
                                    </Text>
                                    <TouchableOpacity disabled className="opacity-50">
                                        <ChevronRight size={20} color="#022d37" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
