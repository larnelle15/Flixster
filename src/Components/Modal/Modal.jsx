import React from "react";
import './Modal.css';

const Modal = ({ show, onClose, children, movieBackdrop, movieTitle, releaseDate, movieOverview, movieGenres, runtime }) => {
    if (!show) {
        return null;
    }

    console.log("Modal Component Props:", { movieTitle, movieGenres, movieBackdrop, releaseDate, movieOverview, runtime });

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button onClick={onClose}>Close</button>
                </div>
                <div className="modal-body">
                    {children}
                    <h2>{movieTitle}</h2>
                    <h3><strong>Genres: {movieGenres}</strong></h3>
                    <img className="modalposterImage" src={movieBackdrop} alt={`${movieTitle} poster`} />
                    <h3>Release Date: {releaseDate}</h3>
                    <p><strong>Overview:</strong> {movieOverview}</p>
                    <h3>Runtime: {runtime} minutes</h3>
                </div>
            </div>
        </div>
    );
};

export default Modal;
