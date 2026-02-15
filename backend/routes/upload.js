import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'textures');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'texture-' + uniqueSuffix + ext);
    }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('نوع الملف غير مدعوم. يرجى رفع صورة (JPEG, PNG, WebP, GIF)'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});

// Upload single texture image
router.post('/texture', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'لم يتم رفع أي ملف' });
        }

        // Return the URL to access the uploaded file
        const fileUrl = `/uploads/textures/${req.file.filename}`;

        res.json({
            success: true,
            message: 'تم رفع الصورة بنجاح',
            url: fileUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء رفع الملف' });
    }
});

// Get list of uploaded textures
router.get('/textures', (req, res) => {
    try {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'textures');

        if (!fs.existsSync(uploadDir)) {
            return res.json({ textures: [] });
        }

        const files = fs.readdirSync(uploadDir);
        const textures = files
            .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
            .map(file => ({
                filename: file,
                url: `/uploads/textures/${file}`,
                path: path.join(uploadDir, file)
            }));

        res.json({ textures });
    } catch (error) {
        console.error('Error listing textures:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الملفات' });
    }
});

// Delete uploaded texture
router.delete('/texture/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '..', 'uploads', 'textures', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'الملف غير موجود' });
        }

        fs.unlinkSync(filePath);
        res.json({ success: true, message: 'تم حذف الملف بنجاح' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف الملف' });
    }
});

export default router;
