var express = require("express");
var router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const usertoautho = require(`../service/auth`);
const user = require("../models/user");
const { post } = require("./users");

router.get("/", async function (req, res) {
  try {
    // Check if user is already in session
    const currentUser = req.session.user;

    if (!currentUser) {
      // If user is not in session, assign and redirect to /feed 
      return  res.render("index", { footer: false });
    } else {
      // If user is in session, check if the user exists in the database
      const searchTerm = currentUser.username;
      const userInDatabase = await User.findOne({
        username: new RegExp(searchTerm.replace(/\s+/g, ""), "i"),
      });

      if (userInDatabase) {
        // If the user exists in the database, redirect to /feed
        return res.redirect("/feed");
      } else {
        // If the user doesn't exist in the database, update session user and redirect to /feed
        return  res.render("index", { footer: false });
      }
    }
  } catch (error) {
    console.error("Error in / route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

  // This line will never be reached. The response has already been sent in the if/else blocks.
  // If you want to render a view, you might want to move it inside the corresponding blocks.
  // res.render("index", { footer: false });
});

router.get("/login", async function (req, res) {
  try {
    // Check if user is already in session
    const currentUser = req.session.user;

    if (!currentUser) {
      // If user is not in session, assign and redirect to /feed 
      return res.render("login", { footer: false });
    } else {
      // If user is in session, check if the user exists in the database
      const searchTerm = currentUser.username;
      const userInDatabase = await User.findOne({
        username: new RegExp(searchTerm.replace(/\s+/g, ""), "i"),
      });

      if (userInDatabase) {
        // If the user exists in the database, redirect to /feed
        return res.redirect("/feed");
      } else {
        // If the user doesn't exist in the database, update session user and redirect to /feed
        return  res.render("login", { footer: false });
      }
    }
  } catch (error) {
    console.error("Error in / route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/feed", usertoautho.authenticateUser, async function (req, res) {
  const posts = await Post.find().populate("user");
  const aashu = await User.findOne({
    username: req.session.user.username,
  });
  res.render("feed", { footer: true, posts, aashu });
});

router.get("/profile", usertoautho.authenticateUser, async function (req, res) {
  const aashu = await User.findOne({
    username: req.session.user.username,
  }).populate("posts");

  res.render("profile", { footer: true, aashu }); // Corrected the way to pass multiple objects
});

router.get(
  "/like/post/:id",
  usertoautho.authenticateUser,
  async function (req, res) {
    const aashu = await User.findOne({
      username: req.session.user.username,
    });
    const post = await Post.findOne({
      _id: req.params.id,
    });
    // user id don't exsit to use if or user id exsit to use else
    if (post.likes.indexOf(aashu._id )=== -1) post.likes.push(aashu._id);
    else post.likes.splice(post.likes.indexOf(aashu._id), 1);
    await post.save();
    res.redirect("/feed");
  }
);

router.get("/search", usertoautho.authenticateUser, async function (req, res) {
  const aashu = await User.findOne({
    username: req.session.user.username,
  });
  res.render("search", { footer: true, aashu });
});

router.get("/edit", usertoautho.authenticateUser, async function (req, res) {
  try {
    const aashu = await User.findOne({
      username: req.session.user.username,
    });

    res.render("edit", { footer: true, aashu }); // Corrected the way to pass multiple objects
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user data." });
  }
});

router.get("/upload", usertoautho.authenticateUser, async function (req, res) {
  const aashu = await User.findOne({
    username: req.session.user.username,
  });
  res.render("upload", { footer: true, aashu });
});

router.get("/username/:username", usertoautho.authenticateUser, async function (req, res) {
  const searchTerm = req.params.username;
  /*if(searchTerm===undefined){
    res.json({message: ""});
  }*/
    const users = await User.find({
      username: new RegExp(searchTerm.replace(/\s+/g, ""), "i"),
    });
  res.json(users);
});

router.get("/logout", async function (req, res) {
  try {
    // Check if user is in session
    const currentUser = req.session.user;

    if (currentUser) {
      // If user is in session, clear the user session
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        // Redirect to the login page after clearing the session
        return res.redirect("/login");
      });
    } else {
      // If user is not in session, redirect to the login page
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Error in /logout route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
