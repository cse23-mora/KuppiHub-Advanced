'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Semester {
  id: number;
  name: string;
}

export default function SemesterPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

useEffect(() => {
  const facultyId = searchParams.get('faculty');
  const departmentId = searchParams.get('department');
  
  if (facultyId && departmentId) {
    setSelectedFaculty(facultyId);
    setSelectedDepartment(departmentId);

    // Convert to numbers and pass to fetchSemesters
    fetchSemesters(Number(facultyId), Number(departmentId));
  } else {
    router.push('/faculty');
  }
}, [searchParams, router]);

  const fetchSemesters = async (faculty_id: number, department_id: number) => {
  try {
    setLoading(true);

    // Fetch from your API
    const response = await fetch(
      `api/semesters?faculty_id=${faculty_id}&department_id=${department_id}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Set the semesters in state
    setSemesters(data);
    setLoading(false);
  } catch (err) {
    console.error(err);
    setError('Failed to load semesters');
    setLoading(false);
  }
};


const handleSemesterSelect = (semesterId: number) => {
  // Navigate to the modules page and pass faculty, department, semester as query params
  router.push(`/modules?faculty=${selectedFaculty}&department=${selectedDepartment}&semester=${semesterId}`);
};


  const handleBack = () => {
    router.push(`/department?faculty=${selectedFaculty}`);
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
