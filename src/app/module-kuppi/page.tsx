'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface KuppiVideo {
  id: number;
  title: string;
  urls: string[];
  telegram_links?: string[];
  material_urls?: string[];
  owner_name: string;
  created_at: string;
  description?: string;
}

interface Module {
  id: number;
  code: string;
  name: string;
}

export default function ModuleKuppiPage() {
  const [kuppiVideos, setKuppiVideos] = useState<KuppiVideo[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');


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
      fetchModule(parseInt(moduleId));
      fetchKuppiVideos(parseInt(moduleId));
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

  const fetchKuppiVideos = async (moduleId: number) => {
    try {
      // Mock data - replace with actual Supabase call
      const mockKuppiVideos = [
        {
          id: 1,
          title: 'My Tips for Debugging Code',
          urls: ['https://youtube.com/watch?v=abc123'],
          telegram_links: ['https://t.me/download1'],
          material_urls: ['https://drive.google.com/notes1'],
          owner_name: 'John Doe',
          created_at: '2024-01-25T16:45:00Z',
          description: 'Personal debugging techniques and common mistakes to avoid'
        },
        {
          id: 2,
          title: 'Quick Review: Functions and Scope',
          urls: ['https://youtube.com/watch?v=def456'],
          telegram_links: ['https://t.me/download2'],
          material_urls: ['https://drive.google.com/notes2'],
          owner_name: 'Jane Smith',
          created_at: '2024-01-28T09:15:00Z',
          description: 'Comprehensive overview of function concepts and scope rules'
        },
        {
          id: 3,
          title: 'Variables and Data Types Explained',
          urls: ['https://youtube.com/watch?v=ghi789'],
          telegram_links: ['https://t.me/download3'],
          material_urls: ['https://drive.google.com/notes3'],
          owner_name: 'Mike Johnson',
          created_at: '2024-01-30T11:20:00Z',
          description: 'Understanding different variable types and when to use them'
        },
        {
          id: 4,
          title: 'Control Flow and Loops',
          urls: ['https://youtube.com/watch?v=jkl012'],
          telegram_links: ['https://t.me/download4'],
          material_urls: ['https://drive.google.com/notes4'],
          owner_name: 'Sarah Wilson',
          created_at: '2024-02-01T14:30:00Z',
          description: 'Mastering if-else statements and loop structures'
        }
      ];
      
      setKuppiVideos(mockKuppiVideos);
      setLoading(false);
    } catch (err) {
      setError('Failed to load kuppi videos');
      setLoading(false);
    }
  };

  const filteredVideos = kuppiVideos;

  const handleBack = () => {
    router.push(`/semester?faculty=${selectedFaculty}&department=${selectedDepartment}`);
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading kuppi videos...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
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
              <h1 className="text-4xl font-bold text-gray-800">{module.code} Kuppi Videos</h1>
              <p className="text-gray-600">{module.name} - Student-created learning resources</p>
            </div>
          </div>
          

        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{kuppiVideos.length}</div>
              <div className="text-gray-600">Total Kuppi Videos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {kuppiVideos.reduce((sum, video) => sum + video.urls.length, 0)}
              </div>
              <div className="text-gray-600">Total Videos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {kuppiVideos.filter(video => video.material_urls && video.material_urls.length > 0).length}
              </div>
              <div className="text-gray-600">With Materials</div>
            </div>
          </div>
        </div>

        {/* Kuppi Videos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      Kuppi
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(video.created_at)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    by <span className="font-medium">{video.owner_name}</span>
                  </p>
                  {video.description && (
                    <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                  )}
                </div>

                {/* YouTube Embedded Videos */}
                <div className="space-y-4 mb-4">
                  {video.urls.map((url, index) => {
                    const videoId = getYouTubeVideoId(url);
                    if (videoId) {
                      return (
                        <div key={index} className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`${video.title} - Video ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      );
                    }
                    return (
                      <div key={index} className="p-4 bg-gray-100 rounded-lg">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          📹 Watch Video {index + 1} (External Link)
                        </a>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Resources */}
                <div className="space-y-3">
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
                            className="block text-green-600 hover:text-green-800 text-sm"
                          >
                            📥 Download {index + 1} via Telegram
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Material URLs */}
                  {video.material_urls && video.material_urls.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Study Materials:</h4>
                      <div className="space-y-2">
                        {video.material_urls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-orange-600 hover:text-orange-800 text-sm"
                          >
                            📚 Study Material {index + 1}
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
            <div className="text-gray-500 text-lg mb-4">
              No kuppi videos available for this module yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
