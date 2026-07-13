import React from "react";
import { useFavorites } from "../../context/useFavorites"; // Matches their dynamic refactor pointer
import GameCard from "../../components/GameCard/GameCard";
import "./Favorites.css"; // Restored your CSS reference

function Favorites() {
  // Uses Phase 3 global provider state array instead of hardcoded local fetching loops
  const { favorites } = useFavorites(); 

  return (
    <main className="favorites-page">
      {/* Restored your gorgeous custom Phase 2 headers layout */}
      <div className="favorites-header">
        <h1>My Favorites</h1>
        <p>Your saved games collection</p>
      </div>

      {favorites.length === 0 ? (
        /* Restored your clean, helpful user feedback for empty slots */
        <div className="empty-favorites">
          <h2>No Favorites Yet</h2>
          <p>Browse games and add some to your favorites collection.</p>
        </div>
      ) : (
        /* Renders with your standardized layout grids wrapper */
        <div className="favorites-grid">
          {favorites.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Favorites;

