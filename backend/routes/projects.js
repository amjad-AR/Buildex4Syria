import express from 'express';
import Project from '../models/Project.js';
import Material from '../models/Material.js';
import Furniture from '../models/Furniture.js';

const router = express.Router();

// GET: جلب جميع المشاريع
router.get('/', async (req, res) => {
  try {
    const { userId, status, isPublic, sort } = req.query;
    let filter = {};
    
    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    if (isPublic !== undefined) filter.isPublic = isPublic === 'true';
    
    let sortOption = { updatedAt: -1 };
    if (sort === 'price_asc') sortOption = { 'pricing.totalPrice': 1 };
    if (sort === 'price_desc') sortOption = { 'pricing.totalPrice': -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    
    const projects = await Project.find(filter).sort(sortOption);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب المشاريع', details: error.message });
  }
});

// GET: المشاريع التي لديها screenshots (للعرض في الصفحة الرئيسية)
// يجب أن يكون قبل /:id
router.get('/with-screenshots', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // جلب المشاريع التي لديها screenshot غير فارغ
    const projects = await Project.find({
      screenshot: { $exists: true, $ne: '', $ne: null }
    })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .select('name description screenshot pricing.totalPrice views createdAt');
    
    res.json({
      projects,
      total: projects.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: جلب مشروع واحد
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    
    // زيادة عدد المشاهدات
    project.views += 1;
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب المشروع', details: error.message });
  }
});

// POST: إنشاء مشروع جديد مع حساب الأسعار
router.post('/', async (req, res) => {
  try {
    console.log('📥 استلام طلب إنشاء مشروع جديد...');
    const projectData = req.body;
    
    // التحقق من البيانات المطلوبة
    if (!projectData.name || projectData.name.trim() === '') {
      return res.status(400).json({ error: 'اسم المشروع مطلوب', details: 'يرجى إدخال اسم للمشروع' });
    }
    
    // حساب المساحات
    const { width, length, height } = projectData.dimensions || { width: 5, length: 5, height: 3 };
    const floorArea = width * length;
    const ceilingArea = width * length;
    const wallsArea = 2 * (width * height) + 2 * (length * height);
    
    projectData.calculatedAreas = {
      floorArea,
      ceilingArea,
      wallsArea,
      totalArea: floorArea + ceilingArea + wallsArea
    };
    
    // حساب تكاليف الخامات إذا تم توفير معرفات الخامات
    if (projectData.materialIds) {
      let materialsCost = 0;
      const materials = {};
      
      for (const [key, materialId] of Object.entries(projectData.materialIds)) {
        if (materialId) {
          const material = await Material.findById(materialId);
          if (material) {
            let area = 0;
            if (key === 'floor') area = floorArea;
            else if (key === 'ceiling') area = ceilingArea;
            else area = wallsArea / 4; // تقسيم مساحة الجدران على 4
            
            const totalPrice = (material.pricePerMeter || 0) * area;
            materialsCost += totalPrice;
            
            materials[key] = {
              materialId: material._id,
              name: material.name,
              nameEn: material.nameEn,
              type: material.type,
              materialType: material.materialType,
              value: material.materialType === 'texture' ? material.textureUrl : material.color,
              pricePerMeter: material.pricePerMeter || 0,
              area,
              totalPrice
            };
          }
        }
      }
      
      projectData.materials = materials;
      projectData.pricing = {
        ...projectData.pricing,
        materialsCost
      };
    }
    
    // حساب تكاليف الأثاث
    if (projectData.furniture && projectData.furniture.length > 0) {
      let furnitureCost = 0;
      const furnitureWithPrices = [];
      
      for (const item of projectData.furniture) {
        let price = item.price || 0;
        
        // جلب السعر من قاعدة البيانات إذا كان لدينا furnitureId
        if (item.furnitureId) {
          const furnitureItem = await Furniture.findById(item.furnitureId);
          if (furnitureItem) {
            price = furnitureItem.price;
            item.price = price;
            item.nameEn = furnitureItem.nameEn;
          }
        }
        
        furnitureCost += price * (item.quantity || 1);
        furnitureWithPrices.push(item);
      }
      
      projectData.furniture = furnitureWithPrices;
      projectData.pricing = {
        ...projectData.pricing,
        furnitureCost
      };
    }
    
    // حساب الإجمالي
    const pricing = projectData.pricing || {};
    const subtotal = (pricing.materialsCost || 0) + (pricing.furnitureCost || 0) + (pricing.additionalCost || 0);
    const afterDiscount = subtotal - (pricing.discount || 0);
    const taxAmount = afterDiscount * ((pricing.taxRate || 0) / 100);
    
    projectData.pricing = {
      ...pricing,
      taxAmount,
      totalPrice: afterDiscount + taxAmount,
      currency: pricing.currency || 'USD'
    };
    
    console.log('📝 إنشاء المشروع:', projectData.name);
    const project = new Project(projectData);
    await project.save();
    
    console.log('✅ تم حفظ المشروع بنجاح:', project._id);
    res.status(201).json(project);
  } catch (error) {
    console.error('❌ خطأ في إنشاء المشروع:', error.message);
    
    // معالجة أخطاء التحقق من Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        error: 'خطأ في التحقق من البيانات', 
        details: messages.join(', '),
        validationErrors: error.errors
      });
    }
    
    res.status(400).json({ error: 'فشل في إنشاء المشروع', details: error.message });
  }
});

// PUT: تعديل مشروع مع إعادة حساب الأسعار
router.put('/:id', async (req, res) => {
  try {
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    
    const projectData = req.body;
    
    // إعادة حساب المساحات إذا تغيرت الأبعاد
    if (projectData.dimensions) {
      const { width, length, height } = projectData.dimensions;
      projectData.calculatedAreas = {
        floorArea: width * length,
        ceilingArea: width * length,
        wallsArea: 2 * (width * height) + 2 * (length * height),
        totalArea: (width * length) * 2 + 2 * (width * height) + 2 * (length * height)
      };
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'فشل في تعديل المشروع', details: error.message });
  }
});

// DELETE: حذف مشروع
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    res.json({ message: 'تم حذف المشروع بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف المشروع', details: error.message });
  }
});

// POST: حساب سعر مشروع بدون حفظه
router.post('/calculate-price', async (req, res) => {
  try {
    const { dimensions, materialIds, furniture, additionalCost, discount, taxRate } = req.body;
    
    const { width, length, height } = dimensions || { width: 5, length: 5, height: 3 };
    const floorArea = width * length;
    const ceilingArea = width * length;
    const wallsArea = 2 * (width * height) + 2 * (length * height);
    
    let materialsCost = 0;
    const materialsDetails = [];
    
    // حساب تكاليف الخامات
    if (materialIds) {
      for (const [key, materialId] of Object.entries(materialIds)) {
        if (materialId) {
          const material = await Material.findById(materialId);
          if (material) {
            let area = 0;
            if (key === 'floor') area = floorArea;
            else if (key === 'ceiling') area = ceilingArea;
            else area = wallsArea / 4;
            
            const totalPrice = (material.pricePerMeter || 0) * area;
            materialsCost += totalPrice;
            
            materialsDetails.push({
              key,
              name: material.name,
              pricePerMeter: material.pricePerMeter || 0,
              area: area.toFixed(2),
              totalPrice: totalPrice.toFixed(2)
            });
          }
        }
      }
    }
    
    // حساب تكاليف الأثاث
    let furnitureCost = 0;
    const furnitureDetails = [];
    
    if (furniture && furniture.length > 0) {
      for (const item of furniture) {
        let price = item.price || 0;
        let name = item.name;
        
        if (item.furnitureId) {
          const furnitureItem = await Furniture.findById(item.furnitureId);
          if (furnitureItem) {
            price = furnitureItem.price;
            name = furnitureItem.name;
          }
        }
        
        const quantity = item.quantity || 1;
        const totalPrice = price * quantity;
        furnitureCost += totalPrice;
        
        furnitureDetails.push({
          name,
          price,
          quantity,
          totalPrice
        });
      }
    }
    
    // حساب الإجمالي
    const subtotal = materialsCost + furnitureCost + (additionalCost || 0);
    const afterDiscount = subtotal - (discount || 0);
    const taxAmount = afterDiscount * ((taxRate || 0) / 100);
    const totalPrice = afterDiscount + taxAmount;
    
    res.json({
      areas: {
        floorArea: floorArea.toFixed(2),
        ceilingArea: ceilingArea.toFixed(2),
        wallsArea: wallsArea.toFixed(2),
        totalArea: (floorArea + ceilingArea + wallsArea).toFixed(2)
      },
      materials: materialsDetails,
      furniture: furnitureDetails,
      pricing: {
        materialsCost: materialsCost.toFixed(2),
        furnitureCost: furnitureCost.toFixed(2),
        additionalCost: (additionalCost || 0).toFixed(2),
        subtotal: subtotal.toFixed(2),
        discount: (discount || 0).toFixed(2),
        afterDiscount: afterDiscount.toFixed(2),
        taxRate: taxRate || 0,
        taxAmount: taxAmount.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
        currency: 'USD'
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'فشل في حساب السعر', details: error.message });
  }
});

// GET: إحصائيات المشاريع
router.get('/meta/stats', async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const publicProjects = await Project.countDocuments({ isPublic: true });
    
    const statusStats = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const priceStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$pricing.totalPrice' },
          maxPrice: { $max: '$pricing.totalPrice' },
          minPrice: { $min: '$pricing.totalPrice' },
          totalValue: { $sum: '$pricing.totalPrice' }
        }
      }
    ]);
    
    res.json({
      total: totalProjects,
      public: publicProjects,
      byStatus: statusStats,
      pricing: priceStats[0] || { avgPrice: 0, maxPrice: 0, minPrice: 0, totalValue: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: المشاريع العامة
router.get('/public/gallery', async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    
    const projects = await Project.find({ isPublic: true })
      .sort({ views: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('name description screenshot dimensions pricing.totalPrice views createdAt');
    
    const total = await Project.countDocuments({ isPublic: true });
    
    res.json({
      projects,
      total,
      hasMore: parseInt(skip) + projects.length < total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
