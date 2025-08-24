'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Video {
  id: number;
  title: string;
  urls: string[];
  telegram_links?: string[];
  material_urls?: string[];
  is_kuppi: boolean;
  owner_name?: string;
  created_at: string;
}

interface Module {
  id: number;
  code: string;
  name: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const [selectedSemester, setSelectedSemester] = useState<string>('');

  const [filter, setFilter] = useState<'all' | 'official' | 'kuppi'>('all');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const facultyId = searchParams.get('faculty');
    const departmentId = searchParams.get('department');
    const semesterId = searchParams.get('semester');
    const moduleId = searchParams.get('module');
    
    if (facultyId && departmentId && semesterId && moduleId) {
      setSelectedFaculty(facultyId);
      setSelectedDepartment(departmentId);
      setSelectedSemester(semesterId);
      fetchModule(parseInt(moduleId));
      fetchVideos(parseInt(moduleId));
    } else {
      router.push('/faculty');
    }
  }, [searchParams, router]);

  const fetchModule = async (moduleId: number) => {
    try {
      // Mock data - replace with actual Supabase call
      const mockModule = {
        id: moduleId,
        code: 'CS101',
        name: 'Introduction to Programming'
      };
      
      setModule(mockModule);
    } catch (err) {
      setError('Failed to load module');
    }
  };

  const fetchVideos = async (moduleId: number) => {
    try {
      // Mock data - replace with actual Supabase call
      const mockVideos = [
        {
          id: 1,
          title: 'Introduction to Variables and Data Types',
          urls: ['https://youtube.com/watch?v=abc123'],
          telegram_links: ['https://t.me/download1'],
          material_urls: ['https://drive.google.com/notes1'],
          is_kuppi: false,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'Understanding Loops and Control Flow',
          urls: ['https://youtube.com/watch?v=def456'],
          telegram_links: ['https://t.me/download2'],
          material_urls: ['https://drive.google.com/notes2'],
          is_kuppi: false,
          created_at: '2024-01-20T14:30:00Z'
        },
        {
          id: 3,
          title: 'My Tips for Debugging Code',
          urls: ['https://youtube.com/watch?v=ghi789'],
          telegram_links: ['https://t.me/download3'],
          material_urls: ['https://drive.google.com/notes3'],
          is_kuppi: true,
          owner_name: 'John Doe',
          created_at: '2024-01-25T16:45:00Z'
        },
        {
          id: 4,
          title: 'Quick Review: Functions and Scope',
          urls: ['https://youtube.com/watch?v=jkl012'],
          telegram_links: ['https://t.me/download4'],
          material_urls: ['https://drive.google.com/notes4'],
          is_kuppi: true,
          owner_name: 'Jane Smith',
          created_at: '2024-01-28T09:15:00Z'
        }
      ];
      
      setVideos(mockVideos);
      setLoading(false);
    } catch (err) {
      setError('Failed to load videos');
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    if (filter === 'official') return !video.is_kuppi;
    if (filter === 'kuppi') return video.is_kuppi;
    return true;
  });

  const handleBack = () => {
    router.push(`/dashboard?faculty=${selectedFaculty}&department=${selectedDepartment}&semester=${selectedSemester}`);
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Module not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{module.code} Videos</h1>
              <p className="text-gray-600">{module.name} - All available learning resources</p>
            </div>
          </div>
          

        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All Videos', count: videos.length },
              { key: 'official', label: 'Official', count: videos.filter(v => !v.is_kuppi).length },
              { key: 'kuppi', label: 'Kuppi', count: videos.filter(v => v.is_kuppi).length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as 'all' | 'official' | 'kuppi')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                      <span>{formatDate(video.created_at)}</span>
                      {video.is_kuppi && video.owner_name && (
                        <>
                          <span>•</span>
                          <span>by {video.owner_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                    video.is_kuppi 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {video.is_kuppi ? 'Kuppi' : 'Official'}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Video URLs */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Videos:</h4>
                    <div className="space-y-2">
                      {video.urls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-800 text-sm truncate"
                        >
                          📹 Video {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Telegram Links */}
                  {video.telegram_links && video.telegram_links.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Downloads:</h4>
                      <div className="space-y-2">
                        {video.telegram_links.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-green-600 hover:text-green-800 text-sm truncate"
                          >
                            📥 Download {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Material URLs */}
                  {video.material_urls && video.material_urls.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Materials:</h4>
                      <div className="space-y-2">
                        {video.material_urls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-orange-600 hover:text-orange-800 text-sm truncate"
                          >
                            📚 Material {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No videos found for this filter.</div>
          </div>
        )}
      </div>
    </div>
  );
}
