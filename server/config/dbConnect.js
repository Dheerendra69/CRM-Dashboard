const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("mongodb connected");
  } catch (e) {
    console.log("error while connecting", e);
  }
};

module.exports = dbConnect;
