/* Create imports */
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

/* Create config */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* Save in multer as Buffer */
const storage = multer.memoryStorage();

/* Config Multer */
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"), false);
    }
  },
});

/* Create export */
module.exports = { cloudinary, upload };
