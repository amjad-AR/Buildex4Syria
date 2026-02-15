import express from 'express';
import Order from '../models/Order.js';
import Project from '../models/Project.js';
import Furniture from '../models/Furniture.js';
import Material from '../models/Material.js';

const router = express.Router();

// ========== GET Routes ==========

// GET: جلب جميع الطلبات
router.get('/', async (req, res) => {
  try {
    const { userId, projectId, status, paymentStatus, sort, limit = 50, skip = 0 } = req.query;
    let filter = {};
    
    if (userId) filter.userId = userId;
    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'amount_asc') sortOption = { totalAmount: 1 };
    if (sort === 'amount_desc') sortOption = { totalAmount: -1 };
    if (sort === 'orderDate') sortOption = { orderDate: -1 };
    
    const orders = await Order.find(filter)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('userId', 'name email')
      .populate('projectId', 'name screenshot');
    
    const total = await Order.countDocuments(filter);
    
    res.json({
      orders,
      total,
      hasMore: parseInt(skip) + orders.length < total
    });
  } catch (error) {
    console.error('❌ خطأ في جلب الطلبات:', error.message);
    res.status(500).json({ error: 'فشل في جلب الطلبات', details: error.message });
  }
});

// GET: جلب طلب واحد بالتفصيل
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('projectId', 'name description screenshot dimensions pricing');
    
    if (!order) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('❌ خطأ في جلب الطلب:', error.message);
    res.status(500).json({ error: 'فشل في جلب الطلب', details: error.message });
  }
});

// GET: جلب طلب برقم الطلب
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('userId', 'name email phone')
      .populate('projectId', 'name description screenshot');
    
    if (!order) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('❌ خطأ في جلب الطلب:', error.message);
    res.status(500).json({ error: 'فشل في جلب الطلب', details: error.message });
  }
});

// GET: إحصائيات الطلبات
router.get('/meta/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    
    // إحصائيات حسب الحالة
    const statusStats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // إحصائيات حسب حالة الدفع
    const paymentStats = await Order.aggregate([
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
    ]);
    
    // إحصائيات المبيعات
    const salesStats = await Order.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$paidAmount' },
          avgOrderValue: { $avg: '$totalAmount' },
          maxOrder: { $max: '$totalAmount' },
          minOrder: { $min: '$totalAmount' }
        }
      }
    ]);
    
    // طلبات اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });
    
    // طلبات هذا الشهر
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });
    
    res.json({
      total: totalOrders,
      today: todayOrders,
      monthly: monthlyOrders,
      byStatus: statusStats,
      byPayment: paymentStats,
      sales: salesStats[0] || {
        totalRevenue: 0,
        totalPaid: 0,
        avgOrderValue: 0,
        maxOrder: 0,
        minOrder: 0
      }
    });
  } catch (error) {
    console.error('❌ خطأ في جلب الإحصائيات:', error.message);
    res.status(500).json({ error: 'فشل في جلب الإحصائيات', details: error.message });
  }
});

// ========== POST Routes ==========

// POST: إنشاء طلب جديد
router.post('/', async (req, res) => {
  try {
    console.log('📥 استلام طلب جديد...');
    const orderData = req.body;
    
    // جلب تفاصيل العناصر وحساب الأسعار
    if (orderData.items && orderData.items.length > 0) {
      for (const item of orderData.items) {
        if (item.itemId) {
          let itemDetails;
          
          if (item.type === 'furniture') {
            itemDetails = await Furniture.findById(item.itemId);
          } else if (item.type === 'material') {
            itemDetails = await Material.findById(item.itemId);
          }
          
          if (itemDetails) {
            // تعيين الاسم والسعر من قاعدة البيانات إذا لم يتم توفيرهما
            if (!item.name) {
              item.name = itemDetails.name || itemDetails.nameEn;
            }
            if (!item.unitPrice && item.unitPrice !== 0) {
              item.unitPrice = itemDetails.price || itemDetails.pricePerMeter || 0;
            }
          }
        }
        
        // حساب السعر الإجمالي للعنصر
        item.totalPrice = (item.unitPrice || 0) * (item.quantity || 1);
      }
    }
    
    // إنشاء الطلب
    const order = new Order(orderData);
    
    // إضافة الحالة الأولى لسجل الحالات
    order.statusHistory.push({
      status: 'pending',
      timestamp: new Date(),
      note: 'تم إنشاء الطلب'
    });
    
    await order.save();
    
    console.log('✅ تم إنشاء الطلب:', order.orderNumber);
    res.status(201).json(order);
  } catch (error) {
    console.error('❌ خطأ في إنشاء الطلب:', error.message);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        error: 'خطأ في التحقق من البيانات', 
        details: messages.join(', ')
      });
    }
    
    res.status(400).json({ error: 'فشل في إنشاء الطلب', details: error.message });
  }
});

// POST: إنشاء طلب من مشروع
router.post('/from-project/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    
    const orderData = req.body;
    const items = [];
    
    // إضافة الأثاث من المشروع
    if (project.furniture && project.furniture.length > 0) {
      for (const furniture of project.furniture) {
        items.push({
          type: 'furniture',
          itemId: furniture.furnitureId || null,
          name: furniture.name || furniture.nameEn,
          quantity: furniture.quantity || 1,
          unitPrice: furniture.price || 0,
          totalPrice: (furniture.price || 0) * (furniture.quantity || 1)
        });
      }
    }
    
    // إضافة الخامات من المشروع
    const materialKeys = ['wall', 'floor', 'ceiling', 'leftWall', 'rightWall', 'backWall', 'frontWall'];
    for (const key of materialKeys) {
      if (project.materials && project.materials[key] && project.materials[key].materialId) {
        const material = project.materials[key];
        items.push({
          type: 'material',
          itemId: material.materialId || null,
          name: `${material.name || material.nameEn} (${key})`,
          quantity: 1,
          unitPrice: material.totalPrice || 0,
          totalPrice: material.totalPrice || 0,
          notes: `المساحة: ${material.area || 0} م²`
        });
      }
    }
    
    // إنشاء الطلب
    const order = new Order({
      ...orderData,
      projectId: project._id,
      items,
      subtotal: project.pricing?.totalPrice || 0,
      totalAmount: project.pricing?.totalPrice || 0
    });
    
    order.statusHistory.push({
      status: 'pending',
      timestamp: new Date(),
      note: `تم إنشاء الطلب من المشروع: ${project.name}`
    });
    
    await order.save();
    
    console.log('✅ تم إنشاء طلب من المشروع:', order.orderNumber);
    res.status(201).json(order);
  } catch (error) {
    console.error('❌ خطأ في إنشاء الطلب من المشروع:', error.message);
    res.status(400).json({ error: 'فشل في إنشاء الطلب', details: error.message });
  }
});

// ========== PUT Routes ==========

// PUT: تحديث طلب
router.put('/:id', async (req, res) => {
  try {
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    
    const updateData = req.body;
    
    // إعادة حساب أسعار العناصر إذا تم تحديثها
    if (updateData.items) {
      for (const item of updateData.items) {
        item.totalPrice = (item.unitPrice || 0) * (item.quantity || 1);
      }
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('✅ تم تحديث الطلب:', order.orderNumber);
    res.json(order);
  } catch (error) {
    console.error('❌ خطأ في تحديث الطلب:', error.message);
    res.status(400).json({ error: 'فشل في تحديث الطلب', details: error.message });
  }
});

// PUT: تحديث حالة الطلب
router.put('/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    
    // التحقق من صحة الحالة
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'حالة غير صالحة' });
    }
    
    // تحديث الحالة مع التسجيل
    order.updateStatus(status, note || '');
    await order.save();
    
    console.log('✅ تم تحديث حالة الطلب:', order.orderNumber, '->', status);
    res.json(order);
  } catch (error) {
    console.error('❌ خطأ في تحديث حالة الطلب:', error.message);
    res.status(400).json({ error: 'فشل في تحديث الحالة', details: error.message });
  }
});

// PUT: تحديث حالة الدفع
router.put('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus, paidAmount, paymentMethod } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (paidAmount !== undefined) order.paidAmount = paidAmount;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    
    // تحديث حالة الدفع تلقائياً بناءً على المبلغ المدفوع
    if (order.paidAmount >= order.totalAmount) {
      order.paymentStatus = 'paid';
    } else if (order.paidAmount > 0) {
      order.paymentStatus = 'partial';
    }
    
    await order.save();
    
    console.log('✅ تم تحديث حالة الدفع:', order.orderNumber);
    res.json(order);
  } catch (error) {
    console.error('❌ خطأ في تحديث حالة الدفع:', error.message);
    res.status(400).json({ error: 'فشل في تحديث حالة الدفع', details: error.message });
  }
});

// ========== DELETE Routes ==========

// DELETE: حذف طلب
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    
    console.log('✅ تم حذف الطلب:', order.orderNumber);
    res.json({ message: 'تم حذف الطلب بنجاح', orderNumber: order.orderNumber });
  } catch (error) {
    console.error('❌ خطأ في حذف الطلب:', error.message);
    res.status(500).json({ error: 'فشل في حذف الطلب', details: error.message });
  }
});

export default router;

