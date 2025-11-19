'use client';

import { useEffect, useRef } from 'react';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  videoUrl: string;
  videoTitle?: string;
  onBack?: () => void;
}

export default function VideoPlayer({ videoUrl, videoTitle, onBack }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    
    // youtu.be format
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
    
    // youtube.com?v= format
    if (url.includes('v=')) {
      const id = url.split('v=')[1].split('&')[0];
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
    
    // /embed/ format
    if (url.includes('/embed/')) {
      const id = url.split('/embed/')[1].split('?')[0];
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
    
    // /v/ format
    if (url.includes('/v/')) {
      const id = url.split('/v/')[1].split('?')[0];
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }

    return null;
  };

  useEffect(() => {
    if (!videoUrl || !containerRef.current) return;

    const initPlayer = async () => {
      try {
        // Import video.js dynamically
        const videojsModule = await import('video.js');
        const videojs = videojsModule.default || videojsModule;
        
        // Import YouTube plugin
        await import('videojs-youtube');

        // Dispose existing player
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }

        // Create video element
        const videoElement = document.createElement('video');
        videoElement.className = 'video-js vjs-default-skin vjs-big-play-centered';
        videoElement.setAttribute('controls', '');
        videoElement.setAttribute('preload', 'auto');
        videoElement.setAttribute('width', '640');
        videoElement.setAttribute('height', '360');

        // Clear container and add video element
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(videoElement);
        } else {
          return;
        }

        const youtubeId = extractYouTubeId(videoUrl);

        // Configure player based on video type
        const playerOptions: any = {
          controls: true,
          autoplay: false,
          preload: 'auto',
          responsive: true,
          fluid: true,
          playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        };

        if (youtubeId) {
          // YouTube video
        //   playerOptions.techOrder = ['youtube'];
          playerOptions.sources = [
            {
              src: `https://www.youtube.com/watch?v=${youtubeId}`,
              type: 'video/youtube',
            },
          ];
        } else {
          // HTML5 video
          playerOptions.sources = [
            {
              src: videoUrl,
              type: 'video/mp4',
            },
          ];
        }

        // Initialize player
        playerRef.current = videojs(videoElement, playerOptions, function onPlayerReady() {
          console.log('Video player ready');
        });

      } catch (error) {
        console.error('Error initializing video player:', error);
      }
    };

    initPlayer();

    // Cleanup
    return () => {
      if (playerRef.current && typeof playerRef.current.dispose === 'function') {
        try {
          playerRef.current.dispose();
          playerRef.current = null;
        } catch (e) {
          console.error('Error disposing player:', e);
        }
      }
    };
  }, [videoUrl]);

  if (!videoUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        No video URL provided
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-gray-50">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-white rounded shadow hover:bg-gray-100 transition-colors"
        >
          ← Back
        </button>
      )}

      <div className="w-full max-w-4xl">
        {videoTitle && (
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{videoTitle}</h1>
        )}
        
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div ref={containerRef} style={{ aspectRatio: '16/9' }} />
        </div>
      </div>
    </div>
  );
}
