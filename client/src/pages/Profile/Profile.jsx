import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/useFavorites";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { favorites } = useFavorites();
  const [collectionsCount, setCollectionsCount] = useState(0);
  const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://questlog-backend-2.onrender.com/api";
    const COLL_API = `${API_BASE_URL}/collections`;

  // Redirect users to login view if they try to access profiles while logged out
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Dynamic metrics retrieval: Counts how many custom tracking boards this user owns
    if (user?.id) {
      setLoading(true);
      fetch(`${COLL_API}/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setCollectionsCount(Array.isArray(data) ? data.length : 0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) return null;

  return (
    <main className="profile-container">
      <header className="profile-card">
        <div className="avatar-shield">
          {user.username ? user.username.charAt(0).toUpperCase() : "👤"}
        </div>
        
        <div className="profile-details">
          <h1>{user.username}</h1>
          <p className="user-email">✉️ {user.email}</p>
          <p className="account-date">
            📅 Member Since: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Recent Deployment"}
          </p>
        </div>
      </header>

      {/* STRATEGIC DASHBOARD BADGES VECTOR MATRIX */}
      <section className="metrics-dashboard">
        <div className="metric-badge">
          <h3>Favorites</h3>
          <p className="badge-count">❤️ {favorites.length}</p>
          <Link to="/favorites" className="badge-link">View Shelf &rarr;</Link>
        </div>

        <div className="metric-badge">
          <h3>Custom Boards</h3>
          <p className="badge-count">📋 {loading ? "..." : collectionsCount}</p>
          <Link to="/collections" className="badge-link">Manage Boards &rarr;</Link>
        </div>
      </section>

      <footer className="profile-actions">
        <button type="button" onClick={() => navigate("/")} className="button-home">
          &larr; Back to Catalog
        </button>
        <button type="button" onClick={logout} className="button-logout-profile">
          Sign Out of Account
        </button>
      </footer>
    </main>
  );
}

export default Profile;
