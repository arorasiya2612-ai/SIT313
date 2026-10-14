import { Link } from "react-router-dom";

function Header() {
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

        <Link to="/login" className="login-link">
          Login
        </Link>
      </div>
    </header>
  );
}

export default Header;
