import React from "react";
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
      </div>

      <div className="card-info-box">
        <h3 className="game-title">{name}</h3>

        <div className="card-content">
          <p className="game-release-date">
            Released: {released || "Unknown"}
          </p>
        </div>

        <Link
          to={`/games/${id}`}
          className="details-button"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default GameCard;