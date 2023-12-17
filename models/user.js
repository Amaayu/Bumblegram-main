const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  profileimage: { type: String },
  posts: [{type:mongoose.Schema.Types.ObjectId , ref:"Post"}]
});
module.exports = mongoose.model(`User`, userModel);
