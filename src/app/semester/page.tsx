'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Semester {
  id: number;
  name: string;
}

interface Module {
  id: number;
  code: string;
  name: string;
  description?: string;
  video_count: number;
  kuppi_count: number;
}

export default function SemesterPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [showModules, setShowModules] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const facultyId = searchParams.get('faculty');
    const departmentId = searchParams.get('department');
    
    if (facultyId && departmentId) {
      setSelectedFaculty(facultyId);
      setSelectedDepartment(departmentId);
      fetchSemesters();
    } else {
      router.push('/faculty');
    }
  }, [searchParams, router]);

  const fetchSemesters = async () => {
    try {
      // Mock data - replace with actual Supabase call
      const mockSemesters = [
        { id: 1, name: 'Semester 1' },
        { id: 2, name: 'Semester 2' },
        { id: 3, name: 'Semester 3' },
        { id: 4, name: 'Semester 4' },
        { id: 5, name: 'Semester 5' },
        { id: 6, name: 'Semester 6' },
        { id: 7, name: 'Semester 7' },
        { id: 8, name: 'Semester 8' }
      ];
      
      setSemesters(mockSemesters);
      setLoading(false);
    } catch (err) {
      setError('Failed to load semesters');
      setLoading(false);
    }
  };

  const fetchModules = async (semesterId: number) => {
    try {
      // Mock data - replace with actual Supabase call
      const mockModules = [
        { id: 1, code: 'CS101', name: 'Introduction to Programming', description: 'Basic programming concepts', video_count: 15, kuppi_count: 8 },
        { id: 2, code: 'CS102', name: 'Data Structures', description: 'Fundamental data structures', video_count: 12, kuppi_count: 5 },
        { id: 3, code: 'CS103', name: 'Algorithms', description: 'Algorithm design and analysis', video_count: 18, kuppi_count: 12 },
        { id: 4, code: 'MATH101', name: 'Calculus I', description: 'Differential calculus', video_count: 20, kuppi_count: 6 },
        { id: 5, code: 'CS201', name: 'Advanced Programming', description: 'Advanced programming techniques', video_count: 14, kuppi_count: 9 },
        { id: 6, code: 'CS202', name: 'Database Systems', description: 'Database design and management', video_count: 16, kuppi_count: 7 }
      ];
      
      setModules(mockModules);
    } catch (err) {
      console.error('Failed to load modules');
    }
  };

  const handleSemesterSelect = (semesterId: number) => {
    setSelectedSemester(semesterId.toString());
    fetchModules(semesterId);
    setShowModules(true);
  };

  const handleModuleSelect = (moduleId: number) => {
    router.push(`/module-kuppi?module=${moduleId}&faculty=${selectedFaculty}&department=${selectedDepartment}&semester=${selectedSemester}`);
  };

  const handleBack = () => {
    if (showModules) {
      setShowModules(false);
      setSelectedSemester('');
    } else {
      router.push(`/department?faculty=${selectedFaculty}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading semesters...</div>
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

  if (showModules) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
        <div className="max-w-7xl mx-auto">
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
              <h1 className="text-4xl font-bold text-gray-800">Available Modules</h1>
              <p className="text-gray-600">Select a module to view its kuppi videos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => handleModuleSelect(module.id)}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-indigo-300 text-left"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{module.code}</h3>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">{module.name}</h4>
                  {module.description && (
                    <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>📹 {module.video_count} videos</span>
                  <span>🎯 {module.kuppi_count} kuppi</span>
                </div>

                <div className="mt-4 text-center">
                  <div className="text-indigo-600 font-medium">Click to view kuppi</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-800">Select Semester</h1>
            <p className="text-gray-600">Choose your current semester to view available modules</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {semesters.map((semester) => (
            <button
              key={semester.id}
              onClick={() => handleSemesterSelect(semester.id)}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-orange-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {semester.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Click to select
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
