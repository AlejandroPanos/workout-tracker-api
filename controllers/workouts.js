/* Create imports */
const User = require("../models/user");
const Workout = require("../models/workout");

/* Create controllers */
exports.getHome = (req, res) => {
  try {
    res.render("home", {
      docTitle: "Home",
    });
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not fetch your workouts";
    next(error);
  }
};

exports.getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find();
    res.render("workouts/all-workouts", {
      workouts,
      path: "/workouts",
      docTitle: "Workouts",
    });
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not fetch your workouts";
    next(error);
  }
};

exports.getCreateWorkout = (req, res) => {
  res.render("workouts/create-workout", {
    path: "/workouts",
    docTitle: "Create Workout",
  });
};

exports.postCreateWorkout = async (req, res, next) => {
  try {
    const { name, description, duration, difficulty } = req.body;
    const exercises = req.body.exercises
      .split(/[,\n]+/)
      .map((e) => e.trim())
      .filter((e) => e);
    const userId = req.user._id;
    const user = await User.findById(userId);
    const workout = await Workout.create({
      name,
      description,
      exercises,
      duration,
      difficulty,
      createdBy: userId,
    });
    user.workouts.push(workout);
    await user.save();
    res.redirect("/workouts");
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not create workout";
    next(error);
  }
};

exports.getEditWorkout = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const workout = await Workout.findById(workoutId);
    res.render("workouts/edit-workout", {
      workout,
      path: "/workouts",
      docTitle: "Edit Workout",
    });
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not find workout to edit";
    next(error);
  }
};

exports.postEditWorkout = async (req, res, next) => {
  try {
    const { name, description, duration, difficulty } = req.body;
    const exercises = req.body.exercises
      .split(/[,\n]+/)
      .map((e) => e.trim())
      .filter((e) => e);
    const workoutId = req.params.id;

    const workout = await Workout.findById(workoutId);

    const isCreator = workout.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      const error = new Error("You can only edit your own workouts");
      error.status = 403;
      return next(error);
    }

    await Workout.findByIdAndUpdate(workoutId, {
      name,
      description,
      duration,
      exercises,
      difficulty,
    });
    res.redirect("/workouts");
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not edit workout";
    next(error);
  }
};

exports.getWorkoutDetail = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const workout = await Workout.findById(workoutId);
    const userId = workout.createdBy;
    const profileUser = await User.findById(userId);
    res.render("workouts/workout-detail", {
      workout,
      user: req.user,
      profileUser,
      path: "/workouts",
      docTitle: "Workout Detail",
    });
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not find workout";
    next(error);
  }
};

exports.postDeleteWorkout = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const workout = await Workout.findById(workoutId);

    const isCreator = workout.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      const error = new Error("You can only delete your own workouts");
      error.status = 403;
      return next(error);
    }

    await User.findByIdAndUpdate(workout.createdBy, { $pull: { workouts: workoutId } });

    await workout.deleteOne();
    res.redirect("/workouts");
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not delete workout";
    next(error);
  }
};
