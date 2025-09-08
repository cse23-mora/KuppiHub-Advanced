'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from "framer-motion";
import BackButton from '../components/BackButton';
import Preloader from '../components/Preloader';

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

  const fetchDepartments = async (faculty_id: number) => {
    try {
      const response = await fetch(`api/departments?faculty_id=${faculty_id}`);
      const data = await response.json();
      setDepartments(data);
      setLoading(false);
    } catch  {
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

  if (loading) return <Preloader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-12">
           <BackButton onClick={handleBack} className="mb-8" />
 
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Select Department
              </span>
            </h1>
            <p className="text-lg font-medium text-gray-700">
              Choose your department to continue
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((department, index) => (
            <motion.div
              key={department.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <button
                onClick={() => handleDepartmentSelect(department.id)}
                className="w-full transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden group p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                    <svg className="w-10 h-10 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {department.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Click to select this department
                  </p>
                  
                  <div className="flex justify-center items-center">
                    <span className="text-blue-600 font-medium group-hover:text-indigo-700 transition-colors duration-300">
                      Select Department →
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