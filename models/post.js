const mongoose = require("mongoose");

const postModel = new mongoose.Schema({
  picture: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  caption: String ,
  date:{
    type:Date,
    default: Date.now
  },
  likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }]

});
module.exports = mongoose.model("Post", postModel);
