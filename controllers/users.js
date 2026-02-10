/* Create imports */
const User = require("../models/user");
const Workout = require("../models/workout");
const { cloudinary } = require("../config/cloudinary");

/* Create controllers */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -profilePictureId");
    res.render("users/all-users", {
      users,
      path: "/users",
      docTitle: "Users",
    });
  } catch (error) {
    console.log(error);
    error.status = 403;
    error.message = "Cannot access this route. Admins only.";
    next(error);
  }
};

exports.getEditProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const profileUser = await User.findById(userId);
    res.render("users/edit-profile", {
      user: req.user,
      profileUser,
      path: "/profile",
      docTitle: "Edit Profile",
    });
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not find profile";
    next(error);
  }
};

exports.postEditProfile = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const userId = req.params.id;

    const isOwnProfile = userId === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwnProfile && !isAdmin) {
      const error = new Error("You can only edit your own profile");
      error.status = 403;
      return next(error);
    }

    const currentUser = await User.findById(userId);

    currentUser.name = name;
    currentUser.username = username;
    currentUser.email = email;

    if (password && password.trim() !== "") {
      currentUser.password = password;
    }

    if (req.cloudinaryUrl) {
      if (currentUser.profilePictureId) {
        await cloudinary.uploader.destroy(currentUser.profilePictureId);
      }

      currentUser.profilePicture = req.cloudinaryUrl;
      currentUser.profilePictureId = req.cloudinaryPublicId;
    }

    await currentUser.save();
    res.redirect("/workouts");
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not edit your profile";
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const profileUser = await User.findById(userId)
      .populate("workouts")
      .select("-password -profilePictureId");
    res.render("users/user-profile", {
      user: req.user,
      profileUser,
      path: "/profile",
      docTitle: "User Profile",
    });
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not find profile";
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const profileUser = await User.findById(userId)
      .populate("workouts")
      .select("-password -profilePictureId");
    res.render("users/user-profile", {
      user: req.user,
      profileUser,
      path: "/profile",
      docTitle: "User",
    });
  } catch (error) {
    console.log(error);
    error.status = 403;
    error.message = "Cannot access this route. Admins only.";
    next(error);
  }
};

exports.postChangeRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user.role === "user") {
      user.role = "admin";
    } else if (user.role === "admin") {
      user.role = "user";
    }
    await user.save();
    res.redirect("/users");
  } catch (error) {
    console.log(error);
    error.status = 401;
    error.message = "Not allowed to change role";
    next(error);
  }
};

exports.postDeleteProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const isOwnAccount = userId === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwnAccount && !isAdmin) {
      const error = new Error("You can only delete your own account");
      error.status = 403;
      return next(error);
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    if (user.profilePictureId) {
      await cloudinary.uploader.destroy(user.profilePictureId);
    }

    await Workout.deleteMany({ createdBy: userId });
    await user.deleteOne();

    if (isOwnAccount) {
      res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
      return res.redirect("/");
    }

    res.redirect("/workouts");
  } catch (error) {
    console.log(error);
    error.status = 500;
    error.message = "Could not delete profile";
    next(error);
  }
};
