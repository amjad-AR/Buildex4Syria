import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ScrollView,
    ActivityIndicator,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Package,
    Ruler,
    DollarSign,
    ShoppingCart,
    FileText,
    X,
    Check,
} from 'lucide-react-native';
import { getProjectById, Project } from '../../services/projectsService';
import { createOrderFromProject, CreateOrderData } from '../../services/ordersService';

export default function ProjectDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);

    // Order form state
    const [orderForm, setOrderForm] = useState<CreateOrderData>({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: {
            address: '',
            city: '',
            country: 'Syria',
            phone: '',
        },
        shippingMethod: 'delivery',
        paymentMethod: 'cash',
        customerNotes: '',
    });

    useEffect(() => {
        if (id) {
            fetchProject();
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            setError(null);
            const { data, error: fetchError } = await getProjectById(id!);

            if (fetchError) {
                setError(fetchError);
            } else if (data) {
                setProject(data);
            }
        } catch (err) {
            setError('Failed to load project');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return price?.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) || '0.00';
    };

    const handleOrderSubmit = async () => {
        // Validate form
        if (!orderForm.customerName.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }
        if (!orderForm.customerPhone.trim()) {
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }
        if (!orderForm.shippingAddress.city.trim()) {
            Alert.alert('Error', 'Please enter your city');
            return;
        }

        setOrderLoading(true);
        try {
            const { data, error } = await createOrderFromProject(id!, {
                ...orderForm,
                shippingAddress: {
                    ...orderForm.shippingAddress,
                    phone: orderForm.customerPhone,
                },
            });

            if (error) {
                Alert.alert('Error', error);
            } else if (data) {
                setShowOrderModal(false);
                Alert.alert(
                    'Order Placed!',
                    `Your order #${data.orderNumber} has been submitted successfully. We will contact you soon.`,
                    [{ text: 'OK' }]
                );
                // Reset form
                setOrderForm({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    shippingAddress: { address: '', city: '', country: 'Syria', phone: '' },
                    shippingMethod: 'delivery',
                    paymentMethod: 'cash',
                    customerNotes: '',
                });
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-beige items-center justify-center">
                <ActivityIndicator size="large" color="#022d37" />
                <Text className="text-primary/60 mt-4" style={{ fontFamily: 'Manrope-Regular' }}>
                    Loading project...
                </Text>
            </SafeAreaView>
        );
    }

    if (error || !project) {
        return (
            <SafeAreaView className="flex-1 bg-beige items-center justify-center px-6">
                <Text className="text-red-600 text-center mb-4" style={{ fontFamily: 'Manrope-Regular' }}>
                    {error || 'Project not found'}
                </Text>
                <TouchableOpacity className="bg-primary px-6 py-3 rounded-xl" onPress={() => router.back()}>
                    <Text className="text-beige font-semibold" style={{ fontFamily: 'Manrope-SemiBold' }}>
                        Go Back
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const materialsList = Object.entries(project.materials || {}).filter(([_, mat]) => mat?.name);

    return (
        <SafeAreaView className="flex-1 bg-beige">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-primary/10 bg-beige">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2">
                    <ArrowLeft size={24} color="#022d37" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-primary text-lg font-bold" style={{ fontFamily: 'SpaceGrotesk-Bold' }} numberOfLines={1}>
                        {project.name}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1">
                {/* Project Image */}
                <View className="h-56 bg-primary/10">
                    {project.screenshot ? (
                        <Image source={{ uri: project.screenshot }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <View className="w-full h-full items-center justify-center">
                            <Text className="text-primary/40 text-6xl">🏠</Text>
                        </View>
                    )}
                </View>

                <View className="px-6 py-6">
                    {/* Overview */}
                    <View className="bg-white rounded-2xl p-4 mb-4 border border-primary/10">
                        <View className="flex-row items-center mb-3">
                            <Ruler size={18} color="#084C5C" />
                            <Text className="text-primary font-semibold ml-2" style={{ fontFamily: 'Manrope-SemiBold' }}>
                                Room Dimensions
                            </Text>
                        </View>
                        <View className="flex-row gap-3">
                            <View className="flex-1 bg-beige/60 rounded-xl p-3">
                                <Text className="text-primary/60 text-xs" style={{ fontFamily: 'Manrope-Regular' }}>Width</Text>
                                <Text className="text-primary font-bold" style={{ fontFamily: 'JetBrainsMono-Medium' }}>{project.dimensions?.width}m</Text>
                            </View>
                            <View className="flex-1 bg-beige/60 rounded-xl p-3">
                                <Text className="text-primary/60 text-xs" style={{ fontFamily: 'Manrope-Regular' }}>Length</Text>
                                <Text className="text-primary font-bold" style={{ fontFamily: 'JetBrainsMono-Medium' }}>{project.dimensions?.length}m</Text>
                            </View>
                            <View className="flex-1 bg-beige/60 rounded-xl p-3">
                                <Text className="text-primary/60 text-xs" style={{ fontFamily: 'Manrope-Regular' }}>Height</Text>
                                <Text className="text-primary font-bold" style={{ fontFamily: 'JetBrainsMono-Medium' }}>{project.dimensions?.height}m</Text>
                            </View>
                        </View>
                        {project.calculatedAreas && (
                            <View className="mt-3 bg-accent/10 rounded-xl p-3">
                                <Text className="text-primary/60 text-xs" style={{ fontFamily: 'Manrope-Regular' }}>Total Area</Text>
                                <Text className="text-accent font-bold text-lg" style={{ fontFamily: 'JetBrainsMono-Medium' }}>
                                    {project.calculatedAreas.totalArea?.toFixed(1)} m²
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Materials Section */}
                    {materialsList.length > 0 && (
                        <View className="bg-white rounded-2xl p-4 mb-4 border border-primary/10">
                            <View className="flex-row items-center mb-3">
                                <Package size={18} color="#084C5C" />
                                <Text className="text-primary font-semibold ml-2" style={{ fontFamily: 'Manrope-SemiBold' }}>
                                    Materials ({materialsList.length})
                                </Text>
                            </View>
                            {materialsList.map(([key, material]) => (
                                <View key={key} className="flex-row items-center justify-between py-3 border-b border-primary/5 last:border-0">
                                    <View className="flex-1">
                                        <Text className="text-primary font-medium capitalize" style={{ fontFamily: 'Manrope-Medium' }}>
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </Text>
                                        <Text className="text-primary/60 text-sm" style={{ fontFamily: 'Manrope-Regular' }}>
                                            {material?.nameEn || material?.name}
                                        </Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-accent font-bold" style={{ fontFamily: 'JetBrainsMono-Medium' }}>
                                            ${formatPrice(material?.totalPrice || 0)}
                                        </Text>
                                        <Text className="text-primary/50 text-xs" style={{ fontFamily: 'Manrope-Regular' }}>
                                            {material?.area?.toFixed(1)} m² × ${material?.pricePerMeter}/m²
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Furniture Section */}
                    {project.furniture && project.furniture.length > 0 && (
                        <View className="bg-white rounded-2xl p-4 mb-4 border border-primary/10">
                            <View className="flex-row items-center mb-3">
                                <Package size={18} color="#084C5C" />
                                <Text className="text-primary font-semibold ml-2" style={{ fontFamily: 'Manrope-SemiBold' }}>
                                    Furniture ({project.furniture.length})
                                </Text>
                            </View>
                            {project.furniture.map((item, index) => (
                                <View key={index} className="flex-row items-center justify-between py-3 border-b border-primary/5 last:border-0">
                                    <View className="flex-1">
                                        <Text className="text-primary font-medium" style={{ fontFamily: 'Manrope-Medium' }}>
                                            {item.nameEn || item.name}
                                        </Text>
                                        <Text className="text-primary/60 text-sm" style={{ fontFamily: 'Manrope-Regular' }}>
                                            Qty: {item.quantity || 1}
                                        </Text>
                                    </View>
                                    <Text className="text-accent font-bold" style={{ fontFamily: 'JetBrainsMono-Medium' }}>
                                        ${formatPrice((item.price || 0) * (item.quantity || 1))}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Pricing Breakdown */}
                    <View className="bg-white rounded-2xl p-4 mb-6 border border-primary/10">
                        <View className="flex-row items-center mb-3">
                            <DollarSign size={18} color="#084C5C" />
                            <Text className="text-primary font-semibold ml-2" style={{ fontFamily: 'Manrope-SemiBold' }}>
                                Pricing Breakdown
                            </Text>
                        </View>
                        <View className="gap-2">
                            <View className="flex-row justify-between">
                                <Text className="text-primary/60" style={{ fontFamily: 'Manrope-Regular' }}>Materials</Text>
                                <Text className="text-primary" style={{ fontFamily: 'JetBrainsMono-Medium' }}>${formatPrice(project.pricing?.materialsCost)}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-primary/60" style={{ fontFamily: 'Manrope-Regular' }}>Furniture</Text>
                                <Text className="text-primary" style={{ fontFamily: 'JetBrainsMono-Medium' }}>${formatPrice(project.pricing?.furnitureCost)}</Text>
                            </View>
                            {project.pricing?.additionalCost > 0 && (
                                <View className="flex-row justify-between">
                                    <Text className="text-primary/60" style={{ fontFamily: 'Manrope-Regular' }}>Additional</Text>
                                    <Text className="text-primary" style={{ fontFamily: 'JetBrainsMono-Medium' }}>${formatPrice(project.pricing.additionalCost)}</Text>
                                </View>
                            )}
                            {project.pricing?.discount > 0 && (
                                <View className="flex-row justify-between">
                                    <Text className="text-primary/60" style={{ fontFamily: 'Manrope-Regular' }}>Discount</Text>
                                    <Text className="text-green-600" style={{ fontFamily: 'JetBrainsMono-Medium' }}>-${formatPrice(project.pricing.discount)}</Text>
                                </View>
                            )}
                            {project.pricing?.taxAmount > 0 && (
                                <View className="flex-row justify-between">
                                    <Text className="text-primary/60" style={{ fontFamily: 'Manrope-Regular' }}>Tax ({project.pricing.taxRate}%)</Text>
                                    <Text className="text-primary" style={{ fontFamily: 'JetBrainsMono-Medium' }}>${formatPrice(project.pricing.taxAmount)}</Text>
                                </View>
                            )}
                            <View className="flex-row justify-between pt-3 border-t border-primary/10 mt-2">
                                <Text className="text-primary font-bold" style={{ fontFamily: 'Manrope-SemiBold' }}>Total</Text>
                                <Text className="text-accent font-bold text-xl" style={{ fontFamily: 'JetBrainsMono-Medium' }}>${formatPrice(project.pricing?.totalPrice)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-3 pb-8">
                        <TouchableOpacity
                            className="bg-primary rounded-xl py-4 flex-row items-center justify-center"
                            onPress={() => setShowOrderModal(true)}
                            activeOpacity={0.95}
                        >
                            <ShoppingCart size={20} color="#ffedd8" />
                            <Text className="text-beige font-semibold ml-2" style={{ fontFamily: 'Manrope-SemiBold' }}>
                                Purchase Project
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-white border border-primary rounded-xl py-4 flex-row items-center justify-center"
                            onPress={() => setShowOrderModal(true)}
                            activeOpacity={0.95}
                        >
                            <FileText size={20} color="#022d37" />
                            <Text className="text-primary font-semibold ml-2" style={{ fontFamily: 'Manrope-SemiBold' }}>
                                Request Quote
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Order Modal */}
            <Modal visible={showOrderModal} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                    <View className="flex-1 bg-black/50 justify-end">
                        <View className="bg-beige rounded-t-3xl max-h-[90%]">
                            {/* Modal Header */}
                            <View className="flex-row items-center justify-between p-4 border-b border-primary/10">
                                <Text className="text-primary text-lg font-bold" style={{ fontFamily: 'SpaceGrotesk-Bold' }}>
                                    Place Order
                                </Text>
                                <TouchableOpacity onPress={() => setShowOrderModal(false)} className="p-2">
                                    <X size={24} color="#022d37" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView className="p-4">
                                {/* Order Summary */}
                                <View className="bg-white rounded-2xl p-4 mb-4 border border-primary/10">
                                    <Text className="text-primary font-semibold mb-2" style={{ fontFamily: 'Manrope-SemiBold' }}>
                                        Order Summary
                                    </Text>
                                    <View className="flex-row justify-between">
                                        <Text className="text-primary/60" style={{ fontFamily: 'Manrope-Regular' }}>{project.name}</Text>
                                        <Text className="text-accent font-bold" style={{ fontFamily: 'JetBrainsMono-Medium' }}>
                                            ${formatPrice(project.pricing?.totalPrice)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Customer Info */}
                                <View className="gap-3 mb-4">
                                    <View>
                                        <Text className="text-primary/70 text-sm mb-1" style={{ fontFamily: 'Manrope-Medium' }}>Full Name *</Text>
                                        <TextInput
                                            className="bg-white border border-primary/10 rounded-xl px-4 py-3"
                                            style={{ fontFamily: 'Manrope-Regular' }}
                                            placeholder="Your name"
                                            value={orderForm.customerName}
                                            onChangeText={(text) => setOrderForm(prev => ({ ...prev, customerName: text }))}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-primary/70 text-sm mb-1" style={{ fontFamily: 'Manrope-Medium' }}>Phone *</Text>
                                        <TextInput
                                            className="bg-white border border-primary/10 rounded-xl px-4 py-3"
                                            style={{ fontFamily: 'Manrope-Regular' }}
                                            placeholder="Your phone number"
                                            keyboardType="phone-pad"
                                            value={orderForm.customerPhone}
                                            onChangeText={(text) => setOrderForm(prev => ({ ...prev, customerPhone: text }))}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-primary/70 text-sm mb-1" style={{ fontFamily: 'Manrope-Medium' }}>Email</Text>
                                        <TextInput
                                            className="bg-white border border-primary/10 rounded-xl px-4 py-3"
                                            style={{ fontFamily: 'Manrope-Regular' }}
                                            placeholder="your@email.com"
                                            keyboardType="email-address"
                                            value={orderForm.customerEmail}
                                            onChangeText={(text) => setOrderForm(prev => ({ ...prev, customerEmail: text }))}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-primary/70 text-sm mb-1" style={{ fontFamily: 'Manrope-Medium' }}>City *</Text>
                                        <TextInput
                                            className="bg-white border border-primary/10 rounded-xl px-4 py-3"
                                            style={{ fontFamily: 'Manrope-Regular' }}
                                            placeholder="Your city"
                                            value={orderForm.shippingAddress.city}
                                            onChangeText={(text) => setOrderForm(prev => ({
                                                ...prev,
                                                shippingAddress: { ...prev.shippingAddress, city: text }
                                            }))}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-primary/70 text-sm mb-1" style={{ fontFamily: 'Manrope-Medium' }}>Address</Text>
                                        <TextInput
                                            className="bg-white border border-primary/10 rounded-xl px-4 py-3"
                                            style={{ fontFamily: 'Manrope-Regular' }}
                                            placeholder="Street address"
                                            value={orderForm.shippingAddress.address}
                                            onChangeText={(text) => setOrderForm(prev => ({
                                                ...prev,
                                                shippingAddress: { ...prev.shippingAddress, address: text }
                                            }))}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-primary/70 text-sm mb-1" style={{ fontFamily: 'Manrope-Medium' }}>Notes</Text>
                                        <TextInput
                                            className="bg-white border border-primary/10 rounded-xl px-4 py-3"
                                            style={{ fontFamily: 'Manrope-Regular', height: 80, textAlignVertical: 'top' }}
                                            placeholder="Any special requests..."
                                            multiline
                                            value={orderForm.customerNotes}
                                            onChangeText={(text) => setOrderForm(prev => ({ ...prev, customerNotes: text }))}
                                        />
                                    </View>
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    className="bg-primary rounded-xl py-4 flex-row items-center justify-center mb-6"
                                    onPress={handleOrderSubmit}
                                    disabled={orderLoading}
                                    activeOpacity={0.95}
                                >
                                    {orderLoading ? (
                                        <ActivityIndicator color="#ffedd8" />
                                    ) : (
                                        <>
                                            <Check size={20} color="#ffedd8" />
                                            <Text className="text-beige font-semibold ml-2" style={{ fontFamily: 'Manrope-SemiBold' }}>
                                                Confirm Order
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}
