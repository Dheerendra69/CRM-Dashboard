require("dotenv").config();
const express = require("express");
const app = express();
const dbConnect = require("../config/dbConnect");
dbConnect();
const PORT = process.env.PORT;

const cors = require("cors");
const Customer = require("../models/Customer");

app.use(
  cors({
    origin: [
      "https://custom-manage.netlify.app/",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
  })
);

app.use(express.json());

app.use("/api/campaign", require("../routes/campaign"));
app.use("/api/vendor", require("../routes/vendor"));
app.use("/api/auth", require("../routes/auth"));
app.use("/api/ai", require("../routes/ai"));
app.post("/api/estimate-segment", async (req, res) => {
  try {
    const { rules, logic } = req.body;

    if (!Array.isArray(rules) || (logic !== "AND" && logic !== "OR")) {
      return res.status(400).json({ error: "Invalid rules or logic" });
    }

    const operatorMap = {
      "<": "lt",
      "<=": "lte",
      ">": "gt",
      ">=": "gte",
      "==": "eq",
      "!=": "ne",
    };

    const mongoConditions = rules.map((rule) => {
      if (!rule.field || !rule.operator || rule.value === undefined) {
        throw new Error("Invalid rule format");
      }

      const mongoOp = operatorMap[rule.operator];
      if (!mongoOp) {
        throw new Error(`Unsupported operator: ${rule.operator}`);
      }

      return {
        [rule.field]: { [`$${mongoOp}`]: Number(rule.value) },
      };
    });

    const mongoQuery = {
      [logic === "AND" ? "$and" : "$or"]: mongoConditions,
    };

    const count = await Customer.countDocuments(mongoQuery);
    res.json({ size: count });
  } catch (err) {
    console.error("Error in /api/estimate-segment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});
