import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useUser } from "../context/UserContext";

const clientId =
  "777619108851-3fjui52nkbfqvip9aofteqg7j7q40rsa.apps.googleusercontent.com";

function Login() {
  const { user, login, logout } = useUser();

  useEffect(() => {
    if (!user && window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin"),
        { theme: "outline", size: "small" }
      );
    }
  }, [user]);

  const handleCredentialResponse = async (response) => {
    const decoded = jwtDecode(response.credential);
    login(decoded);

    try {
      await axios.post(
        "https://crm-dashboard-k9ao.onrender.com/api/auth/google",
        {
          token: response.credential,
        }
      );
    } catch (err) {
      console.error("Auth error:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <div
        id="google-signin"
        style={{ display: user ? "none" : "block" }}
      ></div>

      {user && (
        <div className="login-box">
          <img src={user.picture} alt="Profile" />
          <span className="name">{user.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
