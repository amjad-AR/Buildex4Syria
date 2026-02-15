import { API_ENDPOINTS, apiRequest } from './api';

export interface OrderItem {
    type: 'furniture' | 'material';
    itemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
}

export interface ShippingAddress {
    address: string;
    city: string;
    country: string;
    postalCode?: string;
    phone: string;
}

export interface Order {
    _id: string;
    orderNumber: string;
    userId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    projectId?: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    subtotal: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    shippingCost: number;
    totalAmount: number;
    currency: string;
    paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded';
    paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other';
    shippingAddress: ShippingAddress;
    shippingMethod: 'pickup' | 'delivery' | 'express';
    customerNotes: string;
    createdAt: string;
}

export interface CreateOrderData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: ShippingAddress;
    shippingMethod?: 'pickup' | 'delivery' | 'express';
    paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'other';
    customerNotes?: string;
}

// Create order from a project
export async function createOrderFromProject(projectId: string, customerData: CreateOrderData) {
    return apiRequest<Order>(API_ENDPOINTS.ORDER_FROM_PROJECT(projectId), {
        method: 'POST',
        body: JSON.stringify(customerData),
    });
}

// Create a general order
export async function createOrder(orderData: CreateOrderData & { items?: OrderItem[] }) {
    return apiRequest<Order>(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        body: JSON.stringify(orderData),
    });
}

// Get orders for a specific user
export async function getUserOrders(userId: string) {
    return apiRequest<Order[]>(`${API_ENDPOINTS.ORDERS}?userId=${userId}&sort=orderDate`);
}

export default {
    createOrderFromProject,
    createOrder,
    getUserOrders,
};
