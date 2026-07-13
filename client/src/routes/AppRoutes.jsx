import { Routes, Route } from "react-router-dom";

import BrowseGames from "../pages/BrowseGames/BrowseGames";
import GameDetails from "../pages/GameDetails/GameDetails";
import Favorites from "../pages/Favorites/Favorites";
import Collections from "../pages/Collections/Collections"; // 1. Added your collections page import back!
import About from "../pages/About/About";
import Favorites from "../pages/Favorites/Favorites";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Collections from "../pages/Collections/Collections";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/games" element={<BrowseGames />} />
      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      {/* 2. Added your protected collections path back! */}
      <Route
        path="/collections"
        element={
          <ProtectedRoute>
            <Collections />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
