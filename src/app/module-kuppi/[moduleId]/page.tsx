// ModuleKuppiPage.tsx (updated)
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import VideoCard from '../../components/VideoCard';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import BackButton from '../../components/BackButton';
import { Video } from '../../types/video';

export default function ModuleKuppiPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  const router = useRouter();
  const params = useParams();
  const moduleId = params.moduleId as string;

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
  const handleToggleVideo = (id: number) => {
    setActiveVideoId(activeVideoId === id ? null : id);
  };

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
        <BackButton onClick={handleBack} className="mb-8" />
        
        <PageHeader 
          title="Module Content" 
          subtitle="Explore available videos and materials for this module" 
        />

        {videos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                moduleId={moduleId}
                isActive={activeVideoId === video.id}
                onToggle={handleToggleVideo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}