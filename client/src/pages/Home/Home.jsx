import React, {useState, useEffect } from 'react';
import GameCard from '../../components/GameCard/GameCard';
import {getGames} from '../../services/rawgApi';
import '../../styles/globals.css';

const  Home = () => {
    const [games,setGames] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {

        const fetchTrendingGames = async () => {
            try {
                setLoading(true);
                const data = await getGames();
                setGames(data.results);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingGames();
    }, []);

    return (
        <div className="home-page">
      
          <header className="hero-section">
            <div className="hero-content">
              <h1>Track Your Next Adventure</h1>
               <p>Discover trending titles, track your backlog, and manage your ultimate library.</p>
               
            </div>
          </header>

          <section className="trending-games-section">
            <h2>Trending Games</h2>

            {loading && <p className="loading-text">Loading awesome games...</p>}
            {error && <p className="error-text">Oops! {error}</p>}
            {!loading && !error && (
              <div className="games-grid">
               {games.map((singleGame) => (
                 <GameCard key={singleGame.id} game={singleGame} />
              ))}
               </div>
           )}
          </section>

          <footer style={{
            backgroundColor: '#070913',
            borderTop: '1px solid rgba(139, 92, 246, 0.2)',
            padding: '30px 20px',
            marginTop: 'auto',
            width: '100%',
            // 1. Center the entire container layout box horizontally
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            }}>
            <div style={{
                // 2. Vertically center individual text blocks in a tidy column
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '12px',
                maxWidth: '600px'
            }}>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.95rem' }}>
                    &copy; {new Date().getFullYear()} QuestLog. All rights reserved.
                </p>
                <div style={{
                    // 3. Center the link item elements horizontally side-by-side
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <a href="/about" style={{ color: '#8b5cf6', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                        About
                    </a>
                    <a href="https://rawg.io" target="_blank" rel="noreferrer" style={{ color: '#8b5cf6', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                        Powered by RAWG
                    </a>
                </div>
            </div>
          </footer>
        </div>
    );
}

export default Home;

