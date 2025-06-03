const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  segmentRules: Object,
  audience: [String], 
  messageTemplate: String,
  createdAt: { type: Date, default: Date.now },
  status: Boolean,
  createdBy: {
    name: String,
    email: String,
  },
});

module.exports = mongoose.model("Campaign", campaignSchema);
