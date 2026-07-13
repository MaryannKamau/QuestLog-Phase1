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
          <header className="home-header">
            <div className="hero-content">
              <h1>Track Your Next Adventure</h1>
                <p>Discover trending titles, track your backlog, and manage your ultimate library.</p>
                {/* Integrated Phase 3 Call-To-Action Button */}
                <button className="hero-cta-btn" style={{ padding: "0.8rem 1.5rem", marginTop: "1rem", cursor: "pointer" }}>Explore Games</button>
            </div>
          </header>

          <section className="trending-section" style={{ flexGrow: 1 }}>
            <h2>Trending Titles</h2>
           {loading ? (
             <p className="loading-state">Loading latest matrices...</p>
           ) : error ? (
              <p className="error-state">{error}</p>
           ) : (
            <div className="games-grid">
               {games.slice(0, 4).map((game) => (
                   <GameCard key={game.id} game={game} />
               ))}
            </div>
           )}
          </section>

          {/* Integrated Phase 3 Footer structural layout with clean inline spacing attributes */}
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
