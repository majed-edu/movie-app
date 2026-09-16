// import React from "react";
import Search from "./components/Search";
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const BASE_API_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// API options for making requests to the TMDB API
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchItem, setSearchItem] = useState(""); // State to store the search input
  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages
  const [movieList, setMovieList] = useState([]); // State to store the list of movies
  const [isloading, setisLoading] = useState(false); // State to track loading status

  const fetchMovies = async () => {
    setisLoading(true); // set loading state to true before fetching
    setErrorMessage(""); // Clear previous error message before fetching

    try {
      // endpoint to fetch popular movies from the TMDB API
      const endpoint = `${BASE_API_URL}/discover/movie?sort_by=popularity.desc`;
      // fetch data from the TMDB API using the endpoint and API options
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } // Check if the response is not OK (status code not in the range 200-299)

      const data = await response.json(); // Parse the response data as JSON
      if (data.Response === "False") {
        // Check if the API response indicates failure
        setErrorMessage(
          data.Error || "Failed to fetch movies. Please try again later.",
        ); // Set the error message from the API response or a default message
        setMovieList([]); // Clear the movie list if the API response indicates failure
        return; // Exit the function early if there was an error in the API response
      }
      setMovieList(data.results || []); // Update the movie list state with the fetched data or an empty array if no results
    } catch (error) {
      // Catch any errors that occur during the fetch operation
      console.error("Error fetching movies"); // Log the error to the console for debugging purposes
      setErrorMessage("Failed to fetch movies. Please try again later."); // Set a user-friendly error message in the state
    } finally {
      // Finally block to execute code regardless of whether the try block succeeded or the catch block was executed
      setisLoading(false);
    }
  };

  useEffect(() => {
    // useEffect hook to fetch movies when the component mounts
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Gr1eat Movies</span> You'll
            Enjoy Without the Hassle
          </h1>
          <Search searchItem={searchItem} setSearchItem={setSearchItem} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isloading ? ( // Conditional rendering based on the loading state
            <Spinner />
          ) : errorMessage ? ( // Conditional rendering based on the error message state
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {/* Render the list of movies */}
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
export default App;

// git status
// git add .
// git commit -m "Update project"
// git push

// Discover
// Movie
// get
// https://api.themoviedb.org/3/discover/movie
// Find movies using over 30 filters and sort options.
