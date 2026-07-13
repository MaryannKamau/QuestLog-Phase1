import React, { useState, useEffect } from "react";
import "./Collections.css";
import { Link } from "react-router-dom";

function Collections() {
  const [collections, setCollections] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hardcoded for development until your team connects global Auth session context
  const USER_ID = 2; 
  
  const API_BASE = `https://questlog-backend-2.onrender.com/api/collections`;

  useEffect(() => {
    fetchCollections();
  }, []);

  // 1. READ: Fetch lists from Flask
  async function fetchCollections() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/user/${USER_ID}`);
      if (res.ok) {
        const data = await res.json();
        setCollections(Array.isArray(data) ? data : []);
      } else {
        setError("Backend rejected collection query block.");
      }
    } catch (err) {
      setError("Failed to load your collections.");
    } finally {
      setLoading(false);
    }
  }
        

  // 2. CREATE: Add a brand new collection board
  async function handleCreateList(e) {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName, user_id: USER_ID })
      });
      if (res.ok) {
        setNewListName("");
        fetchCollections(); // Refresh layout view grids
      }
    } catch (err) {
      setError("Failed to create collection.");
    }
  }

  // 3. DELETE: Drop an entire collection board completely
  async function handleDeleteCollection(id) {
    if (!window.confirm("Are you sure you want to delete this entire collection?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (res.ok) fetchCollections();
    } catch (err) {
      setError("Failed to delete collection.");
    }
  }

  // 4. DELETE: Remove a single specific game inside a list
  async function handleRemoveGame(gameEntryId) {
    try {
      const res = await fetch(`${API_BASE}/game/${gameEntryId}`, { method: "DELETE" });
      if (res.ok) fetchCollections();
    } catch (err) {
      setError("Failed to remove game.");
    }
  }

  return (
    <main className="collections-container">
      <div className="collections-header">
        <h1>Your Tracking Boards</h1>
        <p>Manage your backlog queues and personal play states.</p>
      </div>

      {/* CREATE FORM */}
      <form onSubmit={handleCreateList} className="create-list-form">
        <input 
          type="text" 
          placeholder="e.g., Wishlist, Currently Playing, Finished" 
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button type="submit">Create New Collection</button>
      </form>

      {error && <p className="error-banner">{error}</p>}
      {loading && <p className="loading-banner">Syncing data matrices...</p>}

      {/* RENDER LISTS & NESTED GAMES */}
      <div className="collections-grid">
        {!loading && collections.length === 0 && <p className="empty-text">No collection boards created yet.</p>}
        
        {collections.map((list) => (
          <div key={list.id} className="collection-board">
            <div className="board-title-row">
              <h2>{list.name} ({list.games.length})</h2>
              <button onClick={() => handleDeleteCollection(list.id)} className="delete-board-btn">🗑️ Delete List</button>
            </div>

            <div className="board-games-list">
              {list.games.length === 0 && <p className="no-games-text">Drop titles into this workspace shelf.</p>}
              {list.games.map((game) => (
                <div key={game.id} className="board-game-item">

                  <Link 
                    to={`/games/${game.game_id || game.id}`} 
                    className="board-game-link"
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "15px", 
                      textDecoration: "none", 
                      color: "inherit",
                      flex: "1"
                    }}
                  >
                  <img src={game.background_image} alt={game.name} />
                  <span>{game.name}</span>
                  </Link>
                  <button onClick={() => handleRemoveGame(game.id)} className="remove-game-btn">✕</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Collections;
