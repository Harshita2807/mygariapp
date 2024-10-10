const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL).then((response) => {
      console.log("Connected to mongoDB successfully");
      return response;
    });
  } catch (error) {
    console.log("Error connecting to DB: ", error);
  }
};

module.exports = connectDB;