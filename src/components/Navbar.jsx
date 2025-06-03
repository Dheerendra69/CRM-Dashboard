import { Link } from "react-router-dom";
import Login from "./Login";

export default function Navbar({ user, onLogin, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">CRM-Software</div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/campaigns">Campaigns</Link>
        <Link to="/create">Create</Link>
      </div>
      <Login user={user} onLogin={onLogin} onLogout={onLogout} />
    </nav>
  );
}
