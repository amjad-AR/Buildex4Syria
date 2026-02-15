import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config.js';
import { authenticate, authorize, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// إنشاء حساب Admin افتراضي
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@lumina.studio' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        email: 'admin@lumina.studio',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ تم إنشاء حساب Admin الافتراضي');
      console.log('   البريد: admin@lumina.studio');
      console.log('   كلمة المرور: admin123');
    } else {
      console.log('👤 حساب Admin موجود بالفعل');
    }
  } catch (error) {
    console.log('خطأ في إنشاء Admin:', error.message);
  }
};

// تشغيل إنشاء Admin عند بدء الخادم
createDefaultAdmin();

// POST: إعادة تعيين حساب Admin
router.post('/reset-admin', async (req, res) => {
  try {
    // حذف Admin القديم
    await User.deleteOne({ email: 'admin@lumina.studio' });
    
    // إنشاء Admin جديد
    const admin = new User({
      username: 'admin',
      email: 'admin@lumina.studio',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    
    res.json({ message: 'تم إعادة تعيين حساب Admin بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'فشل في إعادة تعيين Admin', details: error.message });
  }
});

// POST: تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ error: 'الحساب معطل' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'فشل في تسجيل الدخول', details: error.message });
  }
});

// POST: إنشاء حساب جديد
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'البريد أو اسم المستخدم مستخدم بالفعل' });
    }
    
    const user = new User({ username, email, password, role: 'user' });
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'فشل في إنشاء الحساب', details: error.message });
  }
});

// POST: تسجيل مزود خدمة جديد
router.post('/register-provider', async (req, res) => {
  try {
    const { username, email, password, companyName, phone, address, description } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'البريد أو اسم المستخدم مستخدم بالفعل' });
    }
    
    const user = new User({ 
      username, 
      email, 
      password, 
      role: 'provider',
      companyName,
      phone,
      address,
      description,
      isVerified: false // Providers need admin verification
    });
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'فشل في إنشاء حساب المزود', details: error.message });
  }
});

// GET: التحقق من التوكن
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'التوكن غير موجود' });
    }
    
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'التوكن غير صالح' });
  }
});

// GET: قائمة جميع المستخدمين (Admin فقط)
router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب المستخدمين', details: error.message });
  }
});

// GET: مستخدم واحد
router.get('/users/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب المستخدم', details: error.message });
  }
});

// PUT: تحديث مستخدم
router.put('/users/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { username, email, role, isActive } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    // تحديث الحقول
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    
    await user.save();
    
    const updatedUser = await User.findById(req.params.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث المستخدم', details: error.message });
  }
});

// DELETE: حذف مستخدم
router.delete('/users/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    // منع حذف الحساب الخاص
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ error: 'لا يمكنك حذف حسابك الخاص' });
    }
    
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'تم حذف المستخدم بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف المستخدم', details: error.message });
  }
});

// POST: إنشاء مستخدم جديد (Admin فقط)
router.post('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'البريد أو اسم المستخدم مستخدم بالفعل' });
    }
    
    const user = new User({ 
      username, 
      email, 
      password: password || 'default123',
      role: role || 'user',
      isActive: true
    });
    await user.save();
    
    const newUser = await User.findById(user._id).select('-password');
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'فشل في إنشاء المستخدم', details: error.message });
  }
});

export default router;

