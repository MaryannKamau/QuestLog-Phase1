// Retained your secure fallback connection to your live Render server deployment
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://questlog-backend-2.onrender.com/api";

async function requestGames(params = {}) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });

  const url = `${API_BASE_URL}/games?${queryParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch games catalog.");
  }

  return response.json();
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

// Phase 3 Integrated Helper: Fetches individual video game descriptions
export async function getGameById(id) {
  const response = await fetch(`${API_BASE_URL}/games/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch game details.");
  }

  return response.json();
}

// Phase 3 Integrated Helper: Fetches image screenshot carousels
export async function getGameScreenshots(id) {
  const response = await fetch(`${API_BASE_URL}/games/${id}/screenshots`);

  if (!response.ok) {
    throw new Error("Failed to fetch screenshots.");
  }

  return response.json();
}
