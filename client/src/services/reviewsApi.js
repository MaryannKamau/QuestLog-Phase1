// Connected securely to your live Render server deployment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://questlog-backend-7tvc.onrender.com/api";
const TOKEN_KEY = "questlog_token";

// 1. READ: Fetch all player text reviews for a specific video game ID
export async function getGameReviews(gameId) {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}/reviews`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return await response.json();
  } catch (error) {
    console.warn(error.message);
    return []; // Fallback array ensures your details page layout UI never freezes
  }
}

// 2. CREATE: Securely push a brand new user review card block into the SQL database
export async function submitGameReview(gameId, reviewData) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}/games/${gameId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Protects the route on your backend pipeline
    },
    body: JSON.stringify(reviewData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to submit review");
  return data;
}

// 3. UPDATE: Securely modify an existing gameplay text review card or star rating
export async function updateGameReview(reviewId, reviewData) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(reviewData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to update review");
  return data;
}

// 4. DELETE: Securely drop a review entry row permanently out of your server logs
export async function deleteGameReview(reviewId) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Failed to delete review");
  return data;
}
