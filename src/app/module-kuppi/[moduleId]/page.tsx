'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
  owner?: {
    name: string;
    department: {
      name: string;
    };
  };
}

export default function ModuleKuppiPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-xl text-blue-600">Loading videos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Module Content
            </span>
          </h1>
          <p className="text-lg font-medium text-gray-700">
            Explore available videos and materials for this module
          </p>
        </motion.div>


        {videos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 px-6 bg-white rounded-2xl shadow-lg border border-blue-100"
          >
            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Videos Available</h3>
            <p className="text-gray-600">There are no videos or kuppis available for this module yet.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Changed to grid layout */}
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl h-fit" /* Added h-fit */
            >
                <button
                  onClick={() => setActiveVideoId(activeVideoId === video.id ? null : video.id)}
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="flex items-center">
                    <h2 className="text-lg font-semibold text-gray-800">{video.title}</h2>
                    <p>{video.description}</p>
                    {video.is_kuppi && (
                      <span className="ml-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Kuppi
                      </span>
                    )}
                  </div>
                  <svg 
                    className={`w-6 h-6 text-blue-500 transform transition-transform duration-300 ${activeVideoId === video.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {activeVideoId === video.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 border-t border-blue-100"
                    >
                     














                      {video.owner?.name && (
                        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{video.owner.name}</p>
                            {video.owner.department.name && (
                              <p className="text-xs text-gray-500">
                                Department of {video.owner.department.name}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-2">
                        {video.language_code && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
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
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            key={`url-${index}`}
                            onClick={() =>
                              router.push(
                                `/module-kuppi/${moduleId}/watch?videoUrl=${encodeURIComponent(url)}`
                              )
                            }
                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
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
                          </motion.button>
                        ))}

                        <div className="flex flex-wrap gap-2">
                          {video.telegram_links?.map((link, index) => (
                            <motion.a
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              key={`tg-${index}`}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-grow flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                            >
                              <svg
                                className="w-4 h-4 mr-1.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                              </svg>
                              Telegram {video.telegram_links.length > 1 ? index + 1 : ""}
                            </motion.a>
                          ))}

                          {video.material_urls?.map((link, index) => (
                            <motion.a
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              key={`mat-${index}`}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-grow flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-xl text-white bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
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
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}