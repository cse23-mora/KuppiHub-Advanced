'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function WatchVideoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoUrl = searchParams.get('videoUrl');

  const handleBack = () => router.back();

  if (!videoUrl) return <div className="min-h-screen flex items-center justify-center text-red-500">No video URL provided</div>;

  // Extract YouTube video ID
  const urlObj = new URL(videoUrl);
  const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-gray-50">
      <button onClick={handleBack} className="mb-6 px-4 py-2 bg-white rounded shadow hover:bg-gray-100">← Back</button>

      <div className="w-full max-w-4xl aspect-video">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow"
        />
      </div>
    </div>
  );
}
