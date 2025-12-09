/* Create imports */
const User = require("../models/user");
const Workout = require("../models/workout");
const { maxAge, createToken } = require("../helpers/helpers");

/* Create controllers */
exports.getRegister = (req, res) => {
  res.render("auth/register", {
    docTitle: "Register",
    error: null,
    formData: {},
  });
};

exports.postRegister = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const profilePicture = req.cloudinaryUrl;
    const profilePictureId = req.cloudinaryPublicId || null;

    const user = await User.create({
      name,
      username,
      email,
      password,
      profilePicture,
      profilePictureId,
    });

    // Create cookie and redirect
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/workouts");
  } catch (error) {
    console.log(error);

    // Handle specific MongoDB errors
    let errorMessage = "Registration failed. Please try again.";

    if (req.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(req.cloudinaryPublicId);
    }

    if (error.code === 11000) {
      // Duplicate key error
      if (error.keyPattern.email) {
        errorMessage = "Email already in use";
      } else if (error.keyPattern.username) {
        errorMessage = "Username already taken";
      }
    } else if (error.name === "ValidationError") {
      // Mongoose validation error
      errorMessage = Object.values(error.errors)[0].message;
    }

    res.render("auth/register", {
      docTitle: "Register",
      error: errorMessage,
      formData: req.body,
    });
  }
};

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    docTitle: "Login",
    error: null,
    formData: {},
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);

    // Create cookie and token
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/workouts");
  } catch (error) {
    console.log(error);

    // Handle different login errors
    let errorMessage = "Login failed. Please try again.";

    // Re-render the form with error and keep email
    res.render("auth/login", {
      docTitle: "Login",
      error: errorMessage,
      formData: { email: req.body.email },
    });
  }
};

exports.postLogout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
  res.redirect("/");
};
