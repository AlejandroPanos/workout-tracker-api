/* Create dotenv config */
require("dotenv").config();

/* Create imports */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const workoutsRouter = require("./routes/workouts");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const { checkUser } = require("./middleware/auth");
const uri = process.env.MONGOOSE_URI;

/* Select engine */
app.set("view engine", "ejs");
app.set("views", "views");

/* Utilizing cors */
app.use(
  cors({
    origin: "*",
  })
);

/* Parse requests */
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());

/* Utilize routes and middleware */
app.use(checkUser);
app.use(usersRouter);
app.use(workoutsRouter);
app.use(authRouter);

/* Error handling middleware */
app.use((err, req, res, next) => {
  console.log(err.stack);

  const errorMessage = err.message || "Something went wrong";
  const statusCode = err.status || 500;

  res.status(statusCode).render("error", {
    message: errorMessage,
    status: statusCode,
    docTitle: "Error",
  });
});

/* Connect to mongoose */
const mongooseConnect = async () => {
  try {
    await mongoose.connect(uri);
    app.listen(3000, () => {
      console.log("✅ App listening on port 3000");
    });
  } catch (error) {
    console.log(error);
  }
};
mongooseConnect();
