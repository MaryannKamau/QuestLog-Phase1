import "./About.css";

function About() {
  return (
    <main className="about-page">
      <h1>About QuestLog</h1>

      <section className="about-section">
        <p>
          QuestLog is a game discovery platform built using React and the RAWG
          Video Games Database API. The application helps gamers discover new
          titles, explore game details, browse screenshots, and filter games by
          genre, platform, and rating.
        </p>

        <p>
          Our goal is to create a seamless experience for players looking for
          their next gaming adventure while providing a modern and visually
          engaging interface.
        </p>
      </section>

      <section className="about-section">
        <h2>Features</h2>

        <ul>
          <li>🎮 Browse popular games</li>
          <li>🔍 Search for games by title</li>
          <li>⭐ View ratings and release dates</li>
          <li>🖼️ Explore game screenshots</li>
          <li>🎯 Filter by genre and platform</li>
          <li>📈 Sort by rating and release date</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Technology Stack</h2>

        <ul>
          <li>React</li>
          <li>React Router DOM</li>
          <li>Vite</li>
          <li>RAWG API</li>
          <li>CSS3</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Meet the Team</h2>

        <ul>
          <li>Charles – Project Lead & Integration</li>
          <li>MaryAnn – Home Page Development</li>
          <li>Fatuma – Search Functionality</li>
          <li>Stephen – Game Details & Screenshots</li>
        </ul>
      </section>
    </main>
  );
}

export default About;