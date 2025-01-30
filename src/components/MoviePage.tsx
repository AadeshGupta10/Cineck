import { useQuery } from "@tanstack/react-query";
import { MoveLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom"
import { updateSearchCount } from "../appwrite";
import { PropagateLoader } from "react-spinners";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: 'application.json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const MoviePage = () => {

    const { id } = useParams();

    const { data, isPending, isError } = useQuery({
        queryKey: ["Movie Details", id],
        staleTime: Infinity,
        queryFn: async () => {
            try {
                const endpoint = `${API_BASE_URL}/movie/${id}?language=en-US`;

                const response = await fetch(endpoint, API_OPTIONS);

                if (!response.ok) throw new Error("Failed to Fetch Movies");

                const data = await response.json();

                if (data.success === false) throw new Error(data.status_message || "Failed to Fetch Movies");


                await updateSearchCount(data.title, { "id": data.id, "poster_path": data.poster_path })

                console.log(data)

                return data;

            } catch (error) {
                throw new Error("Failed to Fetch Movies");
            }
        }
    })

    const minutesToHoursAndMinutes = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return `${hours}h ${remainingMinutes}m`
    }

    const formatNumber = (number: number) => {
        const absNumber = Math.abs(number); // Handle negative numbers

        if (absNumber >= 1000000000) {
            return (number / 1000000000).toFixed(2) + "B";
        } else if (absNumber >= 1000000) {
            return (number / 1000000).toFixed(2) + "M";
        } else if (absNumber >= 1000) {
            return (number / 1000).toFixed(2) + "K";
        } else {
            return number.toString(); // Or number.toFixed(2) for consistent decimal places
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return "Invalid date format";
        }

        const month = date.toLocaleString('default', { month: 'long' }); // Get full month name
        const day = date.getDate();
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    }

    const formatArrayData = (array: any) => {
        if (array.length > 1) {
            return (array.flatMap((data: { name: string }) => [data.name, "•"])).slice(0, -1);
        }
        else {
            return [array[0].name]
        }
    }

    const formatToINR = (amount: number) => {
        if (amount === 0) return "zero";

        const units = ["", "Thousand", "Lakh", "Crore", "Arab", "Kharab", "Neel", "Padma", "Shankh"];
        const words = [];

        let i = 0;

        while (amount > 0) {
            let part = amount % 100;
            if (i === 2) part = amount % 1000; // Lakhs are in 3-digit groups

            if (part > 0) {
                words.unshift(`${part} ${units[i]}`.trim());
            }

            amount = Math.floor(amount / (i === 1 ? 10 : 100)); // Adjust for lakh and crore positioning
            i++;
        }

        return words.join(" ") + " Rupees";
    }

    return (
        <div className="min-h-screen bg-[#030014] py-5 text-white">
            {
                data ? <div className="min-h-screen container mx-auto px-5 flex flex-col gap-5">

                    {/* top Section */}
                    <div className="flex flex-col md:flex-row justify-between gap-x-5 gap-y-3">
                        {/* Name, Year of Release, Duration */}
                        <div className="flex flex-col gap-3">
                            {/* Name of Movie */}
                            <p className="text-3xl font-bold">
                                {
                                    data?.original_title || 'Unknown Title'
                                }
                            </p>

                            {/* Year of Release, Duration */}
                            <div className="flex gap-2 text-sm text-gray-400">
                                {/* Year */}
                                <p>
                                    {
                                        data.release_date.split('-')[0]
                                    }
                                </p>
                                <span className="text-sm">•</span>
                                {/* Duration */}
                                <p>
                                    {
                                        minutesToHoursAndMinutes(data.runtime)
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="bg-[#15103a] px-3 py-1 flex items-center gap-2 h-fit w-fit rounded-md mt-1 text-[15px] shrink-0">
                            <img
                                src="/star.svg"
                                alt="Star Icon"
                                className="size-4 object-contain" />
                            <p>
                                <span className="font-semibold">
                                    {
                                        data.vote_average.toFixed(1)
                                    }
                                </span>/10 ({formatNumber(data.vote_count)})
                            </p>
                        </div>
                    </div>

                    {/* Poster & Banners */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-5 md:h-96 rounded-md overflow-hidden">
                        <img
                            src={data.poster_path ?
                                `https://image.tmdb.org/t/p/w500/${data.poster_path}` : '/no-movie.png'}
                            alt={data.title}
                            className="h-full w-6/12 md:w-4/12 lg:w-4/12 rounded-md object-cover object-center" />

                        <img
                            src={data.backdrop_path ? `https://image.tmdb.org/t/p/w500/${data.backdrop_path}` : '/no-movie.png'}
                            alt={data.title}
                            className="h-full w-full rounded-md object-cover object-center" />
                    </div>

                    {/* Detail Section */}
                    <div className="flex flex-col lg:flex-row gap-x-5 justify-between gap-y-7 mt-3">
                        <div className="w-full flex flex-col gap-6">
                            {/* Generes */}
                            <div className="flex">
                                <p className="w-2/6 md:w-1/6 text-gray-400 shrink-0">Generes</p>
                                <GeneresBlocks Genres={data.genres} />
                            </div>

                            {/* Overview */}
                            <div className="flex">
                                <p className="w-2/6 md:w-1/6 text-gray-400 shrink-0">Overview</p>
                                <p className="text-[15px] h-fit">
                                    {
                                        data.overview
                                    }
                                </p>
                            </div>

                            {/* Release Date */}
                            <div className="flex items-center">
                                <p className="w-2/6 md:w-1/6 text-gray-400 shrink-0">Release Date</p>
                                <p className="text-[15px] h-fit">
                                    {
                                        formatDate(data.release_date)
                                    }
                                </p>
                            </div>

                            {/* Countries */}
                            <div className="flex items-center">
                                <p className="w-2/6 md:w-1/6 text-gray-400 shrink-0">Countries</p>
                                <div className="text-[15px] h-fit">
                                    <Pointer Pointers={formatArrayData(data.production_countries)} />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center">
                                <p className="w-2/6 md:w-1/6 text-gray-400 shrink-0">Status</p>
                                <p className="text-[15px] h-fit">
                                    {
                                        data.status
                                    }
                                </p>
                            </div>

                            {/* Language */}
                            <div className="flex items-center">
                                <p className="w-2/6 md:w-1/6 text-gray-400 shrink-0">Language</p>
                                <div className="text-[15px] h-fit">
                                    <Pointer Pointers={formatArrayData(data.spoken_languages)} />
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="flex items-center">
                                <p className="w-2/6 md:w-1/6 text-gray-400 shrink-0">Budget</p>
                                <p className="text-[15px] h-fit">
                                    {
                                        formatToINR(data.budget)
                                    }
                                </p>
                            </div>

                            {/* Revenue */}
                            <div className="flex items-center">
                                <p className="w-2/6 md:w-1/6 text-gray-400 shrink-0">Revenue</p>
                                <p className="text-[15px] h-fit">
                                    {
                                        formatToINR(data.revenue)
                                    }
                                </p>
                            </div>

                            {/* Tagline */}
                            <div className="flex items-center">
                                <p className="w-2/6 md:w-1/6 text-gray-400 shrink-0">Tagline</p>
                                <p className="text-[15px] h-fit">
                                    {
                                        data.tagline
                                    }
                                </p>
                            </div>

                            {/* Production Companies */}
                            <div className="flex items-center">
                                <p className="w-2/6 md:w-1/6 text-gray-400 shrink-0">Production Companies</p>
                                <div className="text-[15px] h-fit">
                                    <Pointer Pointers={formatArrayData(data.production_companies)} />
                                </div>
                            </div>
                        </div>

                        {/* Homepage Button */}
                        <Link to={"/"} className="bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] flex justify-center items-center gap-3 btn rounded-sm px-3 py-2 text-black font-medium text-sm shrink-0 h-fit">
                            <MoveLeft /> Visit Homepage
                        </Link>
                    </div>
                </div>
                    :
                    isPending ?
                        <div className="h-full flex justify-center items-center">
                            <PropagateLoader color="white" />
                        </div>
                        :
                        isError && <div className="h-screen flex flex-col gap-5 justify-center items-center">
                            <p>Something Mysterious Occured on Server</p>
                            <Link to={"/"} className="bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] flex justify-center items-center gap-3 btn rounded-sm px-3 py-2 text-black font-medium text-sm shrink-0 h-fit">
                                <MoveLeft /> Visit Homepage
                            </Link>
                        </div>
            }
        </div>
    )
};

export default MoviePage

export const GeneresBlocks = ({ Genres }: { Genres: any }) => {
    return (
        <div className="flex flex-wrap h-fit-wrap gap-3">
            {
                Genres.map((genre: { name: string }, index: number) =>
                    <div className="bg-[#332f50] px-3 py-1 h-fit rounded-md text-sm shrink-0" key={index}>
                        {
                            genre.name
                        }
                    </div>
                )
            }
        </div>
    )
}

export const Pointer = ({ Pointers }: { Pointers: any }) => {
    return (
        <div className="flex flex-wrap gap-2 items-center">
            {
                Pointers?.map((name: string, index: number) =>
                    <span className="shrink-0" key={index + name}>
                        {
                            name
                        }
                    </span>
                )
            }
        </div>
    )
}