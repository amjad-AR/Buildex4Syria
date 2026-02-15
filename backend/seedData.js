import Material from './models/Material.js';
import User from './models/User.js';
import Furniture from './models/Furniture.js';

// ========== ألوان الجدران المحسّنة ==========
const WALL_COLORS = [
  // ألوان محايدة
  { name: 'أبيض ناصع', nameEn: 'Pure White', color: '#FFFFFF', category: 'minimal', tags: ['أبيض', 'نظيف', 'محايد', 'white', 'clean'] },
  { name: 'أبيض كريمي', nameEn: 'Cream White', color: '#FFFEF2', category: 'classic', tags: ['كريمي', 'دافئ', 'محايد', 'cream', 'warm'] },
  { name: 'رمادي فاتح', nameEn: 'Light Gray', color: '#E5E7EB', category: 'modern', tags: ['رمادي', 'محايد', 'عصري', 'gray', 'neutral'] },
  { name: 'رمادي دافئ', nameEn: 'Warm Gray', color: '#D6D3D1', category: 'modern', tags: ['رمادي', 'دافئ', 'محايد', 'warm gray'] },
  { name: 'بيج فاتح', nameEn: 'Light Beige', color: '#F5F0E8', category: 'classic', tags: ['بيج', 'محايد', 'كلاسيكي', 'beige', 'neutral'] },
  { name: 'بيج داكن', nameEn: 'Dark Beige', color: '#E8DCC8', category: 'classic', tags: ['بيج', 'ترابي', 'دافئ', 'beige', 'earthy'] },
  
  // ألوان دافئة (مثل الصور المرفقة)
  { name: 'وردي باستيل', nameEn: 'Pastel Pink', color: '#FFE4E6', category: 'modern', tags: ['وردي', 'رومانسي', 'ناعم', 'pink', 'romantic'] },
  { name: 'خوخي فاتح', nameEn: 'Peach', color: '#FFDAB9', category: 'modern', tags: ['خوخي', 'دافئ', 'مشمشي', 'peach', 'warm'] },
  { name: 'مرجاني', nameEn: 'Coral', color: '#FFB6A3', category: 'modern', tags: ['مرجاني', 'حيوي', 'دافئ', 'coral', 'vibrant'] },
  { name: 'أحمر مغبر', nameEn: 'Dusty Red', color: '#C97B7B', category: 'luxury', tags: ['أحمر', 'أنيق', 'دافئ', 'red', 'elegant'] },
  { name: 'نبيذي', nameEn: 'Wine Red', color: '#722F37', category: 'luxury', tags: ['نبيذي', 'فاخر', 'عميق', 'wine', 'luxury'] },
  { name: 'تيراكوتا', nameEn: 'Terracotta', color: '#E2725B', category: 'rustic', tags: ['تيراكوتا', 'ترابي', 'طبيعي', 'terracotta', 'earthy'] },
  
  // ألوان باردة
  { name: 'أزرق سماوي', nameEn: 'Sky Blue', color: '#E0F2FE', category: 'modern', tags: ['أزرق', 'هادئ', 'منعش', 'blue', 'calm'] },
  { name: 'أزرق رمادي', nameEn: 'Blue Gray', color: '#94A3B8', category: 'modern', tags: ['أزرق', 'رمادي', 'عصري', 'blue gray', 'modern'] },
  { name: 'أزرق داكن', nameEn: 'Navy Blue', color: '#1E3A5F', category: 'luxury', tags: ['أزرق', 'داكن', 'فاخر', 'navy', 'dark'] },
  { name: 'تركواز فاتح', nameEn: 'Light Teal', color: '#AFEEEE', category: 'modern', tags: ['تركواز', 'منعش', 'بحري', 'teal', 'fresh'] },
  { name: 'أخضر نعناعي', nameEn: 'Mint Green', color: '#D1FAE5', category: 'modern', tags: ['أخضر', 'نعناعي', 'منعش', 'mint', 'fresh'] },
  { name: 'أخضر زيتوني', nameEn: 'Olive Green', color: '#6B8E23', category: 'rustic', tags: ['أخضر', 'زيتوني', 'طبيعي', 'olive', 'natural'] },
  
  // ألوان بنفسجية (مثل الصورة الأولى)
  { name: 'بنفسجي فاتح', nameEn: 'Light Purple', color: '#E9D5FF', category: 'modern', tags: ['بنفسجي', 'رومانسي', 'ناعم', 'purple', 'romantic'] },
  { name: 'لافندر', nameEn: 'Lavender', color: '#C4B5FD', category: 'modern', tags: ['لافندر', 'هادئ', 'أنيق', 'lavender', 'calm'] },
  { name: 'بنفسجي غامق', nameEn: 'Deep Purple', color: '#581C87', category: 'luxury', tags: ['بنفسجي', 'غامق', 'فاخر', 'purple', 'luxury'] },
  { name: 'موف', nameEn: 'Mauve', color: '#E0B0FF', category: 'classic', tags: ['موف', 'أنثوي', 'ناعم', 'mauve', 'feminine'] },
  
  // ألوان داكنة
  { name: 'رمادي فحمي', nameEn: 'Charcoal', color: '#36454F', category: 'industrial', tags: ['رمادي', 'داكن', 'صناعي', 'charcoal', 'dark'] },
  { name: 'أسود ناعم', nameEn: 'Soft Black', color: '#1F2937', category: 'industrial', tags: ['أسود', 'أنيق', 'عصري', 'black', 'elegant'] },
  { name: 'بني داكن', nameEn: 'Dark Brown', color: '#3E2723', category: 'rustic', tags: ['بني', 'خشبي', 'دافئ', 'brown', 'wooden'] },
  
  // ألوان أرضية
  { name: 'ذهبي فاتح', nameEn: 'Light Gold', color: '#FAF0BE', category: 'luxury', tags: ['ذهبي', 'فاخر', 'دافئ', 'gold', 'luxury'] },
  { name: 'برونزي', nameEn: 'Bronze', color: '#CD7F32', category: 'luxury', tags: ['برونزي', 'معدني', 'فاخر', 'bronze', 'metallic'] }
];

// ========== ألوان الأرضيات ==========
const FLOOR_COLORS = [
  // خشب
  { name: 'باركيه فاتح', nameEn: 'Light Parquet', color: '#DEB887', category: 'classic', tags: ['خشب', 'فاتح', 'طبيعي', 'wood', 'natural'] },
  { name: 'باركيه داكن', nameEn: 'Dark Parquet', color: '#8B4513', category: 'classic', tags: ['خشب', 'داكن', 'أنيق', 'wood', 'elegant'] },
  { name: 'بلوط طبيعي', nameEn: 'Natural Oak', color: '#C4A76B', category: 'classic', tags: ['بلوط', 'طبيعي', 'دافئ', 'oak', 'natural'] },
  { name: 'جوز أمريكي', nameEn: 'Walnut', color: '#5D4E37', category: 'luxury', tags: ['جوز', 'فاخر', 'داكن', 'walnut', 'luxury'] },
  
  // سيراميك
  { name: 'سيراميك أبيض', nameEn: 'White Ceramic', color: '#F8F8FF', category: 'modern', tags: ['سيراميك', 'أبيض', 'نظيف', 'ceramic', 'white'] },
  { name: 'سيراميك رمادي', nameEn: 'Gray Ceramic', color: '#A0AEC0', category: 'modern', tags: ['سيراميك', 'رمادي', 'عصري', 'ceramic', 'gray'] },
  { name: 'سيراميك بيج', nameEn: 'Beige Ceramic', color: '#E8DCC4', category: 'classic', tags: ['سيراميك', 'بيج', 'دافئ', 'ceramic', 'beige'] },
  
  // رخام
  { name: 'رخام أبيض', nameEn: 'White Marble', color: '#F5F5F5', category: 'luxury', tags: ['رخام', 'أبيض', 'فاخر', 'marble', 'luxury'] },
  { name: 'رخام كريمي', nameEn: 'Cream Marble', color: '#FFF8E7', category: 'luxury', tags: ['رخام', 'كريمي', 'أنيق', 'marble', 'elegant'] },
  { name: 'رخام أسود', nameEn: 'Black Marble', color: '#1A1A1A', category: 'luxury', tags: ['رخام', 'أسود', 'فاخر', 'marble', 'black'] },
  { name: 'رخام رمادي', nameEn: 'Gray Marble', color: '#6B7280', category: 'luxury', tags: ['رخام', 'رمادي', 'عصري', 'marble', 'gray'] },
  
  // خرسانة
  { name: 'خرسانة مصقولة', nameEn: 'Polished Concrete', color: '#78716C', category: 'industrial', tags: ['خرسانة', 'صناعي', 'عصري', 'concrete', 'industrial'] },
  { name: 'خرسانة فاتحة', nameEn: 'Light Concrete', color: '#A8A29E', category: 'industrial', tags: ['خرسانة', 'فاتح', 'بسيط', 'concrete', 'minimal'] }
];

// ========== ألوان الأسقف ==========
const CEILING_COLORS = [
  { name: 'أبيض ساطع', nameEn: 'Bright White', color: '#FFFFFF', category: 'minimal', tags: ['أبيض', 'ساطع', 'نظيف', 'white', 'bright'] },
  { name: 'أبيض حليبي', nameEn: 'Milky White', color: '#FFFEF5', category: 'classic', tags: ['أبيض', 'حليبي', 'دافئ', 'milky', 'warm'] },
  { name: 'رمادي فاتح', nameEn: 'Light Gray', color: '#F3F4F6', category: 'modern', tags: ['رمادي', 'فاتح', 'عصري', 'gray', 'modern'] },
  { name: 'بيج فاتح', nameEn: 'Light Beige', color: '#FAF5F0', category: 'classic', tags: ['بيج', 'فاتح', 'دافئ', 'beige', 'warm'] },
  { name: 'خشب طبيعي', nameEn: 'Natural Wood', color: '#D4A574', category: 'rustic', tags: ['خشب', 'طبيعي', 'ريفي', 'wood', 'rustic'] },
  { name: 'رمادي داكن', nameEn: 'Dark Gray', color: '#374151', category: 'industrial', tags: ['رمادي', 'داكن', 'صناعي', 'dark', 'industrial'] }
];

// ========== خامات بصور (Textures) ==========
const WALL_TEXTURES = [
  { name: 'طوب أبيض', nameEn: 'White Brick', textureUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&q=80', category: 'modern', tags: ['طوب', 'أبيض', 'عصري', 'brick', 'white'], tileSize: 1.5 },
  { name: 'طوب أحمر', nameEn: 'Red Brick', textureUrl: 'https://images.unsplash.com/photo-1590273433936-664c5f8a24e1?w=512&q=80', category: 'industrial', tags: ['طوب', 'أحمر', 'صناعي', 'brick', 'red'], tileSize: 1.5 },
  { name: 'خشب داكن', nameEn: 'Dark Wood', textureUrl: 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=512&q=80', category: 'classic', tags: ['خشب', 'داكن', 'كلاسيكي', 'wood', 'dark'], tileSize: 2.0 },
  { name: 'رخام رمادي', nameEn: 'Gray Marble', textureUrl: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=512&q=80', category: 'luxury', tags: ['رخام', 'رمادي', 'فاخر', 'marble', 'gray'], tileSize: 2.5 },
  { name: 'بيتون صناعي', nameEn: 'Industrial Concrete', textureUrl: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=512&q=80', category: 'industrial', tags: ['بيتون', 'صناعي', 'عصري', 'concrete', 'industrial'], tileSize: 3.0 },
  { name: 'حجر طبيعي', nameEn: 'Natural Stone', textureUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=512&q=80', category: 'rustic', tags: ['حجر', 'طبيعي', 'ريفي', 'stone', 'natural'], tileSize: 1.8 }
];

const FLOOR_TEXTURES = [
  { name: 'باركيه كلاسيكي', nameEn: 'Classic Parquet', textureUrl: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=512&q=80', category: 'classic', tags: ['باركيه', 'خشب', 'كلاسيكي', 'parquet', 'wood'], tileSize: 1.2 },
  { name: 'سيراميك أبيض لامع', nameEn: 'Glossy White Tile', textureUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=512&q=80', category: 'modern', tags: ['سيراميك', 'أبيض', 'لامع', 'ceramic', 'glossy'], tileSize: 0.8 },
  { name: 'رخام فاخر', nameEn: 'Luxury Marble', textureUrl: 'https://images.unsplash.com/photo-1604429656485-5a6c589f2f18?w=512&q=80', category: 'luxury', tags: ['رخام', 'فاخر', 'أنيق', 'marble', 'luxury'], tileSize: 2.0 },
  { name: 'خشب اسكندنافي', nameEn: 'Scandinavian Wood', textureUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=512&q=80', category: 'minimal', tags: ['خشب', 'فاتح', 'اسكندنافي', 'wood', 'light'], tileSize: 1.5 }
];

// ========== بيانات الأثاث مع الأسعار ==========
const FURNITURE_DATA = [
  {
    name: 'كنبة عصرية',
    nameEn: 'Modern Sofa',
    category: 'sofa',
    description: 'كنبة عصرية مريحة مصنوعة من القماش الفاخر، مثالية لغرفة المعيشة',
    price: 850,
    currency: 'USD',
    dimensions: { width: 1.8, height: 0.75, depth: 0.85 },
    defaultColor: '#5D4E37',
    availableColors: [
      { name: 'بني داكن', hex: '#5D4E37' },
      { name: 'رمادي', hex: '#4A5568' },
      { name: 'أزرق', hex: '#2B6CB0' },
      { name: 'أخضر', hex: '#2F855A' },
      { name: 'بيج', hex: '#D69E2E' }
    ],
    icon: '🛋️',
    material: 'fabric',
    weight: 45,
    stock: 15,
    tags: ['كنبة', 'صالون', 'جلوس', 'sofa', 'living room'],
    brand: 'Lumina Home',
    displayOrder: 1
  },
  {
    name: 'طاولة طعام خشبية',
    nameEn: 'Wooden Dining Table',
    category: 'table',
    description: 'طاولة طعام أنيقة من خشب البلوط الطبيعي، تتسع لـ 6 أشخاص',
    price: 650,
    currency: 'USD',
    dimensions: { width: 1.5, height: 0.75, depth: 1.0 },
    defaultColor: '#8B7355',
    availableColors: [
      { name: 'خشب طبيعي', hex: '#8B7355' },
      { name: 'جوز', hex: '#5D4E37' },
      { name: 'أبيض', hex: '#F5F5F5' },
      { name: 'أسود', hex: '#1A1A1A' }
    ],
    icon: '🪑',
    material: 'wood',
    weight: 35,
    stock: 20,
    tags: ['طاولة', 'طعام', 'خشب', 'table', 'dining'],
    brand: 'Lumina Home',
    displayOrder: 2
  },
  {
    name: 'كرسي مكتب مريح',
    nameEn: 'Ergonomic Office Chair',
    category: 'chair',
    description: 'كرسي مكتب مريح مع دعم للظهر، قابل للتعديل',
    price: 280,
    currency: 'USD',
    dimensions: { width: 0.65, height: 1.2, depth: 0.65 },
    defaultColor: '#1A1A1A',
    availableColors: [
      { name: 'أسود', hex: '#1A1A1A' },
      { name: 'رمادي', hex: '#4A5568' },
      { name: 'أزرق', hex: '#2B6CB0' },
      { name: 'أحمر', hex: '#C53030' }
    ],
    icon: '💺',
    material: 'mesh',
    weight: 12,
    stock: 50,
    tags: ['كرسي', 'مكتب', 'عمل', 'chair', 'office'],
    brand: 'ErgoMax',
    displayOrder: 3
  },
  {
    name: 'سرير نوم فاخر',
    nameEn: 'Luxury Bed Frame',
    category: 'bed',
    description: 'سرير نوم فاخر مع لوح أمامي منجد، مقاس كينج',
    price: 1200,
    currency: 'USD',
    dimensions: { width: 2.0, height: 1.2, depth: 2.2 },
    defaultColor: '#4A5568',
    availableColors: [
      { name: 'رمادي', hex: '#4A5568' },
      { name: 'بيج', hex: '#D69E2E' },
      { name: 'أزرق داكن', hex: '#1A365D' },
      { name: 'أبيض', hex: '#F5F5F5' }
    ],
    icon: '🛏️',
    material: 'fabric',
    weight: 80,
    stock: 10,
    tags: ['سرير', 'نوم', 'غرفة نوم', 'bed', 'bedroom'],
    brand: 'Lumina Home',
    displayOrder: 4
  },
  {
    name: 'خزانة ملابس كبيرة',
    nameEn: 'Large Wardrobe',
    category: 'cabinet',
    description: 'خزانة ملابس واسعة بأربعة أبواب مع مرآة، تصميم عصري',
    price: 950,
    currency: 'USD',
    dimensions: { width: 2.0, height: 2.2, depth: 0.6 },
    defaultColor: '#2D3748',
    availableColors: [
      { name: 'رمادي داكن', hex: '#2D3748' },
      { name: 'أبيض', hex: '#F5F5F5' },
      { name: 'خشب بلوط', hex: '#8B7355' },
      { name: 'جوز', hex: '#5D4E37' }
    ],
    icon: '🗄️',
    material: 'wood',
    weight: 120,
    stock: 8,
    tags: ['خزانة', 'ملابس', 'تخزين', 'wardrobe', 'storage'],
    brand: 'Lumina Home',
    displayOrder: 5
  },
  {
    name: 'مصباح أرضي حديث',
    nameEn: 'Modern Floor Lamp',
    category: 'lamp',
    description: 'مصباح أرضي بتصميم عصري، إضاءة LED قابلة للتعديل',
    price: 180,
    currency: 'USD',
    dimensions: { width: 0.35, height: 1.6, depth: 0.35 },
    defaultColor: '#ECC94B',
    availableColors: [
      { name: 'ذهبي', hex: '#ECC94B' },
      { name: 'أسود', hex: '#1A1A1A' },
      { name: 'أبيض', hex: '#F5F5F5' },
      { name: 'نحاسي', hex: '#B7791F' }
    ],
    icon: '💡',
    material: 'metal',
    weight: 5,
    stock: 30,
    tags: ['مصباح', 'إضاءة', 'ديكور', 'lamp', 'lighting'],
    brand: 'LightArt',
    displayOrder: 6
  }
];

// ========== بيانات الأدمن الافتراضية ==========
const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@buildex.com',
  password: 'Admin@123456',
  role: 'admin',
  isActive: true
};

// ========== دالة إنشاء المستخدم الأدمن ==========
async function seedAdminUser() {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log(`👤 الأدمن موجود: ${existingAdmin.email}`);
      return;
    }

    const admin = new User(DEFAULT_ADMIN);
    await admin.save();
    
    console.log('✅ تم إنشاء حساب الأدمن بنجاح!');
    console.log(`   📧 البريد الإلكتروني: ${DEFAULT_ADMIN.email}`);
    console.log(`   🔐 كلمة السر: ${DEFAULT_ADMIN.password}`);
    console.log('   ⚠️  يُنصح بتغيير كلمة السر بعد أول تسجيل دخول');
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء حساب الأدمن:', error.message);
  }
}

// ========== دالة ملء بيانات الأثاث ==========
async function seedFurniture() {
  try {
    const existingCount = await Furniture.countDocuments();
    
    if (existingCount > 0) {
      console.log(`🪑 قاعدة البيانات تحتوي على ${existingCount} قطعة أثاث`);
      return;
    }

    console.log('🪑 جاري إضافة بيانات الأثاث...');
    
    await Furniture.insertMany(FURNITURE_DATA);
    
    console.log(`✅ تم إضافة ${FURNITURE_DATA.length} قطعة أثاث بنجاح!`);
    
    // حساب مجموع الأسعار
    const totalValue = FURNITURE_DATA.reduce((sum, item) => sum + item.price, 0);
    console.log(`   💰 إجمالي قيمة الأثاث: $${totalValue}`);
    
  } catch (error) {
    console.error('❌ خطأ في إضافة بيانات الأثاث:', error.message);
  }
}

// ========== دالة ملء قاعدة البيانات ==========
export async function seedDatabase() {
  try {
    // إنشاء حساب الأدمن
    await seedAdminUser();
    
    // إضافة بيانات الأثاث
    await seedFurniture();
    
    const existingCount = await Material.countDocuments();
    
    if (existingCount > 0) {
      console.log(`📊 قاعدة البيانات تحتوي على ${existingCount} خامة`);
      return;
    }

    console.log('🌱 جاري ملء قاعدة البيانات بالخامات...');
    
    const materials = [];
    let order = 0;

    // أسعار حسب الفئة (سعر المتر المربع بالدولار)
    const PRICES_BY_CATEGORY = {
      wall: {
        minimal: 8,
        modern: 12,
        classic: 15,
        luxury: 25,
        industrial: 18,
        rustic: 14
      },
      floor: {
        minimal: 20,
        modern: 35,
        classic: 45,
        luxury: 85,
        industrial: 30,
        rustic: 40
      },
      ceiling: {
        minimal: 10,
        modern: 15,
        classic: 20,
        luxury: 35,
        industrial: 25,
        rustic: 22
      }
    };

    // إضافة ألوان الجدران مع الأسعار
    for (const wall of WALL_COLORS) {
      const basePrice = PRICES_BY_CATEGORY.wall[wall.category] || 10;
      materials.push({
        name: wall.name,
        nameEn: wall.nameEn,
        type: 'wall',
        category: wall.category,
        materialType: 'color',
        color: wall.color,
        roughness: 0.8,
        metalness: 0,
        tileSize: 2,
        tags: wall.tags,
        isActive: true,
        displayOrder: order++,
        pricePerMeter: basePrice,
        currency: 'USD',
        stock: Math.floor(Math.random() * 500) + 100,
        brand: 'Lumina Colors'
      });
    }

    // إضافة خامات الجدران (صور) مع الأسعار
    for (const wall of WALL_TEXTURES) {
      const basePrice = (PRICES_BY_CATEGORY.wall[wall.category] || 10) * 1.5; // نسيج أغلى
      materials.push({
        name: wall.name,
        nameEn: wall.nameEn,
        type: 'wall',
        category: wall.category,
        materialType: 'texture',
        textureUrl: wall.textureUrl,
        roughness: 0.7,
        metalness: 0.1,
        tileSize: wall.tileSize,
        tags: wall.tags,
        isActive: true,
        displayOrder: order++,
        pricePerMeter: basePrice,
        currency: 'USD',
        stock: Math.floor(Math.random() * 300) + 50,
        brand: 'Lumina Textures'
      });
    }

    // إضافة ألوان الأرضيات مع الأسعار
    for (const floor of FLOOR_COLORS) {
      const basePrice = PRICES_BY_CATEGORY.floor[floor.category] || 25;
      materials.push({
        name: floor.name,
        nameEn: floor.nameEn,
        type: 'floor',
        category: floor.category,
        materialType: 'color',
        color: floor.color,
        roughness: 0.5,
        metalness: 0.2,
        tileSize: 1.5,
        tags: floor.tags,
        isActive: true,
        displayOrder: order++,
        pricePerMeter: basePrice,
        currency: 'USD',
        stock: Math.floor(Math.random() * 400) + 100,
        brand: 'Lumina Floors'
      });
    }

    // إضافة خامات الأرضيات (صور) مع الأسعار
    for (const floor of FLOOR_TEXTURES) {
      const basePrice = (PRICES_BY_CATEGORY.floor[floor.category] || 25) * 1.3;
      materials.push({
        name: floor.name,
        nameEn: floor.nameEn,
        type: 'floor',
        category: floor.category,
        materialType: 'texture',
        textureUrl: floor.textureUrl,
        roughness: 0.6,
        metalness: 0.2,
        tileSize: floor.tileSize,
        tags: floor.tags,
        isActive: true,
        displayOrder: order++,
        pricePerMeter: basePrice,
        currency: 'USD',
        stock: Math.floor(Math.random() * 200) + 50,
        brand: 'Lumina Premium'
      });
    }

    // إضافة ألوان الأسقف مع الأسعار
    for (const ceiling of CEILING_COLORS) {
      const basePrice = PRICES_BY_CATEGORY.ceiling[ceiling.category] || 12;
      materials.push({
        name: ceiling.name,
        nameEn: ceiling.nameEn,
        type: 'ceiling',
        category: ceiling.category,
        materialType: 'color',
        color: ceiling.color,
        roughness: 0.9,
        metalness: 0,
        tileSize: 3,
        tags: ceiling.tags,
        isActive: true,
        displayOrder: order++,
        pricePerMeter: basePrice,
        currency: 'USD',
        stock: Math.floor(Math.random() * 300) + 100,
        brand: 'Lumina Ceilings'
      });
    }

    // حفظ جميع الخامات
    await Material.insertMany(materials);
    
    // حساب إجمالي قيمة الخامات
    const totalMaterialsValue = materials.reduce((sum, m) => sum + (m.pricePerMeter || 0), 0);
    
    console.log(`✅ تم إضافة ${materials.length} خامة بنجاح!`);
    console.log(`   - جدران: ${WALL_COLORS.length + WALL_TEXTURES.length}`);
    console.log(`   - أرضيات: ${FLOOR_COLORS.length + FLOOR_TEXTURES.length}`);
    console.log(`   - أسقف: ${CEILING_COLORS.length}`);
    console.log(`   💰 متوسط سعر المتر: $${(totalMaterialsValue / materials.length).toFixed(2)}`);

  } catch (error) {
    console.error('❌ خطأ في ملء قاعدة البيانات:', error.message);
  }
}

// ========== دالة إعادة تعيين قاعدة البيانات ==========
export async function resetDatabase() {
  try {
    await Material.deleteMany({});
    console.log('🗑️ تم حذف جميع الخامات');
    await seedDatabase();
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين قاعدة البيانات:', error.message);
  }
}

// ========== دالة إعادة تعيين الأدمن ==========
export async function resetAdmin() {
  try {
    // حذف جميع حسابات الأدمن القديمة
    const deletedCount = await User.deleteMany({ role: 'admin' });
    console.log(`🗑️ تم حذف ${deletedCount.deletedCount} حساب أدمن قديم`);
    
    // إنشاء حساب أدمن جديد
    const admin = new User(DEFAULT_ADMIN);
    await admin.save();
    
    console.log('✅ تم إنشاء حساب الأدمن بنجاح!');
    console.log(`   📧 البريد الإلكتروني: ${DEFAULT_ADMIN.email}`);
    console.log(`   🔐 كلمة السر: ${DEFAULT_ADMIN.password}`);
    console.log('   ⚠️  يُنصح بتغيير كلمة السر بعد أول تسجيل دخول');
    
    return {
      email: DEFAULT_ADMIN.email,
      password: DEFAULT_ADMIN.password,
      username: DEFAULT_ADMIN.username
    };
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين الأدمن:', error.message);
    throw error;
  }
}

// ========== دالة إعادة تعيين الأثاث ==========
export async function resetFurniture() {
  try {
    await Furniture.deleteMany({});
    console.log('🗑️ تم حذف جميع قطع الأثاث');
    await seedFurniture();
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين الأثاث:', error.message);
  }
}

