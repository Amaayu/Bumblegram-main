var express = require("express");
var router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const usertoautho = require(`../service/auth`);
const user = require("../models/user");
const { post } = require("./users");

router.get("/", function (req, res) {
  res.render("index", { footer: false });
});

router.get("/login", function (req, res) {
  res.render("login", { footer: false });
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
module.exports = router;
