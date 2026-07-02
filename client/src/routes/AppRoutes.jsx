import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home"; 
import BrowseGames from "../pages/BrowseGames/BrowseGames";
import GameDetails from "../pages/GameDetails/GameDetails";
import About from "../pages/About/About";
import Collections from "../pages/Collections/Collections";
import Favorites from "../pages/Favorites/Favorites";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/games" element={<BrowseGames />} />
      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default AppRoutes;