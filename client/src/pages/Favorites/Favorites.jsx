import { useFavorites } from "../../context/FavoritesContext";
import GameCard from "../../components/GameCard/GameCard";

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <main>
      <h1>My Favorites</h1>

      {favorites.length === 0 ? (
        <p>No favorite games yet.</p>
      ) : (
        <div className="games-grid">
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