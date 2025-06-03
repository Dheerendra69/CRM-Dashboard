const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/send", async (req, res) => {
  const { messageId, customer, campaignId } = req.body;

  const isSuccess = Math.random() < 0.9;
  const status = isSuccess ? "SENT" : "FAILED";

  setTimeout(async () => {
    try {
      await axios.post(
        "https://crm-dashboard-k9ao.onrender.com/api/vendor/receipt",
        {
          messageId,
          campaignId,
          status,
        }
      );
    } catch (err) {
      console.error("Failed to send receipt:", err.message);
    }
  }, 1000);

  res.send("Message sent");
});

router.post("/receipt", async (req, res) => {
  const { messageId, status } = req.body;
  const CommunicationLog = require("../models/CommunicationLog");

  try {
    await CommunicationLog.findOneAndUpdate({ messageId }, { status });
    console.log(`Updated log ${messageId} to ${status}`);
    res.send("Status updated");
  } catch (err) {
    console.error("Failed to update communication log:", err.message);
    res.status(500).send("Failed to update status");
  }
});

module.exports = router;
