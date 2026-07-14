import { useEffect, useState } from "react";

import GameCard from "../../components/GameCard/GameCard";
import { getGames } from "../../services/gameApi";
import "../../styles/globals.css";

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHomeGames = async () => {
            try {
                setLoading(true);
                const data = await getGames();
                setGames(data.results || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeGames();
    }, []);

    return (
        <div className="home-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <header className="home-header" style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
            <div className="hero-content" style={{ maxWidth: "800px", margin: "0 auto" }}>
              {/* Added a highly welcoming, friendly premium headline wrapper */}
              <h1 style={{ marginBottom: "0.5rem" }}>Welcome to QuestLog!</h1>
              <h2 style={{ fontSize: "1.5rem", opacity: 0.9, fontWeight: "normal", color: "#8b5cf6", marginBottom: "1rem" }}>
                Track Your Next Adventure
              </h2>
              <p style={{ fontSize: "1.1rem", margin: "0 auto", maxWidth: "600px", color: "#9ca3af" }}>
                Your ultimate gaming companion. Discover trending titles, map out your upcoming backlog, and build your perfect collection dashboards.
              </p>
              {/* REMOVED THE EXPLORE GAMES BUTTON STRUCTURAL TAG BLOCK */}
            </div>
          </header>

          <section className="trending-section" style={{ flexGrow: 1, padding: "0 1.5rem 3rem" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Trending Titles</h2>
           {loading ? (
             <p className="loading-state">Loading latest matrices...</p>
           ) : error ? (
              <p className="error-state">{error}</p>
           ) : (
            <div className="games-grid">
               {/* MODIFIED: Increased limit from .slice(0, 4) to .slice(0, 12) for a rich grid layout */}
               {games.slice(0, 12).map((game) => (
                   <GameCard key={game.id} game={game} />
               ))}
            </div>
           )}
          </section>

          {/* Integrated Phase 3 Footer structural layout */}
          <footer className="footer-section" style={{ backgroundColor: '#070913', borderTop: '1px solid rgba(139, 92, 246, 0.2)', padding: '30px 20px', marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="footer-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '12px', maxWidth: '600px' }}>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.95rem' }}>
                    &copy; {new Date().getFullYear()} <span className="brand-highlight" style={{ color: '#8b5cf6', fontWeight: 'bold' }}>QuestLog</span>. All rights reserved.
                </p>
                <p className="api-attribution" style={{ margin: 0, fontSize: '0.9rem' }}>
                    Powered by the <a href="https://rawg.io" target="_blank" rel="noreferrer" style={{ color: '#8b5cf6', fontWeight: 600, textDecoration: 'none' }}>RAWG API</a>
                </p>
            </div>
          </footer>
        </div>
    );
}

export default Home;

