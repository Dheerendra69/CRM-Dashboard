import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import CampaignForm from "./pages/CampaignForm";
import CampaignHistory from "./pages/CampaignHistory";
import "./App.css";
import { useUser } from "./context/UserContext";
import Dashboard from "./pages/Dashboard";

function App() {
  const { user } = useUser();

  return (
    <Router>
      <Navbar />
      <div className="content">
        {!user ? (
          <div>
            <h1>Welcome to CRM-Software</h1>
            <p>Please login to continue.</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CampaignForm />} />
            <Route path="/campaigns" element={<CampaignHistory />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
