const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const CommunicationLog = require("../models/CommunicationLog");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const dummyCustomers = [
  { name: "Mohit", email: "mohit@example.com" },
  { name: "Riya", email: "riya@example.com" },
];

router.get("/getAll", async (req, res) => {
  const authorName = req.query.name;

  if (!authorName) {
    return res.status(400).json({ message: "Author name is required" });
  }

  try {
    const campaigns = await Campaign.find({
      "createdBy.name": authorName,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err.message);
    res.status(500).json({ message: "Failed to fetch campaign data" });
  }
});

router.post("/create", async (req, res) => {
  const { segmentRules, messageTemplate, createdBy } = req.body;

  if (!createdBy || !createdBy.email) {
    return res.status(400).json({ message: "Missing createdBy information" });
  }

  const campaign = await Campaign.create({
    segmentRules,
    messageTemplate,
    audience: dummyCustomers.map((c) => c.email),
    status: null,
    createdBy,
  });

  let allSucceeded = true;

  for (const customer of dummyCustomers) {
    const message = `Hi ${customer.name}, ${messageTemplate}`;
    const messageId = uuidv4();

    await CommunicationLog.create({
      campaignId: campaign._id,
      customer: customer.email,
      message,
      messageId,
      status: "PENDING",
    });

    try {
      await axios.post("http://locahost:3000/api/vendor/send", {
        messageId,
        message,
        customer,
        campaignId: campaign._id,
      });

      console.log(`Message sent to vendor for ${customer.email}`);
    } catch (err) {
      console.error(
        `Failed to send to vendor for ${customer.email}:`,
        err.message
      );
      allSucceeded = false;
    }
  }

  await Campaign.findByIdAndUpdate(campaign._id, { status: allSucceeded });

  res.json({
    message: "Campaign processed",
    campaignId: campaign._id,
    allSucceeded,
  });
});

router.post("/create2", async (req, res) => {
  const { prompt, createdBy } = req.body;

  try {
    const response = await axios.post(
      "https://api.textrazor.com/",
      new URLSearchParams({
        text: prompt,
        extractors: "entities,topics,relations,categories,sentiment",
      }),
      {
        headers: {
          "x-textrazor-key": process.env.TEXTRAZOR_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data.response;

    const rules = [];

    const spentMatch = prompt.match(
      /total\s+spent\s+(less|greater)\s+than\s+(\d+)/i
    );
    if (spentMatch) {
      rules.push({
        field: "Total Spend",
        operator: spentMatch[1] === "less" ? "<" : ">",
        value: spentMatch[2],
      });
    }

    const visitMatch = prompt.match(
      /visit\s+days\s+(less|greater)\s+than\s+(\d+)/i
    );
    if (visitMatch) {
      rules.push({
        field: "Visit Days",
        operator: visitMatch[1] === "less" ? "<" : ">",
        value: visitMatch[2],
      });
    }

    const logic = "AND";

    const messageMatch = prompt.match(/message\s+["'](.+?)["']/i);
    const messageTemplate = messageMatch ? messageMatch[1] : "Default message";

    const audienceRes = await axios.post(
      "http://locahost:3000/api/estimate-segment",
      {
        rules,
        logic,
      }
    );

    const audience = audienceRes.data.customers || [];

    const campaign = new Campaign({
      segmentRules: { rules, logic },
      audience,
      messageTemplate,
      createdBy,
      status: true,
    });

    await campaign.save();

    res.status(200).json({ message: "Campaign saved", campaign });
  } catch (err) {
    console.error("Error in /parse:", err.message || err);
    res.status(500).json({ message: "Failed to process campaign" });
  }
});

module.exports = router;
