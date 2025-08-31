'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from "framer-motion";
import Preloader from '../components/Preloader';
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
      fetchSemesters(Number(facultyId), Number(departmentId));
    } else {
      router.push('/faculty');
    }
  }, [searchParams, router]);

  const fetchSemesters = async (faculty_id: number, department_id: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `api/semesters?faculty_id=${faculty_id}&department_id=${department_id}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSemesters(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load semesters');
      setLoading(false);
    }
  };

  const handleSemesterSelect = (semesterId: number) => {
    router.push(`/modules?faculty=${selectedFaculty}&department=${selectedDepartment}&semester=${semesterId}`);
  };

  const handleBack = () => {
    router.push(`/department?faculty=${selectedFaculty}`);
  };

  if (loading) return <Preloader />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-12">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleBack}
            className="mr-6 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Select Semester
              </span>
            </h1>
            <p className="text-lg font-medium text-gray-700">
              Choose your current semester to view available modules
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {semesters.map((semester, index) => (
            <motion.div
              key={semester.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <button
                onClick={() => handleSemesterSelect(semester.id)}
                className="w-full transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden group p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                    <svg className="w-10 h-10 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {semester.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Click to select this semester
                  </p>
                  
                  <div className="flex justify-center items-center">
                    <span className="text-blue-600 font-medium group-hover:text-indigo-700 transition-colors duration-300">
                      Select Semester →
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}