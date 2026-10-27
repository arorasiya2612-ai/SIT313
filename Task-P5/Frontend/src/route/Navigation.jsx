import { Link } from "react-router-dom";

function Navigation() {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">DEV@Deakin</Link>
            </div>

            <div className="nav-actions">
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-box"
                />

                <button type="button">Post</button>

                <Link to="/login" className="login-link">
                    Login
                </Link>
            </div>
        </nav>
    );
}

export default Navigation;