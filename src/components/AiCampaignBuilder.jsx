import "../styles/AiCampaignBuilder.css";
import axios from "axios";
import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function AiCampaignBuilder() {
  const [query, setQuery] = useState("");
  const { user } = useUser();

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "https://crm-dashboard-k9ao.onrender.com/api/campaign/create2",
        {
          prompt: query,
          createdBy: {
            name: user.name,
            email: user.email,
          },
        }
      );
      alert("Campaign created successfully!");
    } catch (err) {
      alert("Error creating campaign: " + err.message);
    }
  };

  return (
    <div className="ai-campaign-builder">
      <h2>Try our AI to launch campaign</h2>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write your campaign prompt here..."
      />
      <button onClick={handleSubmit}>Submit</button>

      <div className="example-prompts">
        <h4>Example Queries:</h4>
        <ul>
          <li>
            Launch a campaign with message <i>'Welcome Back'</i> for users with
            total spent less than 50 and visit days greater than 100
          </li>
          <li>
            Create a campaign offering 20% discount to users who haven’t made a
            purchase in the last 60 days
          </li>
        </ul>
      </div>
    </div>
  );
}
