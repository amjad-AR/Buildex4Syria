import mongoose from 'mongoose';

// نموذج الخامة المستخدمة في المشروع
const usedMaterialSchema = new mongoose.Schema({
  // يقبل معرفات نصية أو ObjectId
  materialId: {
    type: String,
    default: ''
  },
  name: String,
  nameEn: String,
  type: {
    type: String,
    enum: ['wall', 'floor', 'ceiling']
  },
  materialType: {
    type: String,
    enum: ['texture', 'color']
  },
  value: String, // URL أو كود اللون
  pricePerMeter: {
    type: Number,
    default: 0
  },
  area: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, { _id: false });

// نموذج الأثاث المستخدم في المشروع
const usedFurnitureSchema = new mongoose.Schema({
  // يقبل معرفات نصية أو ObjectId
  furnitureId: {
    type: String,
    default: ''
  },
  id: String, // معرف محلي
  name: String,
  nameEn: String,
  color: String,
  size: [Number],
  x: Number,
  z: Number,
  rotation: Number,
  price: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    default: 1
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  // اسم منشئ المشروع
  creatorName: {
    type: String,
    default: 'مجهول',
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // أبعاد الغرفة
  dimensions: {
    width: { type: Number, default: 5 },
    length: { type: Number, default: 5 },
    height: { type: Number, default: 3 }
  },
  // الخامات المستخدمة
  materials: {
    wall: usedMaterialSchema,
    floor: usedMaterialSchema,
    ceiling: usedMaterialSchema,
    leftWall: usedMaterialSchema,
    rightWall: usedMaterialSchema,
    backWall: usedMaterialSchema,
    frontWall: usedMaterialSchema
  },
  // للتوافق مع الإصدار القديم
  textures: {
    wall: String,
    floor: String,
    ceiling: String,
    leftWall: String,
    rightWall: String,
    backWall: String,
    frontWall: String
  },
  colors: {
    wall: String,
    floor: String,
    ceiling: String,
    leftWall: String,
    rightWall: String,
    backWall: String,
    frontWall: String
  },
  // الأثاث
  furniture: [usedFurnitureSchema],
  // إعدادات الإضاءة
  lightingPreset: {
    type: String,
    default: 'day'
  },
  // صورة المشروع
  screenshot: {
    type: String,
    default: ''
  },
  // إعدادات الخلفية
  background: {
    bgType: {
      type: String,
      enum: ['color', 'texture'],
      default: 'color'
    },
    bgValue: {
      type: String,
      default: '#c2410c'
    }
  },
  // ========== الأسعار ==========
  pricing: {
    // تكلفة الخامات
    materialsCost: {
      type: Number,
      default: 0
    },
    // تكلفة الأثاث
    furnitureCost: {
      type: Number,
      default: 0
    },
    // تكلفة إضافية (تركيب، نقل، إلخ)
    additionalCost: {
      type: Number,
      default: 0
    },
    // الخصم
    discount: {
      type: Number,
      default: 0
    },
    // الضريبة (نسبة مئوية)
    taxRate: {
      type: Number,
      default: 0
    },
    // الضريبة (قيمة)
    taxAmount: {
      type: Number,
      default: 0
    },
    // الإجمالي النهائي
    totalPrice: {
      type: Number,
      default: 0
    },
    // العملة
    currency: {
      type: String,
      default: 'USD'
    }
  },
  // ========== المساحات المحسوبة ==========
  calculatedAreas: {
    floorArea: { type: Number, default: 0 },
    ceilingArea: { type: Number, default: 0 },
    wallsArea: { type: Number, default: 0 },
    totalArea: { type: Number, default: 0 }
  },
  // حالة المشروع
  status: {
    type: String,
    enum: ['draft', 'in_progress', 'completed', 'archived'],
    default: 'draft'
  },
  // هل المشروع عام (يمكن للآخرين رؤيته)
  isPublic: {
    type: Boolean,
    default: false
  },
  // عدد المشاهدات
  views: {
    type: Number,
    default: 0
  },
  // الوسوم
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// دالة حساب المساحات
projectSchema.methods.calculateAreas = function() {
  const { width, length, height } = this.dimensions;
  
  const floorArea = width * length;
  const ceilingArea = width * length;
  const wallsArea = 2 * (width * height) + 2 * (length * height);
  const totalArea = floorArea + ceilingArea + wallsArea;
  
  this.calculatedAreas = {
    floorArea,
    ceilingArea,
    wallsArea,
    totalArea
  };
  
  return this.calculatedAreas;
};

// دالة حساب السعر الإجمالي
projectSchema.methods.calculateTotalPrice = function() {
  let materialsCost = 0;
  let furnitureCost = 0;
  
  // حساب تكلفة الخامات
  const materialKeys = ['wall', 'floor', 'ceiling', 'leftWall', 'rightWall', 'backWall', 'frontWall'];
  for (const key of materialKeys) {
    if (this.materials && this.materials[key] && this.materials[key].totalPrice) {
      materialsCost += this.materials[key].totalPrice;
    }
  }
  
  // حساب تكلفة الأثاث
  if (this.furniture && this.furniture.length > 0) {
    for (const item of this.furniture) {
      furnitureCost += (item.price || 0) * (item.quantity || 1);
    }
  }
  
  // حساب الإجمالي
  const subtotal = materialsCost + furnitureCost + (this.pricing.additionalCost || 0);
  const afterDiscount = subtotal - (this.pricing.discount || 0);
  const taxAmount = afterDiscount * ((this.pricing.taxRate || 0) / 100);
  const totalPrice = afterDiscount + taxAmount;
  
  this.pricing = {
    ...this.pricing,
    materialsCost,
    furnitureCost,
    taxAmount,
    totalPrice
  };
  
  return this.pricing;
};

// Pre-save middleware لحساب المساحات والأسعار
projectSchema.pre('save', function(next) {
  this.calculateAreas();
  this.calculateTotalPrice();
  next();
});

// Index للبحث
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ status: 1, isPublic: 1 });
projectSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Project', projectSchema);
