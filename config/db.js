const { config } = require("dotenv");
const mongoose = require("mongoose");
config();
exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected sucessfully");
  } catch (error) {
    console.log("Failed to connect", error.message);
  }
};
