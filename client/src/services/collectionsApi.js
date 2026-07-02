const BASE_URL = 'http://localhost:5555/api/collections';

export const fetchCollections = async (userId) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to read database collection rows.');
  }

  return await response.json();
};

export const addGameToCollection = async (collectionName, gameData) => {
  const response = await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collection_name: collectionName,
      rawg_game_id: gameData.id,
      game_name: gameData.name,
      game_image: gameData.background_image
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to commit item payload to database.');
  }

  return await response.json();
};

export const deleteCollectionGame = async (gameId) => {
  const response = await fetch(`${BASE_URL}/game/${gameId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to drop targeted data row.');
  }

  return await response.json();
};
