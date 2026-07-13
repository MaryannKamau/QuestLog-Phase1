const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://questlog-backend-2.onrender.com/api";

async function requestGames(params = {}) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/games?${queryParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch games.");
  }

  const data = await response.json();

  return {
    results: data.games || [],
    count: data.count || 0,
  };
}

export function getGames() {
  return requestGames();
}

export function searchGames(query) {
  return requestGames({ search: query });
}

export function getFilteredGames({ genre, platform, sortBy }) {
  return requestGames({
    genre,
    platform,
    sort_by: sortBy,
  });
}