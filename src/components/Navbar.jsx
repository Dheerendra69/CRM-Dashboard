import Login from "./Login";

export default function Navbar({ user, onLogin, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">CRM-Software</div>
      <div className="nav-links">
        <a href="/">Dashboard</a>
        <a href="/campaigns">Campaigns</a>
        <a href="/create">Create</a>
      </div>
      <Login user={user} onLogin={onLogin} onLogout={onLogout} />
    </nav>
  );
}
