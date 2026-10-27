
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LogoutButton from "./route/LogoutButton";

function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">DEV@Deakin</Link>
      </div>

      <div className="nav-actions">
        <input
          type="text"
          placeholder="Search..."
          className="search-box"
        />

        <Link to="/post" className="post-button">
          Post
        </Link>

        <Link to="/pricing" className="post-button">
          Pricing
        </Link>

        {!loading && (
          user ? (
            <LogoutButton />
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )
        )}
      </div>
    </header>
  );
}

export default Header;
