import multer from "multer";

// Use memory storage instead of disk storage for serverless environments
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 2, // Maximum 2 files per request
  },
  fileFilter: (req, file, cb) => {
    // Allow common image and document formats
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Only images and documents are allowed.`), false);
    }
  }
});

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

// Wrapper function to handle multer errors gracefully
export default (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
          case 'LIMIT_FILE_COUNT':
            return res.status(400).json({ message: 'Too many files. Maximum 2 files allowed.' });
          case 'LIMIT_UNEXPECTED_FILE':
            return res.status(400).json({ message: 'Unexpected file field. Only "image" and "file" fields are allowed.' });
          default:
            return res.status(400).json({ message: 'File upload error: ' + err.message });
        }
      } else {
        return res.status(400).json({ message: err.message });
      }
    }
    next();
  });
};
