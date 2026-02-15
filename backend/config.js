// Configuration file for Lumina Backend

// ⚠️ استخدام قاعدة البيانات المحلية مباشرة (تجاوز .env)
const USE_LOCAL_DB = true; // غيّر إلى false للاتصال بـ MongoDB Atlas

export const config = {
  // MongoDB connection string - الاتصال بقاعدة البيانات المحلية
  MONGODB_URI: USE_LOCAL_DB 
    ? 'mongodb://localhost:27017/lumina_studio'
    : (process.env.MONGODB_URI || 'mongodb://localhost:27017/lumina_studio'),
  
  // JWT secret for authentication
  JWT_SECRET: process.env.JWT_SECRET || 'lumina_secret_key_2024_very_secure',
  
  // Server port
  PORT: process.env.PORT || 5000,
  
  // Upload settings
  UPLOAD_DIR: 'uploads',
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
};

// Log configuration on startup
console.log('');
console.log('📋 Configuration loaded:');
console.log(`   - MongoDB: ${USE_LOCAL_DB ? '🏠 Local' : '☁️ Cloud'}`);
console.log(`   - URI: ${config.MONGODB_URI}`);
console.log(`   - Port: ${config.PORT}`);
console.log('');

