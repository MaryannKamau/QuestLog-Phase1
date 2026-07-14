import { useState, useEffect } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch, isSearching = false }) {
  // 1. Initialize state directly from browser sessionStorage if it exists
  const [query, setQuery] = useState(() => {
    return sessionStorage.getItem("questlog_search_query") || "";
  });

  // 2. Proactively trigger the search on mount if a stored query was found
  useEffect(() => {
    if (query.trim()) {
      onSearch(query);
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    // 3. Save the exact search value right before executing the query
    sessionStorage.setItem("questlog_search_query", query);
    onSearch(query);
  }

  // 4. Clear Handler (Optional but helpful: clears storage when input is completely emptied)
  const handleInputChange = (event) => {
    const val = event.target.value;
    setQuery(val);
    if (!val.trim()) {
      sessionStorage.removeItem("questlog_search_query");
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="search-bar__label" htmlFor="game-search">
        Search games
      </label>

      <div className="search-bar__controls">
        <input
          className="search-bar__input"
          id="game-search"
          type="search"
          value={query}
          onChange={handleInputChange}
          placeholder="Try Minecraft, FIFA..."
          autoComplete="off"
        />

        <button
          className="search-bar__button"
          type="submit"
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? "Searching" : "Search"}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;

