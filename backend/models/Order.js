import mongoose from 'mongoose';

// نموذج العنصر المطلوب (أثاث أو خامة)
const orderItemSchema = new mongoose.Schema({
  // نوع العنصر: أثاث أو خامة
  type: {
    type: String,
    enum: ['furniture', 'material'],
    required: true
  },
  // مرجع إلى العنصر (Furniture أو Material)
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'items.type' // مرجع ديناميكي حسب النوع
  },
  // اسم العنصر (للعرض)
  name: {
    type: String,
    default: ''
  },
  // الكمية المطلوبة
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  // سعر الوحدة
  unitPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  // السعر الإجمالي للعنصر (الكمية × سعر الوحدة)
  totalPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  // ملاحظات إضافية للعنصر
  notes: {
    type: String,
    default: ''
  }
}, { _id: true });

// نموذج عنوان الشحن
const shippingAddressSchema = new mongoose.Schema({
  // العنوان التفصيلي
  address: {
    type: String,
    default: ''
  },
  // المدينة
  city: {
    type: String,
    default: ''
  },
  // البلد
  country: {
    type: String,
    default: 'Syria'
  },
  // الرمز البريدي (اختياري)
  postalCode: {
    type: String,
    default: ''
  },
  // رقم الهاتف للتواصل
  phone: {
    type: String,
    default: ''
  }
}, { _id: false });

// نموذج الطلب الرئيسي
const orderSchema = new mongoose.Schema({
  // رقم الطلب (يُنشأ تلقائياً)
  orderNumber: {
    type: String,
    unique: true
  },
  // المستخدم الذي أنشأ الطلب
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // اسم العميل (إذا لم يكن مسجلاً)
  customerName: {
    type: String,
    default: ''
  },
  // البريد الإلكتروني للعميل
  customerEmail: {
    type: String,
    default: ''
  },
  // رقم هاتف العميل
  customerPhone: {
    type: String,
    default: ''
  },
  // المشروع المرتبط بالطلب
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  // حالة الطلب
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  // العناصر المطلوبة (أثاث + خامات)
  items: [orderItemSchema],
  // ========== الأسعار ==========
  // المجموع الفرعي (قبل الخصم والضريبة)
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  },
  // قيمة الخصم
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  // نسبة الضريبة
  taxRate: {
    type: Number,
    default: 0,
    min: 0
  },
  // قيمة الضريبة
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  // تكلفة الشحن
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  // الإجمالي الكلي للطلب
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  // العملة
  currency: {
    type: String,
    default: 'USD'
  },
  // ========== التواريخ ==========
  // تاريخ الطلب
  orderDate: {
    type: Date,
    default: Date.now
  },
  // تاريخ التسليم المتوقع
  expectedDeliveryDate: {
    type: Date,
    default: null
  },
  // تاريخ التسليم الفعلي
  deliveryDate: {
    type: Date,
    default: null
  },
  // ========== الدفع ==========
  // حالة الدفع
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'refunded'],
    default: 'unpaid'
  },
  // طريقة الدفع
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'other'],
    default: 'cash'
  },
  // المبلغ المدفوع
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  // ========== الشحن ==========
  // عنوان الشحن
  shippingAddress: shippingAddressSchema,
  // طريقة الشحن
  shippingMethod: {
    type: String,
    enum: ['pickup', 'delivery', 'express'],
    default: 'delivery'
  },
  // رقم تتبع الشحنة
  trackingNumber: {
    type: String,
    default: ''
  },
  // ========== ملاحظات ==========
  // ملاحظات العميل
  customerNotes: {
    type: String,
    default: ''
  },
  // ملاحظات داخلية (للموظفين)
  internalNotes: {
    type: String,
    default: ''
  },
  // ========== سجل الحالات ==========
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// ========== Middleware ==========

// إنشاء رقم طلب فريد قبل الحفظ
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}-${random}`;
  }
  
  // حساب الإجماليات
  this.calculateTotals();
  
  next();
});

// ========== Methods ==========

// حساب الإجماليات
orderSchema.methods.calculateTotals = function() {
  // حساب المجموع الفرعي من العناصر
  let subtotal = 0;
  
  if (this.items && this.items.length > 0) {
    for (const item of this.items) {
      item.totalPrice = (item.unitPrice || 0) * (item.quantity || 1);
      subtotal += item.totalPrice;
    }
  }
  
  this.subtotal = subtotal;
  
  // حساب الإجمالي
  const afterDiscount = subtotal - (this.discount || 0);
  this.taxAmount = afterDiscount * ((this.taxRate || 0) / 100);
  this.totalAmount = afterDiscount + this.taxAmount + (this.shippingCost || 0);
  
  return {
    subtotal: this.subtotal,
    discount: this.discount,
    taxAmount: this.taxAmount,
    shippingCost: this.shippingCost,
    totalAmount: this.totalAmount
  };
};

// تحديث حالة الطلب مع التسجيل
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  
  // تحديث تاريخ التسليم إذا تم التسليم
  if (newStatus === 'delivered' && !this.deliveryDate) {
    this.deliveryDate = new Date();
  }
  
  return this;
};

// ========== Indexes ==========
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ projectId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderDate: -1 });

// ========== Virtuals ==========

// حالة الدفع المتبقي
orderSchema.virtual('remainingAmount').get(function() {
  return Math.max(0, this.totalAmount - (this.paidAmount || 0));
});

// هل الطلب مدفوع بالكامل
orderSchema.virtual('isFullyPaid').get(function() {
  return this.paidAmount >= this.totalAmount;
});

// عدد العناصر في الطلب
orderSchema.virtual('itemsCount').get(function() {
  return this.items ? this.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
});

// تضمين الـ virtuals عند التحويل إلى JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

export default mongoose.model('Order', orderSchema);

