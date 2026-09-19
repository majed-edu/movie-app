import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import GenreFilter from "./components/GenreFilter";
import MovieModal from "./components/MovieModal";
import { updateSearchCount, getTrendingMovies } from "./appwrite";
import { API_BASE_URL, API_OPTIONS } from "./tmdb";

function App() {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isloading, setisLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  // تأخير إرسال قيمة البحث لتقليل الطلبات على API
  useDebounce(
    function () {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
      // البحث والتصنيف لا يجتمعان: الكتابة تلغي التصنيف
      if (searchTerm) setSelectedGenre(null);
    },
    500,
    [searchTerm],
  );

  // اختيار تصنيف: نفرّغ البحث ونرجع للصفحة الأولى
  const handleGenreSelect = (genreId) => {
    setSelectedGenre((current) => (current === genreId ? null : genreId));
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setPage(1);
  };

  // جلب قائمة الأفلام من TMDB (بحث، أو تصنيف، أو الأكثر شعبية)
  const fetchMovies = async (query = "", pageNumber = 1, genreId, signal) => {
    setisLoading(true);
    setErrorMessage("");

    try {
      let endpoint;

      if (query) {
        endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNumber}`;
      } else {
        endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNumber}`;
        if (genreId) endpoint += `&with_genres=${genreId}`;
      }

      const response = await fetch(endpoint, { ...API_OPTIONS, signal });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const results = data.results || [];

      setMovieList((prev) => {
        if (pageNumber === 1) return results;
        // منع تكرار الأفلام بين الصفحات (تكرار المفاتيح)
        const existingIds = new Set(prev.map((m) => m.id));
        return [...prev, ...results.filter((m) => !existingIds.has(m.id))];
      });
      setTotalPages(data.total_pages || 1);

      if (query && pageNumber === 1 && results.length > 0) {
        updateSearchCount(query, results[0]);
      }
    } catch (error) {
      if (error.name === "AbortError") return;

      console.error("Error fetching movies:", error);
      if (pageNumber === 1) setMovieList([]);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      if (!signal?.aborted) setisLoading(false);
    }
  };

  // جلب قائمة الأفلام الأكثر بحثاً من Appwrite
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  // جلب قائمة التصنيفات من TMDB مرة واحدة
  useEffect(() => {
    const controller = new AbortController();

    const loadGenres = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/genre/movie/list`, {
          ...API_OPTIONS,
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch genres");

        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching genres:", error);
        }
      }
    };

    loadGenres();

    return () => controller.abort();
  }, []);

  // إعادة جلب الأفلام عند تغير البحث أو التصنيف أو الصفحة
  useEffect(() => {
    const controller = new AbortController();

    fetchMovies(debouncedSearchTerm, page, selectedGenre, controller.signal);

    return () => controller.abort();
  }, [debouncedSearchTerm, selectedGenre, page]);

  // جلب الأفلام الشائعة مرة واحدة عند فتح التطبيق
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li
                  key={movie.$id}
                  className="cursor-pointer"
                  onClick={() => setSelectedMovieId(movie.movie_id)}
                >
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.searchTerm} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onSelect={handleGenreSelect}
          />

          {isloading && page === 1 ? (
            <Spinner />
          ) : errorMessage && movieList.length === 0 ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <>
              {movieList.length === 0 && (
                <p className="text-gray-100">No movies found.</p>
              )}

              <ul>
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={setSelectedMovieId}
                  />
                ))}
              </ul>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              {page < totalPages && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isloading}
                  className="mx-auto cursor-pointer rounded-lg bg-light-100/10 px-8 py-3 font-bold text-white hover:bg-light-100/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isloading ? "Loading..." : "Load More"}
                </button>
              )}
            </>
          )}
        </section>
      </div>

      {selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </main>
  );
}

export default App;