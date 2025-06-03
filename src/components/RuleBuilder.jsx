import { useState, useEffect } from "react";
import RuleRow from "./RuleRow";
import axios from "axios";

export default function RuleBuilder({ rules, setRules, logic, setLogic }) {
  const [audienceSize, setAudienceSize] = useState(null);

  const updateRule = (index, newRule) => {
    const updated = [...rules];
    updated[index] = newRule;
    setRules(updated);
  };

  const addRule = () =>
    setRules([...rules, { field: "Total Spend", operator: ">", value: "0" }]);

  const deleteRule = (index) => setRules(rules.filter((_, i) => i !== index));

  const estimateSegment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/estimate-segment",
        { rules, logic }
      );
      setAudienceSize(response.data.size);
    } catch (err) {
      console.error("Failed to estimate segment:", err.message);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <div className="mb-4">
        <label className="font-medium">Logic:</label>
        <select
          className="ml-2 border px-2 py-1 rounded"
          value={logic}
          onChange={(e) => setLogic(e.target.value)}
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      </div>

      {rules.map((rule, index) => (
        <RuleRow
          key={index}
          rule={rule}
          onChange={(r) => updateRule(index, r)}
          onDelete={() => deleteRule(index)}
        />
      ))}

      <button
        className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
        onClick={addRule}
      >
        + Add Rule
      </button>

      <div className="mt-4">
        <button
          className="bg-indigo-600 text-white px-4 py-1 rounded"
          onClick={estimateSegment}
        >
          Estimate Audience
        </button>
        {audienceSize !== null && (
          <p className="mt-2 text-green-700 font-medium">
            Estimated Audience Size: {audienceSize}
          </p>
        )}
      </div>
    </div>
  );
}
