const User = require("../models/user");

/*let usertoautho = new Map();

const setuser = (uuid, user) => {
  usertoautho.set(uuid, user);
};

const getuser = (uuid) => {
  return usertoautho.get(uuid);
};*/

const authenticateUser = async (req, res, next) => {
  try {
    // Check if user is logged in (authenticated)
    if (!req.session || !req.session.user || !req.session.user.username) {
      console.log("Not 1");
      return res.redirect("/login");
    }

    // Check if the user exists in the database
    const user = await User.findOne({
      username: new RegExp(req.session.user.username, "i"),
    });

    if (user) {
      // User exists, proceed to the next middleware
      next();
    } else {
      // User not found in the database, redirect to login
      console.log("Not 2");
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Error in authenticateUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  authenticateUser,
};

