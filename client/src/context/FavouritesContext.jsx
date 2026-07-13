import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (game) => {
    const exists = favorites.find((favorite) => favorite.id === game.id);

    if (!exists) {
      setFavorites([...favorites, game]);
    }
  };

  const removeFavorite = (gameId) => {
    setFavorites(favorites.filter((game) => game.id !== gameId));
  };

  const isFavorite = (gameId) => {
    return favorites.some((game) => game.id === gameId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}