'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface MyKuppiVideo {
  id: number;
  title: string;
  urls: string[];
  telegram_links?: string[];
  material_urls?: string[];
  created_at: string;
  module_code: string;
  module_name: string;
  view_count: number;
  like_count: number;
}

export default function MyKuppiPage() {
  const [myKuppiVideos, setMyKuppiVideos] = useState<MyKuppiVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [availableModules, setAvailableModules] = useState<Array<{code: string, name: string}>>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const facultyId = searchParams.get('faculty');
    const departmentId = searchParams.get('department');
    const batchId = searchParams.get('batch');
    const semesterId = searchParams.get('semester');
    
    if (facultyId && departmentId && semesterId) {
      setSelectedFaculty(facultyId);
      setSelectedDepartment(departmentId);
      setSelectedSemester(semesterId);
      fetchMyKuppiVideos();
      fetchAvailableModules();
    } else {
      router.push('/faculty');
    }
  }, [searchParams, router]);

  const fetchMyKuppiVideos = async () => {
    try {
      // Mock data - replace with actual Supabase call
      const mockMyKuppiVideos = [
        {
          id: 1,
          title: 'My Tips for Debugging Code',
          urls: ['https://youtube.com/watch?v=ghi789'],
          telegram_links: ['https://t.me/download1'],
          material_urls: ['https://drive.google.com/notes1'],
          created_at: '2024-01-25T16:45:00Z',
          module_code: 'CS101',
          module_name: 'Introduction to Programming',
          view_count: 45,
          like_count: 12
        },
        {
          id: 2,
          title: 'Quick Review: Functions and Scope',
          urls: ['https://youtube.com/watch?v=jkl012'],
          telegram_links: ['https://t.me/download2'],
          material_urls: ['https://drive.google.com/notes2'],
          created_at: '2024-01-28T09:15:00Z',
          module_code: 'CS101',
          module_name: 'Introduction to Programming',
          view_count: 32,
          like_count: 8
        },
        {
          id: 3,
          title: 'Data Structures Made Simple',
          urls: ['https://youtube.com/watch?v=mno345'],
          telegram_links: ['https://t.me/download3'],
          material_urls: ['https://drive.google.com/notes3'],
          created_at: '2024-01-30T11:20:00Z',
          module_code: 'CS102',
          module_name: 'Data Structures',
          view_count: 28,
          like_count: 15
        }
      ];
      
      setMyKuppiVideos(mockMyKuppiVideos);
      setLoading(false);
    } catch (err) {
      setError('Failed to load your kuppi videos');
      setLoading(false);
    }
  };

  const fetchAvailableModules = async () => {
    try {
      // Mock data - replace with actual Supabase call
      const mockModules = [
        { code: 'CS101', name: 'Introduction to Programming' },
        { code: 'CS102', name: 'Data Structures' },
        { code: 'CS103', name: 'Algorithms' },
        { code: 'MATH101', name: 'Calculus I' }
      ];
      
      setAvailableModules(mockModules);
    } catch (err) {
      console.error('Failed to load modules');
    }
  };

  const filteredKuppiVideos = myKuppiVideos.filter(video => {
    return selectedModule === 'all' || video.module_code === selectedModule;
  });

  const handleBack = () => {
    router.push(`/dashboard?faculty=${selectedFaculty}&department=${selectedDepartment}&semester=${selectedSemester}`);
  };



  const handleEditKuppi = (kuppiId: number) => {
    // Navigate to edit page or open edit modal
    console.log('Edit kuppi:', kuppiId);
  };

  const handleDeleteKuppi = async (kuppiId: number) => {
    if (confirm('Are you sure you want to delete this kuppi? This action cannot be undone.')) {
      try {
        // Mock API call - replace with actual Supabase call
        console.log('Deleting kuppi:', kuppiId);
        
        // Remove from local state
        setMyKuppiVideos(prev => prev.filter(kuppi => kuppi.id !== kuppiId));
      } catch (err) {
        setError('Failed to delete kuppi');
      }
    }
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
        <div className="text-xl">Loading your kuppi videos...</div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
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
              <h1 className="text-4xl font-bold text-gray-800">My Kuppi</h1>
              <p className="text-gray-600">Manage your created learning resources</p>
            </div>
          </div>
          

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">{myKuppiVideos.length}</div>
            <div className="text-gray-600">Total Kuppi</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {myKuppiVideos.reduce((sum, kuppi) => sum + kuppi.view_count, 0)}
            </div>
            <div className="text-gray-600">Total Views</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {myKuppiVideos.reduce((sum, kuppi) => sum + kuppi.like_count, 0)}
            </div>
            <div className="text-gray-600">Total Likes</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {availableModules.length}
            </div>
            <div className="text-gray-600">Modules Covered</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Module:</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Modules</option>
              {availableModules.map((module) => (
                <option key={module.code} value={module.code}>
                  {module.code} - {module.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredKuppiVideos.length} kuppi video{filteredKuppiVideos.length !== 1 ? 's' : ''}
            {selectedModule !== 'all' && ` in ${selectedModule}`}
          </p>
        </div>

        {/* Kuppi Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKuppiVideos.map((kuppi) => (
            <div key={kuppi.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                      {kuppi.module_code}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(kuppi.created_at)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {kuppi.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">{kuppi.module_name}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👁️ {kuppi.view_count} views</span>
                    <span>❤️ {kuppi.like_count} likes</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {/* Video URLs */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Videos:</h4>
                    <div className="space-y-2">
                      {kuppi.urls.map((url, index) => (
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
                  {kuppi.telegram_links && kuppi.telegram_links.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Downloads:</h4>
                      <div className="space-y-2">
                        {kuppi.telegram_links.map((link, index) => (
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
                  {kuppi.material_urls && kuppi.material_urls.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Materials:</h4>
                      <div className="space-y-2">
                        {kuppi.material_urls.map((url, index) => (
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

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditKuppi(kuppi.id)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteKuppi(kuppi.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredKuppiVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {selectedModule !== 'all' 
                ? 'No kuppi videos found in this module.' 
                : 'You haven\'t created any kuppi videos yet.'
              }
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
