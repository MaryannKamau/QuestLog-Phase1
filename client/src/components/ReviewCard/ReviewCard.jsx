import React from "react";


function ReviewCard({ 
  review, 
  user, 
  editingReviewId, 
  editRating, 
  setEditRating, 
  editText, 
  setEditText, 
  handleReviewUpdate, 
  setEditingReviewId, 
  startEditing, 
  handleReviewDelete 
}) {
  const canEdit = user?.id === review.user_id;

  return (
    <article 
      className="review-card" 
      style={{ 
        background: "rgba(15,23,42,0.6)", 
        padding: "1rem", 
        borderRadius: "10px", 
        marginBottom: "1rem", 
        border: "1px solid var(--color-border)" 
      }}
    >
      <div 
        className="review-header" 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "8px", 
          borderBottom: "1px solid rgba(255,255,255,0.1)", 
          paddingBottom: "4px" 
        }}
      >
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
          <p style={{ margin: "8px 0", color: "#ffffff" }}>{review.comment}</p>
          <small style={{ color: "var(--color-text-secondary)" }}>
            {review.date
              ? new Date(review.date).toLocaleDateString()
              : "Date unavailable"}
          </small>

          {canEdit && (
            <div className="review-actions" style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button 
                type="button" 
                onClick={() => startEditing(review)} 
                style={{ padding: "4px 10px", fontSize: "0.85rem", cursor: "pointer" }}
              >
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
}

export default ReviewCard;
