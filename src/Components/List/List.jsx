import "./List.css";
import React, { useState, useEffect } from "react";
import Movie from "../Movie/Movie";
import Modal from "../Modal/Modal";

const List = () => {
    const varKey = import.meta.env.VITE_API_KEY;
    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState("nowPlaying");
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [voteAverage, setVoteAverage] = useState("");

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        if (activeView === "nowPlaying") {
            fetchMovies(page);
        }
    }, [page, activeView, selectedGenre, releaseYear, voteAverage]);

    const fetchMovies = async (page) => {
        setLoading(true);
        try {
            let url = `https://api.themoviedb.org/3/discover/movie?api_key=${varKey}&page=${page}`;
            if (selectedGenre) {
                url += `&with_genres=${selectedGenre}`;
            }
            if (releaseYear) {
                url += `&primary_release_year=${releaseYear}`;
            }
            if (voteAverage) {
                url += `&vote_average.gte=${voteAverage}`;
            }
            console.log("Fetching movies with URL:", url); 
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Failed to fetch movies");
            }
            const data = await res.json();
            console.log("Fetched movies:", data.results);
            setMovies((prevMovies) => page === 1 ? data.results : [...prevMovies, ...data.results]);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${varKey}`;
            console.log("Fetching genres with URL:", url); 
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Failed to fetch genres");
            }
            const data = await res.json();
            console.log("Fetched genres:", data.genres); 
            setGenres(data.genres);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const searchMovies = async (page = 1) => {
        setLoading(true);
        try {
            const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${varKey}&query=${search}&page=${page}`;
            console.log("Searching movies with URL:", searchUrl); 
            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error("Failed to search movies");
            }
            const data = await response.json();
            console.log("Searched movies:", data.results); 
            setMovies((prevMovies) => page === 1 ? data.results : [...prevMovies, ...data.results]);
        } catch (error) {
            console.error('Error searching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (search.trim() !== '') {
            console.log("Handling search for:", search); 
            setPage(1);
            setActiveView("search");
            searchMovies(1);
        }
    };

    const loadMoreMovies = () => {
        setPage((prevPage) => prevPage + 1);
        console.log("Loading more movies, page:", page + 1); 
        if (activeView === "nowPlaying") {
            fetchMovies(page + 1);
        } else if (activeView === "search") {
            searchMovies(page + 1);
        }
    };

    const handleViewChange = (view) => {
        console.log("Changing view to:", view); 
        if (activeView !== view) {
            setActiveView(view);
            setMovies([]);
            setPage(1);
        } else if (view === "nowPlaying") {
            fetchMovies(1);
        }
    };

    const handleMovieClick = (movie) => {
        console.log("Movie clicked:", movie); 
        fetchMovieDetails(movie.id);
    };

    const fetchMovieDetails = async (movieId) => {
        try {
            const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${varKey}`;
            console.log("Fetching movie details with URL:", url); 
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Failed to fetch movie details");
            }
            const data = await res.json();
            console.log("Fetched movie details:", data); 
            setSelectedMovie(data);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };

    const handleCloseModal = () => {
        console.log("Closing modal"); 
        setShowModal(false);
        setSelectedMovie(null);
    };

    const handleFilterChange = () => {
        console.log("Applying filters"); 
        setPage(1);
        fetchMovies(1);
    };

    return (
        <div className="movie-list-container">
            <div className="view-buttons">
                <button 
                    className={activeView === "nowPlaying" ? "active" : ""}
                    onClick={() => handleViewChange("nowPlaying")}
                >
                    Now Playing
                </button>
                <button 
                    className={activeView === "search" ? "active" : ""}
                    onClick={() => handleViewChange("search")}
                >
                    Search
                </button>
            </div>
            {activeView === "search" && (
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for a movie..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            )}
            {activeView === "nowPlaying" && (
                <div className="filters">
                    <select onChange={(e) => setSelectedGenre(e.target.value)} value={selectedGenre}>
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Release Year"
                        value={releaseYear}
                        onChange={(e) => setReleaseYear(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Vote Average"
                        value={voteAverage}
                        onChange={(e) => setVoteAverage(e.target.value)}
                    />
                    <button onClick={handleFilterChange}>Apply Filters</button>
                </div>
            )}
            <div className="movie-list">
                {movies.map((movie) => (
                    <Movie key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
                ))}
            </div>
            {selectedMovie && (
                <Modal
                    show={showModal}
                    onClose={handleCloseModal}
                    movieTitle={selectedMovie.title}
                    movieBackdrop={`https://image.tmdb.org/t/p/w500/${selectedMovie.backdrop_path}`}
                    
                    releaseDate={selectedMovie.release_date}
                    movieOverview={selectedMovie.overview}
                    trailerUrl={selectedMovie.trailer_url} 
                    movieGenres={selectedMovie.genres.map(genre => genre.name).join(', ')}
                />
            )}
            {loading && <p>Loading...</p>}
            {!loading && movies.length > 0 && (
                <button onClick={loadMoreMovies} className="load-more">
                    Load More
                </button>
            )}
            {!loading && movies.length === 0 && (
                <p>No movies found</p>
            )}
        </div>
    );
};

export default List;
