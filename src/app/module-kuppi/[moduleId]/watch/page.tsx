"use client";

import { useSearchParams, useRouter } from "next/navigation";
import VideoPlayer from "../../../components/VideoPlayer";

export default function WatchVideoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const raw = searchParams.get("videoUrl") || "";
  const videoTitle = searchParams.get("videoTitle") || undefined;
  
  let videoUrl = raw;
  try { videoUrl = decodeURIComponent(raw); } catch { /* ignore */ }

  const handleBack = () => router.back();

  if (!videoUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        No video URL provided
      </div>
    );
  }

  return (
    <VideoPlayer 
      key={videoUrl}
      videoUrl={videoUrl} 
      videoTitle={videoTitle} 
      onBack={handleBack}
    />
  );
}
