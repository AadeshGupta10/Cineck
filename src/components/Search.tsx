import { SearchIcon } from "lucide-react"

interface SearchProp {
  searchTerm: string,
  setSearchTerm: (e: string) => void
}

const Search = ({ searchTerm, setSearchTerm }: SearchProp) => {

  return (
    <div className="max-w-[35rem] border border-gray-500 mx-auto rounded-md flex items-center gap-5 px-3">

      <SearchIcon color="#44405a" />

      <input
        type="text"
        placeholder="Search through millions of movies"
        className="h-12 text-white placeholder:text-[#88859b] font-medium outline-0 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}
export default Search
