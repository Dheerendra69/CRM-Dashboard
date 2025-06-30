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
        "http://locahost:3000/api/campaign/create2",
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
    <div className="ai-campaign-container">
      <h2>OR</h2>
      <h2>Try our AI</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write your campaign prompt here..."
      />
      <button onClick={handleSubmit}>Submit</button>
      <div className="example-queries">
        <p>💡 Example Queries:</p>
        <ul>
          <li
            onClick={() =>
              setQuery(
                "People who haven't shopped in 6 months and spent over ₹5K"
              )
            }
          >
            People who haven't shopped in 6 months and spent over ₹5K
          </li>
          <li
            onClick={() =>
              setQuery("Customers with more than 5 visits but zero purchases")
            }
          >
            Customers with more than 5 visits but zero purchases
          </li>
          <li
            onClick={() =>
              setQuery("Users inactive for 90 days OR total spend > ₹10K")
            }
          >
            Users inactive for 90 days OR total spend greater than ₹10K
          </li>
        </ul>
      </div>
    </div>
  );
}
