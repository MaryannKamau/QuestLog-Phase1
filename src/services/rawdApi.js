const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const BASE_URL = "https://api.rawg.io/api";

export async function getGames() {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  return response.json();
}

export async function getGameById(id) {
  const response = await fetch(
    `${BASE_URL}/games/${id}?key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch game");
  }

  return response.json();
}

export async function searchGames(searchTerm) {
  const response = await fetch(
    `${BASE_URL}/games?search=${searchTerm}&key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
}
// NEW FUNCTION: Fetch screenshots for the gallery
export async function getGameScreenshots(id) {
  const response = await fetch(`${BASE_URL}/games/${id}/screenshots?key=${API_KEY}`);
  if (!response.ok) {
    throw new Error("Failed to fetch screenshots");
  }
  return response.json();
}