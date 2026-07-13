import React, { useState, useEffect } from "react";
import GameCard from "../../components/GameCard/GameCard";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const USER_ID = 2;
  
  // Synchronized account profile target
  
  const API_URL = `https://questlog-backend-2.onrender.com/api/favourites/user/${USER_ID}`;

  useEffect(() => {
    fetchFavorites();
  }, []);

  // 1. READ: Fetch favorites list directly from your Flask database
  async function fetchFavorites() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setFavorites(Array.isArray(data) ? data : []);
      } else {
        setError("Failed to fetch favorite rows.");
      }
    } catch (err) {
      setError("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="favorites-page">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        <p>Your saved games collection</p>
      </div>

      {error && <p className="error-message" style={{ color: "#ff4d4d", textAlign: "center" }}>{error}</p>}
      {loading && <p className="loading-message" style={{ color: "#a29bfe", textAlign: "center" }}>Syncing data matrices...</p>}

      {!loading && favorites.length === 0 ? (
        <div className="empty-favorites">
          <h2>No Favorites Yet</h2>
          <p>Browse games and add some to your favorites collection.</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
      
    </main>
  );
}

export default Favorites;
