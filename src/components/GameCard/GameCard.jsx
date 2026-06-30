import React from 'react';
import './GameCard.css';
import { Link } from 'react-router-dom';

const GameCard = ({game}) => {

  const {id,name, background_image, rating, released} = game;

  return(

    <div className="game-card">
        <div className="card-image-container">
            <img src={background_image} alt={name} className="card-image" />
        
        </div>

        <div className="card-info-box">
          <h3 className="game-title">{name}</h3>

         <div className="card-content">
            <p className="game-release-date">Released: {released || 'Unknown'}</p>
            { rating && <span className="game-rating">{rating}</span> }
            
         </div>
          <Link to={`/games/${id}`} className="view-details-btn">
             View Details
          </Link>
           

        </div>
    </div>
    
  );




};

export default GameCard;