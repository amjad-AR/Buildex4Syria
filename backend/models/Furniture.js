import mongoose from 'mongoose';

const furnitureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameEn: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['sofa', 'table', 'chair', 'bed', 'cabinet', 'lamp', 'desk', 'shelf', 'rug', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'SYP', 'EUR', 'SAR', 'AED']
  },
  // الأبعاد بالمتر
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true }
  },
  // اللون الافتراضي
  defaultColor: {
    type: String,
    default: '#5D4E37'
  },
  // الألوان المتاحة
  availableColors: [{
    name: String,
    hex: String
  }],
  // صورة المعاينة
  imageUrl: {
    type: String,
    default: ''
  },
  // أيقونة العرض
  icon: {
    type: String,
    default: '🪑'
  },
  // المواد المستخدمة
  material: {
    type: String,
    default: 'wood'
  },
  // الوزن بالكيلوغرام
  weight: {
    type: Number,
    default: 0
  },
  // الكمية المتوفرة
  stock: {
    type: Number,
    default: 0
  },
  // نشط أم لا
  isActive: {
    type: Boolean,
    default: true
  },
  // ترتيب العرض
  displayOrder: {
    type: Number,
    default: 0
  },
  // التصنيفات
  tags: [{
    type: String
  }],
  // العلامة التجارية
  brand: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index للبحث السريع
furnitureSchema.index({ name: 'text', nameEn: 'text', description: 'text' });
furnitureSchema.index({ category: 1, isActive: 1 });
furnitureSchema.index({ price: 1 });

const Furniture = mongoose.model('Furniture', furnitureSchema);

export default Furniture;

