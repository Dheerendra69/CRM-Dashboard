import { Link } from "react-router-dom";
import Login from "./Login";
import { motion } from "framer-motion";

export default function Navbar({ user, onLogin, onLogout }) {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="logo"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        CRM-Software
      </motion.div>

      <motion.div
        className="nav-links"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {["/", "/campaigns", "/create"].map((path, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1, color: "#1d4ed8" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link to={path}>
              {path === "/"
                ? "Dashboard"
                : path === "/campaigns"
                ? "Campaigns"
                : "Create"}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <Login user={user} onLogin={onLogin} onLogout={onLogout} />
    </motion.nav>
  );
}
