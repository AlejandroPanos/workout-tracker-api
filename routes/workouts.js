/* Create imports */
const express = require("express");
const router = express.Router();
const workoutsController = require("../controllers/workouts");
const { requireAuth } = require("../middleware/auth");

/* Create routes */
router.get("/", workoutsController.getHome);
router.get("/workouts", requireAuth, workoutsController.getWorkouts);
router.get("/workouts/create", requireAuth, workoutsController.getCreateWorkout);
router.post("/api/workouts", requireAuth, workoutsController.postCreateWorkout);
router.get("/workouts/:id", requireAuth, workoutsController.getWorkoutDetail);
router.get("/workouts/:id/edit", requireAuth, workoutsController.getEditWorkout);
router.post("/api/workouts/:id/edit", requireAuth, workoutsController.postEditWorkout);
router.post("/api/workouts/:id/save", requireAuth, workoutsController.postSaveWorkout);
router.post("/api/workouts/:id/unsave", requireAuth, workoutsController.postUnsaveWorkout);
router.post("/api/workouts/:id/delete", requireAuth, workoutsController.postDeleteWorkout);

/* Export router */
module.exports = router;
