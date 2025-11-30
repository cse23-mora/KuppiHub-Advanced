'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react"; // search icon

interface Module {
  id: number;
  code: string;
  name: string;
  video_count: number;
}

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search-modules?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleGoModule = (moduleId: number) => {
    setSearchOpen(false);
    setQuery("");
    router.push(`/module-kuppi/${moduleId}`);
  };

  return (
    <>
      {/* Search button (both desktop and mobile) */}
      <button
        onClick={() => setSearchOpen(true)}
        className="relative flex items-center gap-2 px-3 py-2 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 shadow "
      >
        <Search className="w-5 h-5" /> 
        <span className="hidden md:block">Search modules...</span>
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
      placeholder="Search modules by name or code..."
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
            {query.length < 2 ? (
              <p className="p-4 text-gray-100">Type at least 2 characters to search modules...</p>
            ) : loading ? (
              <p className="p-4 text-gray-100">Searching modules...</p>
            ) : results.length === 0 ? (
              <p className="p-4 text-gray-100">No modules found</p>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((mod: Module) => (
                  <div 
                    key={mod.id} 
                    className="p-4 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition transform hover:scale-105"
                    onClick={() => handleGoModule(mod.id)}
                  >
                    <p className="font-bold text-blue-600 text-sm">{mod.code}</p>
                    <p className="font-semibold text-gray-800 mt-1">{mod.name}</p>
                    <p className="text-sm text-gray-600 mt-2">📹 {mod.video_count} video{mod.video_count !== 1 ? 's' : ''}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
