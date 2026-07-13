import React, { useEffect, useState } from "react";
import "./BrowseGames.css";

import SearchBar from "../../components/SearchBar/SearchBar";
import Filters from "../../components/Filters/Filters";
import GameCard from "../../components/GameCard/GameCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

import {
  getGames,
  searchGames,
  getFilteredGames,
} from "../../services/gameApi";

function BrowseGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    if (genre !== "" || platform !== "" || sortBy !== "") {
      handleFilters();
    }
  }, [genre, platform, sortBy]);

  async function loadGames() {
    try {
      setLoading(true);
      setError("");

      const data = await getGames();
      setGames(data.results || []);
    } catch (err) {
      setError("Failed to load games.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query) {
    try {
      setLoading(true);
      setError("");

      const data = await searchGames(query);
      setGames(data.results || []);
    } catch (err) {
      setError("Failed to search games.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFilters() {
    try {
      setLoading(true);
      setError("");

      const data = await getFilteredGames({
        genre,
        platform,
        sortBy,
      });

      setGames(data.results || []);
    } catch (err) {
      setError("Failed to filter games.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="browse-games">
      <div className="browse-games-header">
        <h1>Browse Games</h1>
        <p>Discover your next gaming adventure.</p>
      </div>

      <div className="search-filter-container">
        <SearchBar onSearch={handleSearch} isSearching={loading} />

        <Filters
          genre={genre}
          platform={platform}
          sortBy={sortBy}
          onGenreChange={setGenre}
          onPlatformChange={setPlatform}
          onSortChange={setSortBy}
        />
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="error-message">{error}</p>}

      {!loading && games.length === 0 && (
        <div className="no-games">
          <p>No games found.</p>
        </div>
      )}

      {!loading && games.length > 0 && (
        <div className="games-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </main>
  );
}

export default BrowseGames;