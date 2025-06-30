import { useState } from "react";
import RuleBuilder from "../components/RuleBuilder";
import axios from "axios";
import "../styles/CampaignForm.css";
import { useUser } from "../context/UserContext";
import AiCampaignBuilder from "../components/AICampaignBuilder";

export default function CampaignForm() {
  const [rules, setRules] = useState([]);
  const [logic, setLogic] = useState("AND");
  const [message, setMessage] = useState("");
  const { user } = useUser();

  const sendCampaign = async () => {
    try {
      await axios.post("http://locahost:3000/api/campaign/create", {
        segmentRules: { rules, logic },
        messageTemplate: message,
        createdBy: {
          name: user?.name,
          email: user?.email,
        },
      });
      alert("Campaign Sent!");
    } catch (err) {
      console.error(err);
      alert("Error sending campaign");
    }
  };

  return (
    <div className="campaign-form">
      <h2>Create Campaign</h2>

      <div className="rule-section">
        <RuleBuilder
          rules={rules}
          setRules={setRules}
          logic={logic}
          setLogic={setLogic}
        />
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

      <div className="action-buttons">
        <button onClick={sendCampaign} className="launch-btn">
          Save & Launch Campaign
        </button>
      </div>

      <AiCampaignBuilder />
    </div>
  );
}
