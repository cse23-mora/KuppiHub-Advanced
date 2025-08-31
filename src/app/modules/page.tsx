"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

interface ModuleData {
  id: number;
  module: {
    code: string;
    name: string;
    description: string;
  };
  faculty: {
    name: string;
  };
  department: {
    name: string;
  };
  semester: {
    name: string;
  };
}

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facultyId, setFacultyId] = useState<string | null>(null);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const faculty = searchParams.get("faculty");
    const department = searchParams.get("department");
    const semester = searchParams.get("semester");

    if (!faculty || !department || !semester) {
      router.push("/faculty");
      return;
    }

    setFacultyId(faculty);
    setDepartmentId(department);

    fetch(`/api/module-assignments?faculty_id=${faculty}&department_id=${department}&semester_id=${semester}`)
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch(() => setError("Failed to load modules"))
      .finally(() => setLoading(false));
  }, [searchParams, router]);

  const handleModuleSelect = (moduleId: number) => {
    router.push(`/module-kuppi/${moduleId}`);
  };

  const handleBack = () => {
    if (facultyId && departmentId) {
      router.push(`/semester?faculty=${facultyId}&department=${departmentId}`);
    } else {
      router.push("/faculty");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-center text-xl font-medium text-blue-600 animate-pulse">Loading modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-center text-red-500 text-xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
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
                Available Modules
              </span>
            </h1>
            <p className="text-lg font-medium text-gray-700">
              Select a module to view its content
            </p>
          </motion.div>
        </div>

        {modules.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 px-6 bg-white rounded-2xl shadow-lg border border-blue-100"
          >
            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-2 text-xl font-semibold text-gray-800">No Modules Available</h3>
            <p className="mt-1 text-gray-600">There are no modules available for this selection yet.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((mod, index) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-50"
                onClick={() => handleModuleSelect(mod.id)}
              >
                <div className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                    <svg className="w-7 h-7 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {mod.module.code} - {mod.module.name}
                  </h2>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {mod.module.description}
                  </p>
                  
                  <div className="mt-4 text-xs text-gray-500 space-y-1">
                    <p className="flex items-center">
                      <svg className="w-3 h-3 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Faculty: {mod.faculty.name}
                    </p>
                    
                    <p className="flex items-center">
                      <svg className="w-3 h-3 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Department: {mod.department.name}
                    </p>
                    
                    <p className="flex items-center">
                      <svg className="w-3 h-3 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Semester: {mod.semester.name}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <span className="text-blue-600 font-medium group-hover:text-indigo-700 transition-colors duration-300 flex items-center">
                      View Module
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}