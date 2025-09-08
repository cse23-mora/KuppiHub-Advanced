"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function WatchVideoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const raw = searchParams.get("videoUrl") || "";
  let videoUrl = raw;
  try { videoUrl = decodeURIComponent(raw); } catch  { /* ignore */ }

  //@ts-ignore
  const getYouTubeVideoId = (input) => {
    if (!input) return null;

    // If user passed a raw 11-char id
    if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;

    try {
      const u = new URL(input);
      const host = u.hostname.replace(/^www\./i, "").toLowerCase();

      // 1) ?v=VIDEOID
      const v = u.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;

      // 2) youtu.be/VIDEOID
      if (host === "youtu.be") {
        const id = u.pathname.split("/").filter(Boolean).pop();
        if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
      }

      // 3) /embed/VIDEOID  or /v/VIDEOID  or /shorts/VIDEOID
      const m = u.pathname.match(/\/(?:embed|v|shorts)\/([A-Za-z0-9_-]{11})(?:\/|$)/);
      if (m) return m[1];

      // No reliable ID found
      return null;
    } catch {
      // not a valid URL, and not an 11-char id -> no ID
      return null;
    }
  };

  const videoId = useMemo(() => getYouTubeVideoId(videoUrl), [videoUrl]);

  const handleBack = () => router.back();

  if (!videoUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        No video URL provided
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-gray-50">
      <button
        onClick={handleBack}
        className="mb-6 px-4 py-2 bg-white rounded shadow hover:bg-gray-100"
      >
        ← Back
      </button>

      {videoId ? (
        <div className="w-full max-w-4xl" style={{ aspectRatio: "16/9" }}>
          <iframe
            title="YouTube video player"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full rounded-lg shadow"
          />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Couldn 't extract a YouTube video ID from that URL.
          </p>
          <div className="flex gap-2 justify-center">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Open original URL
            </a>
            <button
              onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(videoUrl);
              }}
              className="inline-block px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Copy URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
