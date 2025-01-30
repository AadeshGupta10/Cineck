import { ChevronsDown } from "lucide-react"
import Search from "./components/Search"
import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MovieCard from "./components/MovieCard";
import { PropagateLoader } from "react-spinners";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import TrendingCard from "./components/TrendingCard";
import { Pagination } from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: 'application.json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPages, setMaxPages] = useState<number>()

  const [searchTerm, setSearchTerm] = useState('');
  const [deboaunceSearch, setDebounceSearch] = useState('');

  useDebounce(() => setDebounceSearch(searchTerm), 800, [searchTerm])

  const { data: movieList, isError: MovieError, isPending: MoviePending } = useQuery({
    queryKey: ["Fetch Movies" + searchTerm + currentPage],
    staleTime: 1000 * 60 * 60 * 24, //24 hrs
    queryFn: async () => {
      try {
        const endpoint = searchTerm.length > 0 ?
          `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}&page=${currentPage}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${currentPage}`;

        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) throw new Error("Failed to Fetch Movies");

        const data = await response.json();

        if (data.Response == 'false') throw new Error("Failed to Fetch Movies")

        if (searchTerm && data.results.length > 0) {
          await updateSearchCount(searchTerm, data.results[0])
        }

        return data;

      } catch (error) {
        throw new Error("Failed to Fetch Movies");
      }
    }
  })

  useEffect(()=>{
    movieList && setMaxPages(movieList.total_pages)
  },[movieList])

  const { data: Trending, isPending: TrendingPending } = useQuery({
    queryKey: ["Trending"],
    queryFn: getTrendingMovies,
    staleTime: 1000 * 60 * 60 * 24,
  })

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ['Fetch Movies'] });
  }, [deboaunceSearch, currentPage])

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      {/* Bannner */}
      <div className="bg-[url('/hero-bg.png')] bg-no-repeat bg-cover bg-top flex flex-col items-center gap-10 p-4">
        {/* Cineck Logo */}
        <img src="Cineck.png"
          alt="Cineck Logo"
          className="w-20 object-contain" />

        {/* Poster Banner */}
        <img src="poster.png"
          alt="Cineck Logo"
          className="w-96 object-contain" />

        {/* Title */}
        <h1 className="text-4xl md:text-5xl max-w-[35rem] leading-14 text-center">
          Find <span className="text-gradient">Movies</span> You'll Love Enjoy Without the Hassle</h1>

        {/* Scroll down Arrow Animation */}
        <ChevronsDown color="white" size={35} className="animate-bounce" />
      </div>

      <div className="container mx-auto px-5 min-h-screen py-5">
        <Search searchTerm={searchTerm} setSearchTerm={(e) => setSearchTerm(e)} />

        <div className="flex flex-col gap-5 mt-8">
          {
            !TrendingPending && ((Trending && Trending?.length > 0) &&
              <>
                <p className="text-lg md:text-xl">Trending Movies</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  {Trending.map((movie, index) => (
                    <TrendingCard
                      key={movie.$id}
                      index={index + 1}
                      id={movie.movie_id}
                      poster_url={movie.poster_url}
                      title={movie.title} />
                  ))}
                </div>
              </>
            )
          }

          <p className="text-lg md:text-xl">All Movies</p>
          {MoviePending ?
            <div className="flex justify-center">
              <PropagateLoader color="white" />
            </div> : MovieError ?
              <p className="text-red-500">Error in Fetching Movies</p>
              :
              <div className="flex flex-wrap justify-center gap-8">
                {
                  movieList.results.length > 0 ? movieList.results.map((movie: any) =>
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      vote_average={movie.vote_average}
                      poster_path={movie.poster_path}
                      release_date={movie.release_date}
                      original_language={movie.original_language} />
                  )
                    :
                    <div>
                      No Movie Found
                    </div>
                }
              </div>
          }
        </div>
      </div>

      <div className="py-10">
        <Pagination
          count={maxPages}
          color="primary"
          disabled={MoviePending}
          onChange={(_, value) => setCurrentPage(value)}
          className="mx-auto bg-[#c4c1c77c] w-fit py-2 px-10 rounded-md" />
      </div>
    </div>
  )
}

export default App