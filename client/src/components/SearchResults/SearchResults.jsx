import GameCard from "../GameCard/GameCard";
import "./SearchResults.css";

function SearchResults({ games, query, status, error }) {
  if (status === "idle") {
    return <p>Search for a game to get started.</p>;
  }

  if (status === "loading") {
    return <p>Searching games...</p>;
  }

  if (status === "error") {
    return <p>{error}</p>;
  }

  if (!games.length) {
    return <p>No games found for "{query}".</p>;
  }

  return (
    <section className="search-results">
      <h2>Search results for "{query}"</h2>

      <div className="search-results-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}

export default SearchResults;