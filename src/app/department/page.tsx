'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Department {
  id: number;
  name: string;
  faculty_id: number;
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const facultyId = searchParams.get('faculty');
    if (facultyId) {
      setSelectedFaculty(facultyId);
      fetchDepartments(parseInt(facultyId));
    } else {
      router.push('/faculty');
    }
  }, [searchParams, router]);

  const fetchDepartments = async (facultyId: number) => {
    try {
      // Mock data - replace with actual Supabase call
      const mockDepartments = {
        1: [ // Engineering
          { id: 1, name: 'Computer Science & Engineering', faculty_id: 1 },
          { id: 2, name: 'Electrical Engineering', faculty_id: 1 },
          { id: 3, name: 'Mechanical Engineering', faculty_id: 1 },
          { id: 4, name: 'Civil Engineering', faculty_id: 1 }
        ],
        2: [ // Science
          { id: 5, name: 'Physics', faculty_id: 2 },
          { id: 6, name: 'Chemistry', faculty_id: 2 },
          { id: 7, name: 'Mathematics', faculty_id: 2 },
          { id: 8, name: 'Biology', faculty_id: 2 }
        ],
        3: [ // Medicine
          { id: 9, name: 'Medicine', faculty_id: 3 },
          { id: 10, name: 'Surgery', faculty_id: 3 },
          { id: 11, name: 'Pediatrics', faculty_id: 3 }
        ],
        4: [ // Arts
          { id: 12, name: 'English Literature', faculty_id: 4 },
          { id: 13, name: 'History', faculty_id: 4 },
          { id: 14, name: 'Philosophy', faculty_id: 4 }
        ],
        5: [ // Business
          { id: 15, name: 'Business Administration', faculty_id: 5 },
          { id: 16, name: 'Accounting', faculty_id: 5 },
          { id: 17, name: 'Marketing', faculty_id: 5 }
        ]
      };
      
      setDepartments(mockDepartments[facultyId as keyof typeof mockDepartments] || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load departments');
      setLoading(false);
    }
  };

  const handleDepartmentSelect = (departmentId: number) => {
    localStorage.setItem('selectedDepartment', departmentId.toString());
    router.push(`/semester?faculty=${selectedFaculty}&department=${departmentId}`);
  };

  const handleBack = () => {
    router.push('/faculty');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading departments...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
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
            <h1 className="text-3xl font-bold text-gray-800">Select Department</h1>
            <p className="text-gray-600">Choose your department to continue</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <button
              key={department.id}
              onClick={() => handleDepartmentSelect(department.id)}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-green-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {department.name}
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
