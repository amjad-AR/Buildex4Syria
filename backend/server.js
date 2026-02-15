import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import materialsRouter from './routes/materials.js';
import projectsRouter from './routes/projects.js';
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import furnitureRouter from './routes/furniture.js';
import ordersRouter from './routes/orders.js';
import { seedDatabase } from './seedData.js';
import dotenv from 'dotenv';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Middleware - Allow all origins for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/materials', materialsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/furniture', furnitureRouter);
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lumina Backend is running! 🏠' });
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const Material = (await import('./models/Material.js')).default;
    const Project = (await import('./models/Project.js')).default;
    const User = (await import('./models/User.js')).default;
    const Furniture = (await import('./models/Furniture.js')).default;
    const Order = (await import('./models/Order.js')).default;

    const stats = {
      materials: await Material.countDocuments(),
      projects: await Project.countDocuments(),
      users: await User.countDocuments(),
      furniture: await Furniture.countDocuments(),
      orders: await Order.countDocuments(),
      walls: await Material.countDocuments({ type: 'wall' }),
      floors: await Material.countDocuments({ type: 'floor' }),
      ceilings: await Material.countDocuments({ type: 'ceiling' })
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB
console.log('🔄 Connecting to MongoDB...');
mongoose.connect(config.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${config.MONGODB_URI}`);

    // Seed database with initial data
    await seedDatabase();

    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('');
    console.log('💡 تأكد من تشغيل MongoDB على المنفذ 27017');
    console.log('   أو قم بتثبيت MongoDB من: https://www.mongodb.com/try/download/community');
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'حدث خطأ في الخادم', details: err.message });
});
