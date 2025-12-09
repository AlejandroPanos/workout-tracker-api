/* Create imports */
const User = require("../models/user");
const jwt = require("jsonwebtoken");

/* Create middleware */
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, function (error, decodedToken) {
      if (error) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async function (error, decodedToken) {
      if (error) {
        res.locals.user = null;
        next();
      } else {
        const { id } = decodedToken;
        const user = await User.findById(id);
        req.user = user;
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
