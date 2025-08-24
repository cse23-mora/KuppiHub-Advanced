'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Video {
  id: number;
  title: string;
  urls: string[];
  telegram_links?: string[];
  material_urls?: string[];
  is_kuppi?: boolean;
  discription?: string;
}

export default function ModuleKuppiPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const moduleId = params.moduleId;

  useEffect(() => {
    if (!moduleId) return;

    const fetchVideos = async () => {
      try {
        const res = await fetch(`/api/kuppis?moduleId=${moduleId}`);
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data: Video[] = await res.json();
        setVideos(data);
      } catch (err) {
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [moduleId]);

  const handleBack = () => {
    router.back();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading videos...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-6 px-4 py-2 bg-white rounded shadow hover:bg-gray-100"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6">Module Videos / Kuppis</h1>

        {videos.length === 0 ? (
          <p className="text-gray-600">No videos available for this module.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {video.title} {video.is_kuppi && <span className="text-green-500 font-bold">(Kuppi)</span>}
                </h2>

                {video.discription && (
                  <p className="text-gray-600 mb-4">{video.discription}</p>
                )}

                <div className="flex flex-col gap-2">
              {video.urls && video.urls.length > 0 && (
  <a
    href={video.urls[0]}
    target="_blank"
    className="text-blue-500 underline"
  >
    Watch Video
  </a>
)}


                  {video.telegram_links && video.telegram_links.length > 0 && (
                    <a
                      href={video.telegram_links[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Telegram Link
                    </a>
                  )}

                  {video.material_urls && video.material_urls.length > 0 && (
                    <a
                      href={video.material_urls[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:underline"
                    >
                      Additional Material
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
