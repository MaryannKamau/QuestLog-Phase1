import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameById, getGameScreenshots } from "../../services/rawdApi";
import "./GameDetails.css"; // Optional: For the gallery grid styling

function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        // Fetch both details and screenshots concurrently for better performance
        const [gameData, screenshotsData] = await Promise.all([
          getGameById(id),
          getGameScreenshots(id)
        ]);
        
        setGame(gameData);
        setScreenshots(screenshotsData.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  if (loading) return <div className="loading">Loading game details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!game) return <div className="not-found">Game not found.</div>;

  return (
    <div className="game-details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back
      </button>

      <header className="game-header">
        <h1>{game.name}</h1>
        {game.background_image && (
          <img 
            src={game.background_image} 
            alt={`${game.name} background`} 
            className="hero-image" 
          />
        )}
      </header>

      <div className="game-content">
        {/* Game Information Section */}
        <section className="game-info-main">
          <h2>About</h2>
          {/* RAWG returns description in HTML format, so we use dangerouslySetInnerHTML */}
          <div 
            className="description" 
            dangerouslySetInnerHTML={{ __html: game.description }} 
          />
        </section>

        {/* Rating, Genres, Platforms, Release Date Section */}
        <aside className="game-meta">
          <div className="meta-item">
            <h3>Release Date</h3>
            <p>{game.released ? new Date(game.released).toLocaleDateString() : "TBA"}</p>
          </div>

          <div className="meta-item">
            <h3>Rating</h3>
            <p>⭐ {game.rating} / 5</p>
          </div>

          <div className="meta-item">
            <h3>Genres</h3>
            <div className="tag-list">
              {game.genres?.map((genre) => (
                <span key={genre.id} className="tag">{genre.name}</span>
              ))}
            </div>
          </div>

          <div className="meta-item">
            <h3>Platforms</h3>
            <div className="tag-list">
              {game.platforms?.map((p) => (
                <span key={p.platform.id} className="tag">{p.platform.name}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Screenshots Gallery Section */}
      {screenshots.length > 0 && (
        <section className="game-gallery">
          <h2>Screenshots</h2>
          <div className="gallery-grid">
            {screenshots.map((shot) => (
              <img 
                key={shot.id} 
                src={shot.image} 
                alt={`${game.name} screenshot`} 
                className="screenshot-image"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default GameDetails;