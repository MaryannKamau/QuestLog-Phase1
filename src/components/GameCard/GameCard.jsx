import { Link } from "react-router-dom";
import "./GameCard.css";

function GameCard({ game }) {
  return (
    <div className="game-card">
      <img
        src={game.background_image}
        alt={game.name}
        className="game-card-image"
      />

      <div className="game-card-content">
        <h3>{game.name}</h3>

        <p className="rating">
          ⭐ Rating: {game.rating}
        </p>

        <p className="release-date">
          📅 Released: {game.released}
        </p>

        <Link
          to={`/games/${game.id}`}
          className="details-button"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default GameCard;