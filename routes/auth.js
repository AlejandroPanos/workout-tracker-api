/* Create impors */
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { upload } = require("../config/cloudinary");
const uploadToCloudinary = require("../middleware/upload");
const { requireAuth } = require("../middleware/auth");

/* Create routes */
router.get("/register", authController.getRegister);
router.post(
  "/api/auth/register",
  upload.single("profilePicture"),
  uploadToCloudinary,
  authController.postRegister
);
router.get("/login", authController.getLogin);
router.post("/api/auth/login", authController.postLogin);
router.post("/api/auth/logout", requireAuth, authController.postLogout);

/* Export router */
module.exports = router;
