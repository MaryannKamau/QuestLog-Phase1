import React from "react";
import { Link } from "react-router-dom";
import { addGameToCollection } from "../../services/collectionsApi";
import "./GameCard.css";

const GameCard = ({ game }) => {
  const {
    id,
    name,
    background_image,
    rating,
    released,
  } = game;

  const handleSaveToCollection = async (collectionName) => {
    try {
      await addGameToCollection(collectionName, game);
    } catch (error) {
      console.error("Failed to commit card to database storage:", error.message);
    }
  };

  return (
    <div className="game-card">
      <div className="card-image-container">
        <img
          src={background_image || 'https://placehold.co'}
          alt={name}
          className="card-image"
        />

        {rating && (
          <span className="game-rating">
            ⭐ {rating}
          </span>
        )}
      </div>

      <div className="card-info-box">
        <h3 className="game-title">{name}</h3>

        <div className="card-content">
          <p className="game-release-date">
            Released: {released || "Unknown"}
          </p>
        </div>

        <div className="card-action-row" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <select 
            className="collection-select"
            onChange={(e) => {
              if (e.target.value) {
                handleSaveToCollection(e.target.value);
                e.target.value = "";
              }
            }}
            style={{ padding: '0.4rem', borderRadius: '4px', background: '#0b111e', color: '#fff', border: '1px solid #231942', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <option value="">Save Game</option>
            <option value="Wishlist">Wishlist</option>
            <option value="Currently Playing"> Playing</option>
            <option value="Completed"> Completed</option>
          </select>

          <Link
            to={`/games/${id}`}
            className="details-button"
            style={{ flexGrow: 1, textAlign: 'center' }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
