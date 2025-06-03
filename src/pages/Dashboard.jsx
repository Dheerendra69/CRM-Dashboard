import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-hero">
      <div className="dashboard-content">
        <h1>📊 Welcome to Xeno CRM</h1>
        <p>
          Automate your marketing with intelligent segmentation, personalized
          messaging, and smart campaign insights.
        </p>

        <div className="dashboard-buttons">
          <Link to="/create" className="btn primary">
            ➕ Create Campaign
          </Link>
          <Link to="/campaigns" className="btn secondary">
            📜 Campaign History
          </Link>
        </div>
      </div>
    </div>
  );
}
