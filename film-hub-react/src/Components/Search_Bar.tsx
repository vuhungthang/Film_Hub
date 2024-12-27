import { useState } from "react";
import axios from "axios";

function SearchBar() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [filmList, setFilmList] = useState<string[]>([]);
    const apiKey = import.meta.env.VITE_API_KEY;

    // Handle input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    // Handle form submission
    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();

        if (name.trim() === "") {
            alert("Please enter a valid film name.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `https://www.omdbapi.com/?apikey=${apiKey}&t=${name}`
            );

            if (response.data.Response === "False") {
                setError(response.data.Error);
                setData(null);
            } else {
                setData(response.data);
                setFilmList((prevList) => [...prevList, name.trim()]);
                setName(""); // Clear input field after successful search
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Search Your Favorite Films
            </h1>
            <form onSubmit={handleSearch} className="flex flex-col items-center gap-4 mb-6">
                <label htmlFor="search-bar" className="text-gray-700 font-medium">
                    Film Name:
                </label>
                <input
                    type="text"
                    id="search-bar"
                    value={name}
                    onChange={handleInputChange}
                    className="w-full max-w-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Search
                </button>
            </form>

            {loading && <p className="text-blue-500 text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">Error: {error}</p>}

            {data && (
                <div className="mt-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">{data.Title}</h2>
                    <p className="text-gray-600 mt-2">{data.Plot}</p>
                    <img
                        src={data.Poster}
                        alt={data.Title}
                        className="mt-4 w-48 mx-auto rounded-lg shadow-md"
                    />
                </div>
            )}
        </div>
    );
}

export default SearchBar;
