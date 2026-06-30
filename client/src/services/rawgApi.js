const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
};

export const getGames = async () => {
  const response = await fetch(`${BASE_URL}/games?key=${API_KEY}`);
  return handleResponse(response, "Failed to fetch games");
};

export const searchGames = async (query) => {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&search=${query}`
  );

  return handleResponse(response, "Failed to search games");
};

export const getFilteredGames = async ({ genre, platform, sortBy }) => {
  let url = `${BASE_URL}/games?key=${API_KEY}`;

  if (genre) url += `&genres=${genre}`;
  if (platform) url += `&platforms=${platform}`;
  if (sortBy) url += `&ordering=${sortBy}`;

  const response = await fetch(url);
  return handleResponse(response, "Failed to fetch filtered games");
};

export const getGameById = async (id) => {
  const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
  return handleResponse(response, "Failed to fetch game details");
};

export const getGameScreenshots = async (id) => {
  const response = await fetch(
    `${BASE_URL}/games/${id}/screenshots?key=${API_KEY}`
  );

  return handleResponse(response, "Failed to fetch screenshots");
};