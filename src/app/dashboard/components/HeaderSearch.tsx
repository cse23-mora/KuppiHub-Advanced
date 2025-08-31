'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Video {
  id: number;
  title: string;
  description: string;
  urls: string[];
  telegram_links?: string[];
  material_urls?: string[];
  is_kuppi?: boolean;
}

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
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
        const json = await res.json();
        setResults(json.data || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleWatch = (url: string) => {
    router.push(`/module-kuppi/watch?videoUrl=${encodeURIComponent(url)}`);
  };

  return (
    <div className="relative w-80">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search modules, Kuppi, videos..."
        className="w-full px-4 py-2 rounded shadow focus:outline-none focus:ring focus:ring-blue-300"
      />

      {query.length >= 3 && (
        <div className="absolute mt-2 bg-white shadow-lg rounded w-full max-h-96 overflow-y-auto z-50">
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
                {video.description && (
                  <p className="text-gray-600 text-sm mb-2">{video.description}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {video.urls.map((url, idx) => (
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
  );
}
