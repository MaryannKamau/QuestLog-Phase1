import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🎮 QuestLog</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/games">Browse Games</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/about">About</Link>
        <Link to="/collections">Collections</Link>
      </div>
    </nav>
  );
}

export default Navbar;