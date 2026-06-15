const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export const getGames = async () => {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  return response.json();
};

export const getGameById = async (id) => {
  const response = await fetch(
    `${BASE_URL}/games/${id}?key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch game");
  }

  return response.json();
};

export const searchGames = async (query) => {
  const response = await fetch(
    `${BASE_URL}/games?search=${query}&key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to search games");
  }

  return response.json();
};