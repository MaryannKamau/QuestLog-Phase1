import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./GameCard.css";

const GameCard = ({ game }) => {
  const {
    id,
    name,
    background_image,
    rating,
    released,
  } = game;

  const [userLists, setUserLists] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState("");

  const USER_ID = 2;
  
  const COLL_API = `https://questlog-backend-2.onrender.com/api/collections`;
  const FAV_API = `https://questlog-backend-2.onrender.com/api/favourites`;

  useEffect(() => {
    // 1. Fetch available lists for the save dropdown options
    fetch(`${COLL_API}/user/${USER_ID}`)
      .then((res) => res.json())
      .then((data) => setUserLists(data))
      .catch(() => {});

    // 2. Check if this game is already in favorite on backend 
    fetch(`${FAV_API}/user/${USER_ID}`)
      .then((res) => res.json())
      .then((favs) => {
        const found = favs.some((f) => f.game_id === id || f.rawg_game_id === id);
        setIsFavorite(found);
      })
      .catch(() => {});
  }, [id]);

  // 3.Add game to a selected collection board
  async function handleAddToList(collectionId) {
    if (!collectionId) return;
    setMessage("Saving...");
    try {
      const res = await fetch(`${COLL_API}/${collectionId}/add-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: id, 
          game_name: name,
          game_image: background_image
        })
      });
      const data = await res.json();
      setMessage(data.message || "Saved!");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Error saving");
    }
  }

  // 4.Toggle favorite heart icon inside SQL
  async function handleToggleFavorite() {
    try {
      const res = await fetch(`${FAV_API}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: USER_ID,
          game_id: id,          
          rawg_game_id: id
        })
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch {}
  }

  return (
    <div className="game-card">
      <div className="card-image-container">
        <img
          src={background_image}
          alt={name}
          className="card-image"
        />

        {rating && (
          <span className="game-rating">
            ⭐ {rating}
          </span>
        )}

        {/* FLOATING INTERACTIVE FAVORITE HEART ICON */}
        <button 
          className={`fav-heart-btn ${isFavorite ? "active" : ""}`} 
          onClick={handleToggleFavorite}
          title="Toggle Favorite Status"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="card-info-box">
        <h3 className="game-title">{name}</h3>

        <div className="card-content">
          <p className="game-release-date">
            Released: {released || "Unknown"}
          </p>
        </div>

        {/* FEEDBACK STATUS TEXT CONTAINER */}
        {message && <p className="action-feedback-status">{message}</p>}

        {/* ADD TO COLLECTION INTERACTIVE DROPDOWN */}
        <div className="add-to-collection-wrapper">
          <select 
            onChange={(e) => {
              handleAddToList(e.target.value);
              e.target.value = ""; 
            }}
            defaultValue=""
          >
            <option value="" disabled>➕ Add to collection...</option>
            {userLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        <Link
          to={`/games/${id}`}
          className="view-details-btn"
          
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
