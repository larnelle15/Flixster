import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Movie.css';

const Movie = ({ movie, onClick }) => {
    const [isWatched, setIsWatched] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleWatchedChange = (e) => {
        e.stopPropagation(); 
        setIsWatched(!isWatched);
    };

    const handleFavoriteChange = (e) => {
        e.stopPropagation(); 
        setIsFavorite(!isFavorite);
    };

    return (
        <div className={`movie-item ${isWatched ? 'watched' : ''}`}>
            <h2 onClick={onClick}>{movie.original_title}</h2>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.original_title} poster`} onClick={onClick}/>
            <div>Rating: {movie.vote_average}</div>
            <div className="watched-container">
                <label>
                    <input type="checkbox" checked={isWatched} onChange={handleWatchedChange} />
                    Watched
                </label>
            </div>
            <div className="favorite-container">
                <span 
                    className={`favorite-icon ${isFavorite ? 'favorite' : ''}`} 
                    onClick={handleFavoriteChange}
                >
                    ❤️ Favorite
                </span>
            </div>
        </div>
    );
};

Movie.propTypes = {
    movie: PropTypes.shape({
        poster_path: PropTypes.string,
        original_title: PropTypes.string,
        vote_average: PropTypes.number,
    }).isRequired,
    onClick: PropTypes.func.isRequired, 
};

export default Movie;


