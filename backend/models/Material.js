import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['wall', 'floor', 'ceiling'],
    required: true
  },
  category: {
    type: String,
    enum: ['modern', 'classic', 'industrial', 'luxury', 'minimal', 'rustic'],
    default: 'modern'
  },
  // نوع الخامة: صورة أو لون صلب
  materialType: {
    type: String,
    enum: ['texture', 'color'],
    default: 'texture'
  },
  // رابط الصورة (للخامات من نوع texture)
  textureUrl: {
    type: String,
    default: ''
  },
  // اللون (للخامات من نوع color)
  color: {
    type: String,
    default: '#ffffff'
  },
  // خصائص المادة
  roughness: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  metalness: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  // حجم البلاطة بالمتر (لـ UV Mapping)
  tileSize: {
    type: Number,
    default: 1.5
  },
  // الوسوم للبحث والتصفية
  tags: [{
    type: String,
    lowercase: true
  }],
  // هل الخامة نشطة (ظاهرة للمستخدمين)
  isActive: {
    type: Boolean,
    default: true
  },
  // صورة مصغرة للعرض
  thumbnailUrl: {
    type: String,
    default: ''
  },
  // الترتيب في العرض
  displayOrder: {
    type: Number,
    default: 0
  },
  // سعر المتر المربع بالدولار
  pricePerMeter: {
    type: Number,
    default: 0,
    min: 0
  },
  // العملة
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'SYP', 'EUR', 'SAR', 'AED']
  },
  // الكمية المتوفرة (بالمتر المربع)
  stock: {
    type: Number,
    default: 0
  },
  // العلامة التجارية / المصدر
  brand: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index للبحث السريع
materialSchema.index({ type: 1, isActive: 1, displayOrder: 1 });
materialSchema.index({ tags: 1 });
materialSchema.index({ name: 'text', nameEn: 'text', tags: 'text' });

export default mongoose.model('Material', materialSchema);

