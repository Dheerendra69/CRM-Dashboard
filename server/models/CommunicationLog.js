const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  campaignId: mongoose.Types.ObjectId,
  customer: String,
  message: String,
  status: {
    type: String,
    enum: ["PENDING", "SENT", "FAILED"],
    default: "PENDING",
  },
  messageId: String,
});

module.exports = mongoose.model("CommunicationLog", logSchema);
