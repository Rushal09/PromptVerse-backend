import multer from "multer";

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  const allowedFileMimes = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  if (file.fieldname === "thumbnailImage") {
    if (allowedImageMimes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(
      new Error(
        `Invalid thumbnail image type: ${file.mimetype}. Only image files are allowed.`
      ),
      false
    );
  }

  if (file.fieldname === "additionalFile") {
    if (allowedFileMimes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(
      new Error(
        `Invalid additional file type: ${file.mimetype}.`
      ),
      false
    );
  }

  return cb(
    new Error(
      'Unexpected file field. Only "thumbnailImage" and "additionalFile" are allowed.'
    ),
    false
  );
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 2,
  },
  fileFilter,
});

const uploadFields = upload.fields([
  { name: "thumbnailImage", maxCount: 1 },
  { name: "additionalFile", maxCount: 1 },
]);

export default (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            return res
              .status(400)
              .json({ message: "File too large. Maximum size is 10MB." });
          case "LIMIT_FILE_COUNT":
            return res
              .status(400)
              .json({ message: "Too many files. Maximum 2 files allowed." });
          case "LIMIT_UNEXPECTED_FILE":
            return res.status(400).json({
              message:
                'Unexpected file field. Only "thumbnailImage" and "additionalFile" are allowed.',
            });
          default:
            return res
              .status(400)
              .json({ message: "File upload error: " + err.message });
        }
      }

      return res.status(400).json({ message: err.message });
    }

    next();
  });
};