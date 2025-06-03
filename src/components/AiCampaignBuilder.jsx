import axios from "axios";
import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function AiCampaignBuilder() {
  const [query, setQuery] = useState("");

  const { user } = useUser();
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/campaign/create2",
        {
          prompt: query,
          createdBy: {
            name: user.name,
            email: user.email,
          },
        }
      );
      console.log(res);
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
