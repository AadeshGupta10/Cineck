import { Link } from "react-router-dom"

interface TrendingCardProp {
    index: number,
    id: string,
    poster_url: string,
    title: string
}

const TrendingCard = ({ index, id, poster_url, title }: TrendingCardProp) => {
    return (
        <Link to={`/movie/${id}`} key={id} className="flex items-center -mt-10 -mb-10">
            <p className="fancy-text text-nowrap text-[#030014] h-fit">
                {index}
            </p>
            <img
                src={poster_url}
                alt={title}
                className="w-[127px] h-[163px] rounded-lg object-cover -ml-3.5 mb-5" />
        </Link>
    )
}

export default TrendingCard