import { Link } from "react-router-dom"

interface MovieCardProp {
  id: string,
  title: string,
  vote_average: number,
  poster_path: string,
  release_date: string,
  original_language: string
}

const MovieCard = ({ id, title, vote_average, poster_path, release_date, original_language }: MovieCardProp) => {
  return (
    <Link to={`/movie/${id}`} className="bg-dark-100 p-5 rounded-2xl shadow-inner shadow-[#cecefb]/10 flex flex-col w-54">
      <img
        src={poster_path ?
          `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
        alt={title}
        className="rounded-lg h-64 w-full object-cover shrink-0"
      />

      <div className="mt-3 break-words flex flex-col gap-1">
        <h3 className="h-full">{title || 'Unknown Title'}</h3>

        <div className="flex flex-row items-center flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <img
              src="star.svg"
              alt="Star Icon"
              className="size-4 object-contain" />
            <p className="font-semibold text-white">
              {vote_average ? vote_average.toFixed(1) : 'N/A'}
            </p>
          </div>

          <span className="text-sm text-gray-100">•</span>
          <p className="capitalize text-gray-100 font-medium">{original_language || 'N/A'}</p>

          <span className="text-sm text-gray-100">•</span>
          <p className="text-gray-100 font-medium">
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </Link>
  )
}
export default MovieCard
