import React, { useState, useEffect } from "react";
import { API_BASE_URL, API_OPTIONS, IMAGE_BASE_URL } from "../tmdb";

const MovieModal = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchDetails = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/movie/${movieId}`, {
          ...API_OPTIONS,
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch details");

        setMovie(await response.json());
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Could not load movie details.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchDetails();

    return () => controller.abort();
  }, [movieId]);

  

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#0F0D23] p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="mb-4 text-gray-400 hover:text-white"
        >
          ✕ Close
        </button>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row">
            <img
              className="w-48 self-center rounded-xl sm:self-start"
              src={
                movie.poster_path
                  ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
                  : "/no-movie.png"
              }
              alt={movie.title}
            />

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-bold">{movie.title}</h2>
              {movie.tagline && (
                <p className="italic text-gray-400">{movie.tagline}</p>
              )}

              <p>
                ⭐ {movie.vote_average.toFixed(1)} • {movie.runtime} min •{" "}
                {movie.release_date?.split("-")[0]}
              </p>

              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-gray-300">{movie.overview}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
