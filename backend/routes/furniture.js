import express from 'express';
import Furniture from '../models/Furniture.js';

const router = express.Router();

// الحصول على جميع الأثاث
router.get('/', async (req, res) => {
  try {
    const { category, isActive, minPrice, maxPrice, sort } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    let sortOption = { displayOrder: 1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    
    const furniture = await Furniture.find(query).sort(sortOption);
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// الحصول على أثاث واحد
router.get('/:id', async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) {
      return res.status(404).json({ error: 'الأثاث غير موجود' });
    }
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إضافة أثاث جديد
router.post('/', async (req, res) => {
  try {
    const furniture = new Furniture(req.body);
    await furniture.save();
    res.status(201).json(furniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// تحديث أثاث
router.put('/:id', async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!furniture) {
      return res.status(404).json({ error: 'الأثاث غير موجود' });
    }
    res.json(furniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// حذف أثاث
router.delete('/:id', async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndDelete(req.params.id);
    if (!furniture) {
      return res.status(404).json({ error: 'الأثاث غير موجود' });
    }
    res.json({ message: 'تم حذف الأثاث بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// الحصول على الفئات المتاحة
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Furniture.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// البحث في الأثاث
router.get('/search/:query', async (req, res) => {
  try {
    const furniture = await Furniture.find(
      { $text: { $search: req.params.query }, isActive: true },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إحصائيات الأثاث
router.get('/meta/stats', async (req, res) => {
  try {
    const stats = await Furniture.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    
    const total = await Furniture.countDocuments();
    const active = await Furniture.countDocuments({ isActive: true });
    
    res.json({
      total,
      active,
      byCategory: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

