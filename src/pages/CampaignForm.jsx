import { useState } from "react";
import RuleBuilder from "../components/RuleBuilder";
import axios from "axios";
import "../styles/CampaignForm.css";
import { useUser } from "../context/UserContext";
import AiCampaignBuilder from "../components/AICampaignBuilder";

export default function CampaignForm() {
  const [rules, setRules] = useState([]);
  const [logic, setLogic] = useState("AND");
  const [audienceSize, setAudienceSize] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useUser();

  const estimateSize = async () => {
    try {
      const res = await axios.post(
        "https://crm-dashboard-k9ao.onrender.com/api/estimate-segment",
        {
          rules,
          logic,
        }
      );
      setAudienceSize(res.data.size);
    } catch (err) {
      console.error(err);
    }
  };

  const sendCampaign = async () => {
    try {
      await axios.post(
        "https://crm-dashboard-k9ao.onrender.com/api/campaign/create",
        {
          segmentRules: { rules, logic },
          messageTemplate: message,
          createdBy: {
            name: user?.name,
            email: user?.email,
          },
        }
      );
      alert("Campaign Sent!");
    } catch (err) {
      console.error(err);
      alert("Error sending campaign");
    }
  };

  return (
    <>
      <div className="campaign-form">
        <h2>Create Campaign</h2>

        <div className="rule-section">
          <RuleBuilder
            rules={rules}
            setRules={setRules}
            logic={logic}
            setLogic={setLogic}
          />

          <button onClick={estimateSize}>Estimate Audience Size</button>
          {audienceSize !== null && (
            <p className="audience-size">Estimated size: {audienceSize}</p>
          )}
        </div>

        <div className="message-section">
          <label>Message Template:</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='e.g. "Hi {name}, here’s 10% off on your next order!"'
          />
        </div>

        <div className="mt-6">
          <button
            onClick={sendCampaign}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save & Launch Campaign
          </button>
        </div>
      </div>
      <div>
        <AiCampaignBuilder />
      </div>
    </>
  );
}
