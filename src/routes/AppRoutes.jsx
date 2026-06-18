import { Routes, Route } from "react-router-dom";

import BrowseGames from "../pages/BrowseGames/BrowseGames";
import About from "../pages/About/About";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BrowseGames />} />
      <Route path="/games" element={<BrowseGames />} />
      <Route path="/games/:id" element={<h1>Game Details</h1>} />
      <Route path="/favorites" element={<h1>Favorites</h1>} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default AppRoutes;