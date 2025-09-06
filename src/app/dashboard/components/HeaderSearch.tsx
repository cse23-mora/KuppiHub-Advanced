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
  const [mobileOpen, setMobileOpen] = useState(false);
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
    router.push(`/module-kuppi/watch?videoUrl=${encodeURIComponent(url)}`);
  };

  return (
    <>
      {/* Desktop search (normal) */}
      <div className="hidden md:block relative w-80 bg-white text-gray-800 rounded-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search modules, kuppi, videos..."
          className="px-4 py-2 shadow w-full rounded-2xl"
        />
        {query.length >= 3 && (
          <div className="flex flex-col absolute top-full mt-2 w-80 bg-white text-gray-800 rounded-2xl shadow-lg z-50">
            {loading ? (
              <p className="p-2 text-gray-500">Searching...</p>
            ) : results.length === 0 ? (
              <p className="p-2 text-gray-500">No results found</p>
            ) : (
              results.map((video) => (
                <div key={video.id} className="border-b last:border-none p-2">
                  <p className="font-semibold">
                    {video.title} {video.is_kuppi && "(Kuppi)"}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">{video.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {video.youtube_links.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleWatch(url)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                      >
                        Watch Video {idx + 1}
                      </button>
                    ))}
                    {video.telegram_links?.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                      >
                        Telegram {idx + 1}
                      </a>
                    ))}
                    {video.material_urls?.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-800 transition"
                      >
                        Material {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Mobile search (icon + overlay) */}
      <div className="md:hidden">
<button
  onClick={() => setMobileOpen(true)}
  className="relative flex items-center gap-2 px-3 py-2 rounded-2xl bg-fuchsia-100 hover:bg-blue-600 text-gray-800"
>
  <Search className="w-10 h-6" /> 
  <span >Search ...</span>
</button>


  {mobileOpen && (
    <div className="fixed inset-0 z-50 flex flex-col backdrop-blur-sm bg-black/70">
      {/* Top search bar */}
      <div className="bg-gradient-to-r from-blue-100 via-purple-200 to-blue-500 text-white p-3 flex items-center gap-2 shadow bg-opacity-20">
        <Search className="w-5 h-5 text-gray-800" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          autoFocus
          className="flex-1 px-3 py-2 rounded-md border border-blue-300 focus:outline-none text-black placeholder-black"
        />
        <button
          onClick={() => {
            setMobileOpen(false);
            setQuery("");
          }}
          className="text-sm font-semibold text-black hover:underline"
        >
          Cancel
        </button>
      </div>

      {/* Results */}
<div className="flex-1 overflow-y-auto bg-transparent">

        {query.length < 3 ? (
          <p className="p-4 text-gray-100">Results ...</p>
        ) : loading ? (
          <p className="p-4 text-gray-100">Searching...</p>
        ) : results.length === 0 ? (
          <p className="p-4 text-gray-100">No results found</p>
        ) : (
          results.map((video) => (
            <div key={video.id} className="border-b p-4 bg-gray-100/90">
              <p className="font-semibold text-gray-800">
                {video.title} {video.is_kuppi && "(Kuppi)"}
              </p>
              <p className="text-gray-800 text-sm mb-2">{video.description}</p>

              <div className="flex flex-wrap gap-2">
                {video.youtube_links.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWatch(url)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                  >
                    Watch Video {idx + 1}
                  </button>
                ))}
                {video.telegram_links?.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                  >
                    Telegram {idx + 1}
                  </a>
                ))}
                {video.material_urls?.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-800 transition"
                  >
                    Material {idx + 1}
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )}
</div>

   
    </>
  );
}
