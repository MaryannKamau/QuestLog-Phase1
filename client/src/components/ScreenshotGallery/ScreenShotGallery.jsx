import "./ScreenshotGallery.css";

function ScreenshotGallery({ screenshots = [] }) {
  if (screenshots.length === 0) {
    return (
      <div className="gallery-empty">
        <p>No screenshots available.</p>
      </div>
    );
  }

  return (
    <section className="screenshot-gallery">
      <h2>Game Screenshots</h2>

      <div className="gallery-grid">
        {screenshots.map((screenshot) => (
          <div
            key={screenshot.id}
            className="gallery-card"
          >
            <img
              src={screenshot.image}
              alt="Game Screenshot"
              className="gallery-image"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ScreenshotGallery;