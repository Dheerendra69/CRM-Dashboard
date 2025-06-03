import { useEffect, useState } from "react";
import axios from "axios";
import CampaignCard from "../components/CampaignCard";
import "../styles/CampaignHistory.css";
import { useUser } from "../context/UserContext";

export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    axios
      .get("https://crm-dashboard-k9ao.onrender.com/api/campaign/getAll", {
        params: { name: user.name },
      })
      .then((res) => setCampaigns(res.data))
      .catch((err) => console.error("Error fetching campaigns:", err));
  }, []);
  return (
    <div className="history-page">
      <h2 className="text-2xl font-bold mb-6">📜 Campaign History</h2>

      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="campaign-grid">
          {campaigns
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((c) => (
              <CampaignCard key={c._id} campaign={c} />
            ))}
        </div>
      )}
    </div>
  );
}
