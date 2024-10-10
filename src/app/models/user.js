const mongoose = require("mongoose");
const { models } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    token: {
      type: String,
    },
    resetToken: {
      type: String,
      require: false,
    },
    resetTokenExpire: {
      type: Date,
      require: false,
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

module.exports = User;
