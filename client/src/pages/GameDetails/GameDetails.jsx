import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// Phase 3 Authentication, Favorites, and API Services Integration Hooks
import { useAuth } from "../../context/useAuth";
import { useFavorites } from "../../context/useFavorites";
import { getGameById, getGameScreenshots } from "../../services/gameApi";
import {
  deleteGameReview,
  getGameReviews,
  submitGameReview,
  updateGameReview,
} from "../../services/reviewsApi";
import "./GameDetails.css";

// Helper script to sanitize messy RAWG HTML tags out of paragraph descriptions
function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addFavorite, isFavorite, removeFavorite } = useFavorites();

  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form input and tracking states for Phase 3 Player Reviews Engine
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [favoriteError, setFavoriteError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchAllData() {
      try {
        setLoading(true);
        const [gameData, screenshotsData, backendReviews] = await Promise.all([
          getGameById(id),
          getGameScreenshots(id),
          getGameReviews(id),
        ]);

        if (!ignore) {
          setGame(gameData);
          setScreenshots(screenshotsData?.results || []);
          setReviews(backendReviews || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchAllData();

    return () => {
      ignore = true;
    };
  }, [id]);

  const description = useMemo(() => {
    if (!game) return "";
    return game.description_raw || stripHtml(game.description);
  }, [game]);

  // Phase 3 Secure Favorites Toggle Handler Hook Linkage
  async function handleFavoriteToggle() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/games/${id}` } } });
      return;
    }

    setFavoriteError("");

    try {
      if (isFavorite(game.id)) {
        await removeFavorite(game.id);
      } else {
        await addFavorite(game);
      }
    } catch (err) {
      setFavoriteError(err.message);
    }
  }

  // Phase 3 CRUD: Create a review entry block
  async function handleReviewSubmit(event) {
    event.preventDefault();
    if (!reviewText.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const newReview = await submitGameReview(id, {
        rating: Number(userRating),
        comment: reviewText,
      });

      setReviews((currentReviews) => [newReview, ...currentReviews]);
      setReviewText("");
      setUserRating(5);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(review) {
    setEditingReviewId(review.id);
    setEditText(review.comment);
    setEditRating(review.rating);
  }

  // Phase 3 CRUD: Update an existing review card entry
  async function handleReviewUpdate(event) {
    event.preventDefault();

    try {
      const updatedReview = await updateGameReview(editingReviewId, {
        rating: Number(editRating),
        comment: editText,
      });

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === updatedReview.id ? updatedReview : review
        )
      );
      setEditingReviewId(null);
      setEditText("");
      setEditRating(5);
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  // Phase 3 CRUD: Delete a custom player review block from SQL database
  async function handleReviewDelete(reviewId) {
    const shouldDelete = window.confirm("Are you sure you want to delete this review?");

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteGameReview(reviewId);
      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId)
      );
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  if (loading) return <main className="route-state">Loading game details...</main>;
  if (error) return <main className="route-state">Error: {error}</main>;
  if (!game) return <main className="route-state">Game not found.</main>;
  return (
    <main className="game-details-container">
      <button onClick={() => navigate(-1)} className="back-button" type="button">
        &larr; Back
      </button>

      <header className="game-header">
        <div>
          <h1>{game.name}</h1>
          <p className="release-date">
            {game.released
              ? `Released ${new Date(game.released).toLocaleDateString()}`
              : "Release date unavailable"}
          </p>
        </div>

        <button
          type="button"
          className={`favorite-toggle ${isFavorite(game.id) ? "favorite-toggle--saved" : ""}`}
          onClick={handleFavoriteToggle}
          aria-pressed={isFavorite(game.id)}
        >
          {isFavorite(game.id) ? "❤️ Saved" : "🤍 Save"}
        </button>
      </header>

      {favoriteError && <p className="error-text">{favoriteError}</p>}

      {game.background_image && (
        <img src={game.background_image} alt={game.name} className="hero-image" />
      )}

      <div className="game-content">
        <section className="game-info-main">
          <h2>About</h2>
          <p className="description">
            {description || "No description is available for this game yet."}
          </p>
        </section>

        <aside className="game-meta">
          <div className="meta-item">
            <h3>Rating</h3>
            <p>⭐ {game.rating ? `${game.rating} / 5` : "Not rated"}</p>
          </div>

          {/* PROTECTED AND RESTORED: Phase 2 Genres Metadata Displays Container */}
          {game.genres && game.genres.length > 0 && (
            <div className="meta-item">
              <h3>Genres</h3>
              <div className="tag-list" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                {game.genres.map((genre) => (
                  <span key={genre.id} className="tag" style={{ background: "rgba(139, 92, 246, 0.2)", border: "1px solid #8b5cf6", padding: "4px 10px", borderRadius: "6px", fontSize: "0.85rem" }}>
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PROTECTED AND RESTORED: Phase 2 Platforms Metadata Tags Container */}
          {game.platforms && game.platforms.length > 0 && (
            <div className="meta-item">
              <h3>Platforms</h3>
              <div className="tag-list" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                {game.platforms.map((p) => (
                  <span key={p.platform.id} className="tag" style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid #3b82f6", padding: "4px 10px", borderRadius: "6px", fontSize: "0.85rem" }}>
                    {p.platform.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="meta-item">
            <h3>Reviews</h3>
            <p>📝 {reviews.length} total</p>
          </div>
        </aside>
      </div>

      {screenshots.length > 0 && (
        <section className="game-gallery">
          <h2>Screenshots</h2>
          <div className="gallery-grid">
            {screenshots.map((shot) => (
              <img
                key={shot.id}
                src={shot.image}
                alt={`${game.name} gameplay snapshot`}
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}

      {/* Phase 3 Interactive Reviews Integration Dashboard */}
      <section className="reviews-section">
        <div className="reviews-heading">
          <h2>Player Reviews</h2>
          <span>{reviews.length} total</span>
        </div>

        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h3>Leave a Review</h3>
            {submitError && <p className="error-text">{submitError}</p>}

            <label htmlFor="review-rating" style={{ display: "block", marginBottom: "4px" }}>Rating</label>
            <select
              id="review-rating"
              value={userRating}
              onChange={(event) => setUserRating(event.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "12px", borderRadius: "6px", background: "#0a122c", color: "#fff", border: "1px solid var(--color-border)" }}
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} ⭐
                </option>
              ))}
            </select>

            <label htmlFor="review-comment" style={{ display: "block", marginBottom: "4px" }}>Review</label>
            <textarea
              id="review-comment"
              placeholder="What did you think of the gameplay, story, or mechanics?"
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              required
              rows="4"
              style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", background: "#0a122c", color: "#fff", border: "1px solid var(--color-border)", resize: "vertical" }}
            />

            <button type="submit" disabled={isSubmitting || !reviewText.trim()}>
              {isSubmitting ? "Posting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="review-login" style={{ padding: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "10px", textAlign: "center" }}>
            <p style={{ marginBottom: "12px" }}>Log in to save favourites and leave a review.</p>
            <Link to="/login" state={{ from: { pathname: `/games/${id}` } }} style={{ color: "#a78bfa", fontWeight: "bold", textDecoration: "none" }}>
              Log in &rarr;
            </Link>
          </div>
        )}

        <div className="reviews-list" style={{ marginTop: "1.5rem" }}>
          {reviews.length === 0 ? (
            <p className="no-reviews" style={{ color: "var(--color-text-secondary)" }}>No reviews yet.</p>
          ) : (
            reviews.map((review) => {
              const canEdit = user?.id === review.user_id;

              return (
                <article key={review.id} className="review-card" style={{ background: "rgba(15,23,42,0.6)", padding: "1rem", borderRadius: "10px", marginBottom: "1rem", border: "1px solid var(--color-border)" }}>
                  <div className="review-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "4px" }}>
                    <strong>👤 {review.username || review.user}</strong>
                    <span style={{ color: "#facc15" }}>{review.rating} / 5 ⭐</span>
                  </div>

                  {editingReviewId === review.id ? (
                    <form className="review-edit-form" onSubmit={handleReviewUpdate}>
                      <select
                        value={editRating}
                        onChange={(event) => setEditRating(event.target.value)}
                        style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "6px", background: "#0a122c", color: "#fff" }}
                      >
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} ⭐
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        rows="3"
                        required
                        style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "6px", background: "#0a122c", color: "#fff" }}
                      />
                      <div className="review-actions" style={{ display: "flex", gap: "8px" }}>
                        <button type="submit">Save</button>
                        <button
                          type="button"
                          className="button-secondary"
                          onClick={() => setEditingReviewId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p style={{ margin: "8px 0" }}>{review.comment}</p>
                      <small style={{ color: "var(--color-text-secondary)" }}>
                        {review.date
                          ? new Date(review.date).toLocaleDateString()
                          : "Date unavailable"}
                      </small>

                      {canEdit && (
                        <div className="review-actions" style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                          <button type="button" onClick={() => startEditing(review)} style={{ padding: "4px 10px", fontSize: "0.85rem" }}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="button-danger"
                            onClick={() => handleReviewDelete(review.id)}
                            style={{ padding: "4px 10px", fontSize: "0.85rem", background: "#ef4444", border: "none", color: "#fff", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

export default GameDetails;
