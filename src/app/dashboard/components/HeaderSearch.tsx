'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react"; // search icon

interface Video {
  id: number;
  title: string;
  description: string;
  youtube_links: string[];
  telegram_links?: string[];
  material_urls?: string[];
  is_kuppi?: boolean;
}

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleWatch = (url: string) => {
    setSearchOpen(false); // Close search overlay
    router.push(`/module-kuppi/watch?videoUrl=${encodeURIComponent(url)}`);
  };

  return (
    <>
      {/* Search button (both desktop and mobile) */}
      <button
        onClick={() => setSearchOpen(true)}
        className="relative flex items-center gap-2 px-3 py-2 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 shadow "
      >
        <Search className="w-5 h-5" /> 
        <span className="hidden md:block">Search modules, kuppi, videos...</span>
        <span className="md:hidden">Search...</span>
      </button>

      {/* Full-page search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col backdrop-blur-sm bg-black/70">
          {/* Top search bar */}
  <div className="bg-gradient-to-r from-blue-100 via-purple-200 to-blue-500 text-white p-3 shadow bg-opacity-20">
  <div className="max-w-4xl mx-auto flex items-center gap-3">
    {/* Search Icon */}
    <Search className="w-5 h-5 text-gray-800" />

    {/* Input field */}
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search modules, kuppi, videos..."
      autoFocus
      className="flex-1 px-3 py-2 rounded-md border border-blue-500 focus:outline-none text-black placeholder-gray-600"
    />

    {/* Cancel button */}
    <button
      onClick={() => {
        setSearchOpen(false);
        setQuery("");
      }}
      className="text-xl font-semibold text-red-600 hover:underline"
    >
      Cancel
    </button>
  </div>
</div>


          {/* Results */}
          <div className="flex-1 overflow-y-auto bg-transparent">
            {query.length < 3 ? (
              <p className="p-4 text-gray-100">Type at least 3 characters to search...</p>
            ) : loading ? (
              <p className="p-4 text-gray-100">Searching...</p>
            ) : results.length === 0 ? (
              <p className="p-4 text-gray-100">No results found</p>
            ) : (
              results.map((video) => (
                <div key={video.id} className="border-b p-4 bg-gray-100/90 hover:bg-gray-200/90 transition">
                  <p className="font-semibold text-gray-800">
                    {video.title} {video.is_kuppi && "(Kuppi)"}
                  </p>
                  <p className="text-gray-800 text-sm mb-2">{video.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {video.youtube_links.map((url, idx) => (
                     <button
  key={idx}
  onClick={() => handleWatch(url)}
  className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
>
  {/* YouTube logo */}
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M23.498 6.186a2.997 2.997 0 0 0-2.114-2.12C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.384.566A2.997 2.997 0 0 0 .502 6.186 31.41 31.41 0 0 0 0 12a31.41 31.41 0 0 0 .502 5.814 2.997 2.997 0 0 0 2.114 2.12C4.495 20.5 12 20.5 12 20.5s7.505 0 9.384-.566a2.997 2.997 0 0 0 2.114-2.12A31.41 31.41 0 0 0 24 12a31.41 31.41 0 0 0-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>

  Watch Video  {idx + 1}
</button>

                    ))}
                    {video.telegram_links?.map((link, idx) => (
                 <a
  key={idx}
  href={link}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
>
  {/* Telegram Icon */}
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9.999 15.17l-.39 5.52c.56 0 .8-.24 1.09-.53l2.62-2.51 5.43 3.98c1 .55 1.71.26 1.96-.92l3.56-16.68.01-.01c.32-1.49-.54-2.07-1.5-1.71L1.5 9.66c-1.45.58-1.43 1.41-.25 1.78l5.44 1.7 12.63-7.96c.59-.36 1.13-.16.69.23L9.999 15.17z" />
  </svg>

 Download Video{idx + 1}
</a>

                    ))}
                    {video.material_urls?.map((link, idx) => (
               <a
  key={idx}
  href={link}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 px-2 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition"
>
    <svg
                className="w-4 h-4 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                ></path>
              </svg>

  Download Materials (PDF) {idx + 1}
</a>

                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
