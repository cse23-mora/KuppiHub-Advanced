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
  module_code: string;
  module_name: string;
}

export default function BrowseKuppiPage() {
  const [kuppiVideos, setKuppiVideos] = useState<KuppiVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
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
      fetchKuppiVideos();
      fetchAvailableModules();
    } else {
      router.push('/faculty');
    }
  }, [searchParams, router]);

  const fetchKuppiVideos = async () => {
    try {
      // Mock data - replace with actual Supabase call
      const mockKuppiVideos = [
        {
          id: 1,
          title: 'My Tips for Debugging Code',
          urls: ['https://youtube.com/watch?v=ghi789'],
          telegram_links: ['https://t.me/download1'],
          material_urls: ['https://drive.google.com/notes1'],
          owner_name: 'John Doe',
          created_at: '2024-01-25T16:45:00Z',
          module_code: 'CS101',
          module_name: 'Introduction to Programming'
        },
        {
          id: 2,
          title: 'Quick Review: Functions and Scope',
          urls: ['https://youtube.com/watch?v=jkl012'],
          telegram_links: ['https://t.me/download2'],
          material_urls: ['https://drive.google.com/notes2'],
          owner_name: 'Jane Smith',
          created_at: '2024-01-28T09:15:00Z',
          module_code: 'CS101',
          module_name: 'Introduction to Programming'
        },
        {
          id: 3,
          title: 'Data Structures Made Simple',
          urls: ['https://youtube.com/watch?v=mno345'],
          telegram_links: ['https://t.me/download3'],
          material_urls: ['https://drive.google.com/notes3'],
          owner_name: 'Mike Johnson',
          created_at: '2024-01-30T11:20:00Z',
          module_code: 'CS102',
          module_name: 'Data Structures'
        },
        {
          id: 4,
          title: 'Algorithm Optimization Tricks',
          urls: ['https://youtube.com/watch?v=pqr678'],
          telegram_links: ['https://t.me/download4'],
          material_urls: ['https://drive.google.com/notes4'],
          owner_name: 'Sarah Wilson',
          created_at: '2024-02-01T14:30:00Z',
          module_code: 'CS103',
          module_name: 'Algorithms'
        },
        {
          id: 5,
          title: 'Calculus Integration Methods',
          urls: ['https://youtube.com/watch?v=stu901'],
          telegram_links: ['https://t.me/download5'],
          material_urls: ['https://drive.google.com/notes5'],
          owner_name: 'Alex Brown',
          created_at: '2024-02-03T10:45:00Z',
          module_code: 'MATH101',
          module_name: 'Calculus I'
        }
      ];
      
      setKuppiVideos(mockKuppiVideos);
      setLoading(false);
    } catch (err) {
      setError('Failed to load kuppi videos');
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

  const filteredKuppiVideos = kuppiVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.module_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = selectedModule === 'all' || video.module_code === selectedModule;
    
    return matchesSearch && matchesModule;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Browse Kuppi</h1>
            <p className="text-gray-600">Discover student-created learning resources</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Kuppi
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, creator, or module..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Module Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Module
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredKuppiVideos.length} kuppi video{filteredKuppiVideos.length !== 1 ? 's' : ''}
            {selectedModule !== 'all' && ` in ${selectedModule}`}
          </p>
        </div>

        {/* Kuppi Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKuppiVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      {video.module_code}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(video.created_at)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    by <span className="font-medium">{video.owner_name}</span>
                  </p>
                  <p className="text-xs text-gray-500">{video.module_name}</p>
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

        {filteredKuppiVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchTerm || selectedModule !== 'all' 
                ? 'No kuppi videos found matching your criteria.' 
                : 'No kuppi videos available yet. Be the first to create one!'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
