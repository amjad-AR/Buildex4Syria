import { connectDB } from './db/connectbd.js';
import { resetAdmin } from './seedData.js';

/**
 * سكريبت لإنشاء حساب أدمن جديد وحذف الحسابات القديمة
 */
async function createAdminAccount() {
  try {
    console.log('🚀 بدء إنشاء حساب الأدمن...\n');

    // الاتصال بقاعدة البيانات
    await connectDB();

    // حذف الحسابات القديمة وإنشاء حساب جديد
    const adminInfo = await resetAdmin();

    console.log('\n' + '='.repeat(50));
    console.log('📋 معلومات تسجيل الدخول:');
    console.log('='.repeat(50));
    console.log(`📧 البريد الإلكتروني: ${adminInfo.email}`);
    console.log(`👤 اسم المستخدم: ${adminInfo.username}`);
    console.log(`🔐 كلمة المرور: ${adminInfo.password}`);
    console.log('='.repeat(50));
    console.log('\n✅ تم إنشاء حساب الأدمن بنجاح! يمكنك الآن تسجيل الدخول.');

    // إغلاق الاتصال
    process.exit(0);
  } catch (error) {
    console.error('\n❌ خطأ في إنشاء حساب الأدمن:', error.message);
    process.exit(1);
  }
}

// تشغيل السكريبت
createAdminAccount();
