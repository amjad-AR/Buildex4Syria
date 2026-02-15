import express from 'express';
import Material from '../models/Material.js';

const router = express.Router();

// ========== GET: جلب جميع الخامات ==========
router.get('/', async (req, res) => {
  try {
    const { type, category, isActive, minPrice, maxPrice, sort, hasPrice } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    // فلترة بالسعر
    if (minPrice || maxPrice) {
      filter.pricePerMeter = {};
      if (minPrice) filter.pricePerMeter.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerMeter.$lte = parseFloat(maxPrice);
    }
    
    // فقط الخامات التي لها سعر
    if (hasPrice === 'true') {
      filter.pricePerMeter = { $gt: 0 };
    }
    
    // الترتيب
    let sortOption = { displayOrder: 1, createdAt: -1 };
    if (sort === 'price_asc') sortOption = { pricePerMeter: 1 };
    if (sort === 'price_desc') sortOption = { pricePerMeter: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    
    const materials = await Material.find(filter).sort(sortOption);
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب الخامات', details: error.message });
  }
});

// ========== GET: جلب خامة واحدة ==========
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'الخامة غير موجودة' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب الخامة', details: error.message });
  }
});

// ========== POST: إضافة خامة جديدة ==========
router.post('/', async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: 'فشل في إنشاء الخامة', details: error.message });
  }
});

// ========== PUT: تعديل خامة ==========
router.put('/:id', async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!material) {
      return res.status(404).json({ error: 'الخامة غير موجودة' });
    }
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: 'فشل في تعديل الخامة', details: error.message });
  }
});

// ========== DELETE: حذف خامة ==========
router.delete('/:id', async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'الخامة غير موجودة' });
    }
    res.json({ message: 'تم حذف الخامة بنجاح', material });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف الخامة', details: error.message });
  }
});

// ========== GET: جلب الخامات حسب النوع (walls, floors, ceilings) ==========
router.get('/type/:type', async (req, res) => {
  try {
    const materials = await Material.find({ 
      type: req.params.type,
      isActive: true 
    }).sort({ displayOrder: 1 });
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب الخامات', details: error.message });
  }
});

// ========== GET: البحث في الخامات ==========
router.get('/search/:query', async (req, res) => {
  try {
    const materials = await Material.find({
      $text: { $search: req.params.query },
      isActive: true
    }).sort({ score: { $meta: 'textScore' } });
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'فشل في البحث', details: error.message });
  }
});

// ========== PATCH: تبديل حالة النشاط ==========
router.patch('/:id/toggle-active', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'الخامة غير موجودة' });
    }
    
    material.isActive = !material.isActive;
    await material.save();
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تبديل الحالة', details: error.message });
  }
});

// ========== PATCH: تحديث سعر خامة ==========
router.patch('/:id/price', async (req, res) => {
  try {
    const { pricePerMeter, currency } = req.body;
    
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'الخامة غير موجودة' });
    }
    
    if (pricePerMeter !== undefined) material.pricePerMeter = pricePerMeter;
    if (currency) material.currency = currency;
    
    await material.save();
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث السعر', details: error.message });
  }
});

// ========== PUT: تحديث أسعار متعددة ==========
router.put('/bulk-price-update', async (req, res) => {
  try {
    const { updates } = req.body; // [{id, pricePerMeter}, ...]
    
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: 'يرجى توفير قائمة التحديثات' });
    }
    
    const results = [];
    for (const update of updates) {
      const material = await Material.findByIdAndUpdate(
        update.id,
        { pricePerMeter: update.pricePerMeter, currency: update.currency || 'USD' },
        { new: true }
      );
      if (material) results.push(material);
    }
    
    res.json({ message: `تم تحديث ${results.length} خامة`, materials: results });
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث الأسعار', details: error.message });
  }
});

// ========== GET: إحصائيات الأسعار ==========
router.get('/stats/prices', async (req, res) => {
  try {
    const stats = await Material.aggregate([
      { $match: { pricePerMeter: { $gt: 0 } } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgPrice: { $avg: '$pricePerMeter' },
          minPrice: { $min: '$pricePerMeter' },
          maxPrice: { $max: '$pricePerMeter' }
        }
      }
    ]);
    
    const totalWithPrice = await Material.countDocuments({ pricePerMeter: { $gt: 0 } });
    const totalWithoutPrice = await Material.countDocuments({ $or: [{ pricePerMeter: 0 }, { pricePerMeter: { $exists: false } }] });
    
    res.json({
      byType: stats,
      totals: {
        withPrice: totalWithPrice,
        withoutPrice: totalWithoutPrice
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== POST: حساب تكلفة مساحة معينة ==========
router.post('/:id/calculate-cost', async (req, res) => {
  try {
    const { area } = req.body;
    
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'الخامة غير موجودة' });
    }
    
    const totalCost = (material.pricePerMeter || 0) * (area || 0);
    
    res.json({
      material: {
        id: material._id,
        name: material.name,
        pricePerMeter: material.pricePerMeter || 0,
        currency: material.currency || 'USD'
      },
      area,
      totalCost,
      currency: material.currency || 'USD'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

