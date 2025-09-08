// components/VideoCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Video {
  id: number;
  title: string;
  youtube_links: string[];
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

interface VideoCardProps {
  video: Video;
  moduleId: string;
  isActive: boolean;
  onToggle: (id: number) => void;
}

export default function VideoCard({ video, moduleId, isActive, onToggle }: VideoCardProps) {


  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl h-fit"
    >
      <button
        onClick={() => onToggle(video.id)}
        className="w-full text-left p-6 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">{video.title}</h2>
          {video.is_kuppi && (
            <span className="ml-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              Kuppi
            </span>
          )}
        </div>
        <svg 
          className={`w-6 h-6 text-blue-500 transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isActive && (
          <VideoCardContent video={video} moduleId={moduleId} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function VideoCardContent({ video, moduleId }: { video: Video; moduleId: string }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="px-6 pb-6 border-t border-blue-100"
    >
      {video.description && (
        <p className="text-gray-600 mt-4 mb-4 text-sm">
          {video.description}
        </p>
      )}

      {video.owner?.name && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-800">{video.owner.name}</p>
       {video.owner.department?.name && (
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
        {video.youtube_links.map((url, index) => (
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
            Watch Video {video.youtube_links.length > 1 ? index + 1 : ""}
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
              Telegram {video.telegram_links!.length > 1 ? index + 1 : ""}
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
              Material {video.material_urls!.length > 1 ? index + 1 : ""}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}