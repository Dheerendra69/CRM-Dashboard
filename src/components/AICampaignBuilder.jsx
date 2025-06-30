import axios from "axios";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/AiCampaignBuilder.css";

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
      alert("Error creating campaign" + err.message);
    }
  };

  return (
    <div>
      <textarea value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
