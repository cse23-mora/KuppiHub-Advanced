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
  description?: string;
  language_code?: string;
  created_at?: string;
  owner_name?: string;
  owner_image?: string;
}

export default function ModuleKuppiPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null); // Start with the first video open

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
        // Open the first video by default if available
        if (data.length > 0) {
          setActiveVideoId(data[0].id);
        }
      } catch {
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [moduleId]);

  const handleBack = () => router.back();

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading videos...</div>;
  if (error)
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <button onClick={handleBack} className="mb-6 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors flex items-center text-gray-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800">Module Content</h1>

        {videos.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-xl shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Videos Available</h3>
            <p className="mt-1 text-sm text-gray-500">There are no videos or kuppis available for this module yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
                <button
                  onClick={() => setActiveVideoId(activeVideoId === video.id ? null : video.id)}
                  className="w-full text-left p-4 sm:p-5 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                >
                  <div className="flex items-center">
                    <h2 className="text-md sm:text-lg font-semibold text-gray-800">{video.title}</h2>
                    {video.is_kuppi && <span className="ml-3 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Kuppi</span>}
                  </div>
                  <svg className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${activeVideoId === video.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>




                {activeVideoId === video.id && (
                  <div className="px-4 sm:px-5 pb-5 border-t border-gray-200">
                    {video.description && (
                      <p className="text-gray-600 mt-4 mb-4 text-sm sm:text-base">
                        {video.description}
                      </p>
                    )}

                    {/* NEW: Owner info */}
                    {video.owner_name && (
                      <div className="flex items-center gap-3 mb-4">
                        {video.owner_image_url && (
                          <img
                            src={video.owner_image_url}
                            alt={video.owner_name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{video.owner_name}</p>
                          {video.faculty_id && (
                            <p className="text-xs text-gray-500">
                              Faculty ID: {video.faculty_id}
                            </p>
                          )}
                          {video.department_id && (
                            <p className="text-xs text-gray-500">
                              Department ID: {video.department_id}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* NEW: Extra metadata */}
                    <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-3">
                      {video.language_code && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
                          Language: {video.language_code.toUpperCase()}
                        </span>
                      )}
                      {video.created_at && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                          Uploaded: {new Date(video.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {video.urls.map((url, index) => (
                        <button
                          key={`url-${index}`}
                          onClick={() =>
                            router.push(
                              `/module-kuppi/${moduleId}/watch?videoUrl=${encodeURIComponent(
                                url
                              )}`
                            )
                          }
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Watch Video {video.urls.length > 1 ? index + 1 : ""}
                        </button>
                      ))}

                      {/* telegram + material links remain same */}
                      <div className="flex flex-wrap gap-2">
                        {video.telegram_links?.map((link, index) => (
                          <a
                            key={`tg-${index}`}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-grow flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 mr-1.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                            </svg>
                            Telegram {video.telegram_links.length > 1 ? index + 1 : ""}
                          </a>
                        ))}

                        {video.material_urls?.map((link, index) => (
                          <a
                            key={`mat-${index}`}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-grow flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
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
                            Material {video.material_urls.length > 1 ? index + 1 : ""}
                          </a>
                        ))}

                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
