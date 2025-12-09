/* Create imports */
require("dotenv").config();
const mongoose = require("mongoose");
const Workout = require("../models/workout");
const User = require("../models/user");

/* Create workout seed */
const workouts = [
  {
    name: "Full Body Beginner",
    description: "Perfect for starting your fitness journey",
    exercises: ["Push-ups", "Squats", "Plank", "Jumping Jacks"],
    duration: 30,
    difficulty: "beginner",
    createdBy: "69380da000d38cbc536f6314",
  },
  {
    name: "Upper Body Blast",
    description: "Intense upper body workout",
    exercises: ["Bench Press", "Pull-ups", "Shoulder Press", "Bicep Curls", "Dips"],
    duration: 45,
    difficulty: "intermediate",
    createdBy: "69380da000d38cbc536f6314",
  },
  {
    name: "Leg Day Advanced",
    description: "Heavy leg training",
    exercises: ["Squats", "Deadlifts", "Lunges", "Leg Press", "Calf Raises"],
    duration: 60,
    difficulty: "advanced",
    createdBy: "69380da000d38cbc536f6314",
  },
  {
    name: "Core Strength",
    description: "Build a strong core",
    exercises: ["Planks", "Russian Twists", "Leg Raises", "Mountain Climbers"],
    duration: 20,
    difficulty: "beginner",
    createdBy: "69380da000d38cbc536f6314",
  },
  {
    name: "HIIT Cardio",
    description: "High intensity interval training",
    exercises: ["Burpees", "Jump Squats", "High Knees", "Box Jumps"],
    duration: 25,
    difficulty: "intermediate",
    createdBy: "69380da000d38cbc536f6314",
  },
];

/* Create seed function */
const seedWorkouts = async () => {
  try {
    const userId = "69380da000d38cbc536f6314";
    await mongoose.connect(process.env.MONGOOSE_URI);
    const user = await User.findById(userId);
    await Workout.deleteMany({});
    const createdWorkouts = await Workout.insertMany(workouts);
    user.workouts = createdWorkouts.map((workout) => workout._id);
    await user.save();
    mongoose.connection.close();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
seedWorkouts();
