import React, { useState, useEffect } from 'react';
import './Collections.css';

import { fetchCollections, deleteCollectionGame } from '../../services/collectionsApi';

const Collections = () => {
   const [ collections, setCollections ] = useState([]);
   const [ loading, setLoading ] = useState(true);
   const [ error, setError ] = useState(null);

   const currentUserId = 1; 

   useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const loadBackendData = async () => {
      try {
        setLoading(true);

        const data = await fetchCollections(currentUserId);
        setCollections(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadBackendData();
  }, [currentUserId]);

  const handleRemoveGame = async (gameId) => {
    try {
      await deleteCollectionGame( gameId);
      setCollections(prevCollections => prevCollections.map(category => ({
        ...category,
        games: category.games.filter(game => game.id !== gameId)
      })));
    } catch (error) {
      console.error("Error removing game from collection:", error);
    }
  };

  const playingCategory = collections.find(c => c.name?.toLowerCase() === 'currently playing' || c.name?.toLowerCase() === 'playing');
  const wishlistCategory = collections.find(c => c.name?.toLowerCase() === 'wishlist');
  const completedCategory = collections.find(c => c.name?.toLowerCase() === 'completed quests' || c.name?.toLowerCase() === 'completed');

  const playingGames = playingCategory?.games || [];
  const wishlistGames = wishlistCategory?.games || [];
  const completedGames = completedCategory?.games || [];

  if (loading) {
    return <div className="loading-state" style={{ padding: '4rem 2rem', color: '#fff', textAlign: 'center' }}><p>Loading your collections...</p></div>;
  }
  
  if (error) {
    return <div className="error-state" style={{ padding: '4rem 2rem', color: '#ef4444', textAlign: 'center' }}><p>Error loading collections: {error}</p></div>;
  }

  if (!currentUserId) {
    return <div className="auth-state" style={{ padding: '4rem 2rem', color: '#fff', textAlign: 'center' }}><p>Please log in to view your collections.</p></div>;
  }
  
  return (
    <div className="collections-dashboard">
      <header className="dashboard-header">
        <h1>My QuestLog Collections</h1>
        <p>Manage your backlog, track your active quests, and log your achievements.</p>
      </header>

      {collections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted, #64748b)' }}>
          <p>You have no tracking boards initialized in the database yet.</p>
        </div>
      ) : (
        <div className="collections-board-layout">
          
          {/* COLUMN 1: CURRENTLY PLAYING */}
          <section className="collection-column playing-board">
            <h2> Currently Playing ({playingGames.length})</h2>
            <div className="column-grid">
              {playingGames.map(game => (
                <div key={game.id} className="mini-collection-card">
                  <img src={game.image || game.game_image} alt={game.name || game.game_name} />
                  <div className="mini-card-details">
                    <h4>{game.name || game.game_name}</h4>
                    <button onClick={() => handleRemoveGame(game.id)} className="remove-item-btn">🗑️ Remove</button>
                  </div>
                </div>
              ))}
              {playingGames.length === 0 && <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No games actively tracking.</p>}
            </div>
          </section>

          {/* COLUMN 2: WISHLIST */}
          <section className="collection-column wishlist-board">
            <h2> Wishlist ({wishlistGames.length})</h2>
            <div className="column-grid">
              {wishlistGames.map(game => (
                <div key={game.id} className="mini-collection-card">
                  <img src={game.image || game.game_image} alt={game.name || game.game_name} />
                  <div className="mini-card-details">
                    <h4>{game.name || game.game_name}</h4>
                    <button onClick={() => handleRemoveGame(game.id)} className="remove-item-btn">🗑️ Remove</button>
                  </div>
                </div>
              ))}
              {wishlistGames.length === 0 && <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No games actively tracking.</p>}
            </div>
          </section>

          {/* COLUMN 3: COMPLETED */}
          <section className="collection-column completed-board">
            <h2> Completed Quests ({completedGames.length})</h2>
            <div className="column-grid">
              {completedGames.map(game => (
                <div key={game.id} className="mini-collection-card">
                  <img src={game.image || game.game_image} alt={game.name || game.game_name} />
                  <div className="mini-card-details">
                    <h4>{game.name || game.game_name}</h4>
                    <button onClick={() => handleRemoveGame(game.id)} className="remove-item-btn">🗑️ Remove</button>
                  </div>
                </div>
              ))}
              {completedGames.length === 0 && <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No games actively tracking.</p>}
            </div>
          </section>

        </div>
      )}
    </div>
  );
};

export default Collections;