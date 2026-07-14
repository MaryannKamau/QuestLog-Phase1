import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Combined Hooks: Phase 2 layout dependencies + Phase 3 Dynamic Auth Hooks
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/useFavorites";
import "./GameCard.css";

const GameCard = ({ game }) => {
  const navigate = useNavigate();
  
  // Phase 3 Authentication & Refactored Favorites Context
  const { isAuthenticated, user } = useAuth(); 
  const { addFavorite, isFavorite, removeFavorite } = useFavorites();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Phase 2 Dynamic User Collections State & Core API Connections
  const [userLists, setUserLists] = useState([]);
  const [message, setMessage] = useState("");

  // FIXED: Dynamically falls back to your active environment variable path rather than a hardcoded server link
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://questlog-backend-7tvc.onrender.com/api";
  const COLL_API = `${API_BASE_URL}/collections`;

  const {
    id,
    name,
    background_image,
    rating,
    released,
  } = game;

  const saved = isFavorite(id);

  // Phase 2 Lifecycle Hook - Safely tracks when users log in/out to switch collections
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setUserLists([]); // Clear dropdown arrays if logged out
      return;
    }

    fetch(`${COLL_API}/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setUserLists(data))
      .catch(() => {});
  }, [id, isAuthenticated, user?.id]);

  // Phase 2 Asynchronous connection to push game snapshots into custom boards
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

  // Phase 3 Refactored Security Handler for Toggling Favorites
  async function handleFavoriteClick() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/favorites" } } });
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      if (saved) {
        await removeFavorite(id);
      } else {
        await addFavorite(game);
      }
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="game-card">
      <div className="card-image-container">
        {background_image ? (
          <img
            src={background_image}
            alt={name}
            className="card-image"
            loading="lazy"
          />
        ) : (
          <div className="card-image card-image--empty">{name.charAt(0)}</div>
        )}

        {rating && (
          <span className="game-rating">
            ⭐ {rating.toFixed ? rating.toFixed(1) : rating}
          </span>
        )}

        {/* FLOATING INTERACTIVE FAVORITE HEART ICON */}
        <button 
          className={`fav-heart-btn ${saved ? "active" : ""}`} 
          onClick={handleFavoriteClick} 
          disabled={isSaving} 
          title="Toggle Favorite Status"
        >
          {saved ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="card-info-box">
        <div className="card-meta">
          <h3>{name}</h3>
          <p className="release-date">
            Released: {released ? released : "N/A"}
          </p>
        </div>

        {/* FEEDBACK STATUS CONTAINER */}
        {message && <p className="action-feedback-status">{message}</p>}
        {saveError && <p className="game-card__error">{saveError}</p>}

        {/* DYNAMIC ADD TO COLLECTION DROPDOWN - Displays only when logged in */}
        {isAuthenticated && userLists.length > 0 && (
          <div className="add-to-collection-wrapper" style={{ marginBottom: "1rem" }}>
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
        )}

        {/* Refactored Phase 3 Toggle Save Button */}
        <button
          type="button"
          className={`favorite-button ${saved ? "favorite-button--saved" : ""}`}
          onClick={handleFavoriteClick}
          disabled={isSaving}
          aria-pressed={saved}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        >
          {isSaving ? "Saving..." : saved ? "❤️ Saved" : "🤍 Save to Favorites"}
        </button>

        <Link
          to={`/games/${id}`}
          className="details-button"
          style={{ display: "block", textAlign: "center", textDecoration: "none" }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
