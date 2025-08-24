'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


interface Module {
  id: number;
  code: string;
  name: string;
  description?: string;
  video_count: number;
  kuppi_count: number;
}

export default function DashboardPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const facultyId = searchParams.get('faculty');
    const departmentId = searchParams.get('department');
    const semesterId = searchParams.get('semester');
    
    if (facultyId && departmentId && semesterId) {
      setSelectedFaculty(facultyId);
      setSelectedDepartment(departmentId);
      setSelectedSemester(semesterId);
      fetchModules();
    } else {
      router.push('/faculty');
    }
  }, [searchParams, router]);

  const fetchModules = async () => {
    try {
      
      // Mock data - replace with a
      // ctual Supabase call
      const mockModules = [
        { id: 1, code: 'CS101', name: 'Introduction to Programming', description: 'Basic programming concepts', video_count: 15, kuppi_count: 8 },
        { id: 2, code: 'CS102', name: 'Data Structures', description: 'Fundamental data structures', video_count: 12, kuppi_count: 5 },
        { id: 3, code: 'CS103', name: 'Algorithms', description: 'Algorithm design and analysis', video_count: 18, kuppi_count: 12 },
        { id: 4, code: 'MATH101', name: 'Calculus I', description: 'Differential calculus', video_count: 20, kuppi_count: 6 }
      ];
      
      setModules(mockModules);
      setLoading(false);
    } catch (err) {
      setError('Failed to load modules');
      setLoading(false);
    }
  };



  const handleViewVideos = (moduleId: number) => {
    router.push(`/videos?module=${moduleId}&faculty=${selectedFaculty}&department=${selectedDepartment}&semester=${selectedSemester}`);
  };

  const handleBack = () => {
    router.push(`/semester?faculty=${selectedFaculty}&department=${selectedDepartment}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4">
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
              <h1 className="text-4xl font-bold text-gray-800">Your Dashboard</h1>
              <p className="text-gray-600">Manage your modules and kuppi videos</p>
            </div>
          </div>
          
          
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{module.code}</h3>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">{module.name}</h4>
                {module.description && (
                  <p className="text-gray-600 text-sm">{module.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <span>📹 {module.video_count} videos</span>
                <span>🎯 {module.kuppi_count} kuppi</span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleViewVideos(module.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Videos
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{modules.length}</div>
            <div className="text-gray-600">Total Modules</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {modules.reduce((sum, module) => sum + module.video_count, 0)}
            </div>
            <div className="text-gray-600">Total Videos</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {modules.reduce((sum, module) => sum + module.kuppi_count, 0)}
            </div>
            <div className="text-gray-600">Total Kuppi</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
            <div className="text-gray-600">Learning Potential</div>
          </div>
        </div>
      </div>
    </div>
  );
}
