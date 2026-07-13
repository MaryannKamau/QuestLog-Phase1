import { API_BASE_URL, apiRequest } from "./authApi";

export async function getGameReviews(gameId) {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}/reviews`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return await response.json();
  } catch (error) {
    console.warn(error.message);
    return []; // Return empty array so the page doesn't break if the backend is down
  }
}

export async function submitGameReview(gameId, reviewData) {
  return apiRequest(`/games/${gameId}/reviews`, {
    method: "POST",
    body: reviewData,
  });
}

export async function updateGameReview(reviewId, reviewData) {
  return apiRequest(`/reviews/${reviewId}`, {
    method: "PATCH",
    body: reviewData,
  });
}

export async function deleteGameReview(reviewId) {
  return apiRequest(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
}
