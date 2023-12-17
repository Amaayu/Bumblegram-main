let usertoautho = new Map();

const setuser = (uuid, user) => {
  usertoautho.set(uuid, user);
};

const getuser = (uuid) => {
  return usertoautho.get(uuid);
};

const authenticateUser = (req, res, next) => {
  try {
    const userId = req.cookies?.userId;
    if (getuser(userId)) {
      next();
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).json({ message: " server side problem " });
  }
};

module.exports = {
  setuser,
  getuser,
  authenticateUser,
};
