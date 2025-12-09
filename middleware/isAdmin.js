const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("You are not authenticated");
    }

    if (req.user.role !== "admin") {
      return res.status(403).send("You are not an admin");
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = isAdmin;
