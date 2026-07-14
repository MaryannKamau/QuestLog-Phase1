// Connected securely to your live production Render server deployment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://questlog-backend-7tvc.onrender.com/api";
const TOKEN_KEY = "questlog_token";

// 1. READ: Fetch all favorites from your Flask backend (uses 'u' in endpoint)
export async function getFavourites() {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}/favourites`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to fetch favorites.");
  return data;
}

// 2. CREATE: Securely add a game to the backend (uses 'u' in endpoint)
export async function saveFavourite(game) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}/favourites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      game_id: game.id,
      game: game
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to add game to favorites.");
  return data;
}

// 3. DELETE: Securely drop a saved game block out of your collection (uses 'u' in endpoint)
export async function deleteFavourite(gameId) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}/favourites/${gameId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Failed to remove game from favorites.");
  return data;
}
