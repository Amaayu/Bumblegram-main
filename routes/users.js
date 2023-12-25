var express = require("express");
const router = require("express").Router();
const User = require("../models/user"); // Adjust the path based on your project structure
const Post = require("../models/post");
const uuid = require(`uuid`);
const usertoautho = require(`../service/auth`);
const upload = require("./multer");
const session = require("express-session");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Register router
router.post("/register", async (req, res) => {
  try {
    // Check if the username already exists
    const existingUsername = await User.findOne({
      username: req.body.username,
    });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const newUser = new User({
      username: req.body.username, // Make sure 'username' is provided
      email: req.body.email,
      password: req.body.password, // Assuming req.body.password is a string
    });
    // Save the new user to the database
    await newUser.save();
    const moona = req.session.user;
    if (!moona) {
      req.session.user = newUser;
      return res.redirect("/edit");
    } else {
      const searchTerm = req.session.user.username;
      const user = await User.findOne({
        username: new RegExp(searchTerm.replace(/\s+/g, ""), "i"),
      });

      if (user) {
        return res.redirect("/edit");
      } else {
        req.session.user = newUser;
        return res.redirect("/edit");
      }
    }
    console.log("User created successfully");
    // Redirect to the user's profile page
  } catch (error) {
    console.error(error);

    // Check if the error is due to validation issues
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

// login router
router.post("/login", async (req, res) => {
  // Remove tabs and spaces and case ignore
  const searchTerm = req.body.username;
  try {
    const user = await User.findOne({
      username: new RegExp(searchTerm.replace(/\s+/g, ""), "i"),
      password: req.body.password,
    });
    if (!user) {
      console.log(user, "nhi mila");
      return res.redirect("/login");
    }
    const moona = req.session.user;
    if (!moona) {
      req.session.user = user;
      return res.redirect("/feed");
    } else {
      const searchTerm = req.session.user.username;
      const user = await User.findOne({
        username: new RegExp(searchTerm.replace(/\s+/g, ""), "i"),
      });

      if (user) {
        return res.redirect("/feed");
      } else {
        req.session.user = user;
        return res.redirect("/feed");
      }
    }
  } catch (error) {
    res.status(500).json({ message: "sory page not found " });
  }
});

//(edit or update) user profile
router.post(
  "/update",
  usertoautho.authenticateUser,
  upload.single("filename"),
  async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { username: req.body.username },
        { username: req.body.username, name: req.body.name, bio: req.body.bio },
        { new: true }
      );
      // Use Buffer from the uploaded file
      if (req.file) {
        var buffer;
        // Upload the image to Cloudinary
        await cloudinary.uploader.upload(req.file.path, (error, result) => {
          if (error) {
            console.log(error);
            return res.status(500);
          }
          res.status(200);
          buffer = result;
          console.log(result);
        });
        // console.log(result);

        user.profileimage = buffer.secure_url;
        console.log("File uploaded successfully!");
      }
      await user.save();

      return res.redirect("/profile");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//(uplode or create ) post picture
router.post(
  "/upload",
  usertoautho.authenticateUser,
  upload.single("image"),
  async (req, res) => {
    try {
      const aashu = await User.findOne({
        username: req.session.user.username,
      });

      // Use Buffer from the uploaded file
      var buffer;

      // Upload the image to Cloudinary
      await cloudinary.uploader.upload(req.file.path, (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500);
        }
        res.status(200);
        buffer = result;
        console.log(result);
      });
      // console.log(result);

      // Create a new post
      const post = await Post.create({
        picture: buffer.secure_url,
        user: aashu._id,
        caption: req.body.caption,
      });

      // Update user posts
      aashu.posts.push(post._id);
      await aashu.save();

      res.redirect("/feed");
    } catch (error) {
      console.error(error);
      res.redirect("/profile");
    }
  }
);
module.exports = router;
