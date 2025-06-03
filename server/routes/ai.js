const router = require("express").Router();
const axios = require("axios");
const Campaign = require("../models/Campaign");

router.post("/parse", async (req, res) => {
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


    const rules = [];

    const spentMatch = prompt.match(/total\s+spent\s+(less|greater)\s+than\s+(\d+)/i);
    if (spentMatch) {
      rules.push({
        field: "Total Spend",
        operator: spentMatch[1] === "less" ? "<" : ">",
        value: spentMatch[2],
      });
    }

    const visitMatch = prompt.match(/visit\s+days\s+(less|greater)\s+than\s+(\d+)/i);
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

    const audienceRes = await axios.post("http://localhost:5000/api/estimate-segment", {
      rules,
      logic,
    });


    const audience = audienceRes.data.customers || [];

    const campaign = new Campaign({
      segmentRules: { rules, logic },
      audience,
      messageTemplate,
      createdBy,
      status: false,
    });

    await campaign.save();

    res.status(200).json({ message: "Campaign saved", campaign });
  } catch (err) {
    console.error("Error in /parse:", err.message || err);
    res.status(500).json({ message: "Failed to process campaign" });
  }
});


module.exports = router;
