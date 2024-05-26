import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';

const currentPath = process.cwd();

const fileFilter = (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(currentPath, 'files'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadMiddleware = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
}).single('file');

export const upload = async (req, res, next) => {
    console.log('upload middleware' , req.file);
    uploadMiddleware(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Error uploading file' });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        next();
    });
};
