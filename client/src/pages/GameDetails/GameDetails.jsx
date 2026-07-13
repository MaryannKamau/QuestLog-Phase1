import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getGameById, getGameScreenshots } from "../../services/rawgApi";
import "./GameDetails.css";

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

        const [gameData, screenshotsData] = await Promise.all([
          getGameById(id),
          getGameScreenshots(id),
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
    <main className="game-details-container">
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
        <section className="game-info-main">
          <h2>About</h2>

          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: game.description }}
          />
        </section>

        <aside className="game-meta">
          <div className="meta-item">
            <h3>Release Date</h3>
            <p>
              {game.released
                ? new Date(game.released).toLocaleDateString()
                : "TBA"}
            </p>
          </div>

          <div className="meta-item">
            <h3>Rating</h3>
            <p>⭐ {game.rating} / 5</p>
          </div>

          <div className="meta-item">
            <h3>Genres</h3>
            <div className="tag-list">
              {game.genres?.map((genre) => (
                <span key={genre.id} className="tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="meta-item">
            <h3>Platforms</h3>
            <div className="tag-list">
              {game.platforms?.map((p) => (
                <span key={p.platform.id} className="tag">
                  {p.platform.name}
                </span>
              ))}
            </div>
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
                alt={`${game.name} screenshot`}
                className="screenshot-image"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default GameDetails;