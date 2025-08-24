"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <p className="text-center text-xl font-medium text-gray-700 animate-pulse">Loading modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <p className="text-center text-red-500 text-xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-5xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-800">Available Modules</h1>
            <p className="text-gray-600">Select a module to view its content</p>
          </div>
        </div>

        {modules.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-xl shadow-md border border-gray-200">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Modules Available</h3>
            <p className="mt-1 text-sm text-gray-500">There are no modules available for this selection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer border border-gray-100"
                onClick={() => handleModuleSelect(mod.id)}
              >
                <h2 className="text-xl font-semibold text-gray-800">{mod.module.code} - {mod.module.name}</h2>
                <p className="text-gray-600 mt-2">{mod.module.description}</p>
                <div className="mt-3 text-sm text-gray-500">
                  <p>Faculty: {mod.faculty.name}</p>
                  <p>Department: {mod.department.name}</p>
         
                  <p>Semester: {mod.semester.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
