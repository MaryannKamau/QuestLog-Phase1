import { createContext, useContext, useState } from "react";

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  const addFavourite = (game) => {
    const exists = favourites.find(
      (favourite) => favourite.id === game.id
    );

    if (!exists) {
      setFavourites([...favourites, game]);
    }
  };

  const removeFavourite = (gameId) => {
    setFavourites(
      favourites.filter((game) => game.id !== gameId)
    );
  };

  const isFavourite = (gameId) => {
    return favourites.some((game) => game.id === gameId);
  };

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        addFavourite,
        removeFavourite,
        isFavourite,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  return useContext(FavouritesContext);
}