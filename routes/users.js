/* Create imports */
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const { requireAuth } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { upload } = require("../config/cloudinary");
const uploadToCloudinary = require("../middleware/upload");

/* Create routes */
router.get("/profile/:id", requireAuth, usersController.getUserProfile);
router.get("/profile/edit/:id", requireAuth, usersController.getEditProfile);
router.post(
  "/api/users/:id/edit",
  requireAuth,
  upload.single("profilePicture"),
  uploadToCloudinary,
  usersController.postEditProfile
);
router.get("/users", requireAuth, isAdmin, usersController.getUsers); // Admin accessible
router.get("/users/:id", requireAuth, isAdmin, usersController.getUser); // Admin accessible
router.post("/api/users/:id/role", requireAuth, isAdmin, usersController.postChangeRole); // Admin accessible
router.post("/api/users/:id/delete", requireAuth, usersController.postDeleteProfile);

/* Export router */
module.exports = router;
