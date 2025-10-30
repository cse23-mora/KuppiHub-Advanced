// app/modules/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Preloader from "../components/Preloader";

interface ModuleData {
  module_id: number;
  module: { code: string; name: string; description: string };
  faculty: { name: string };
  department: { name: string };
  semester: { name: string };
  video_count?: number;
}

export default function ModulesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // read query params once per render
  const facultyParam = searchParams?.get("faculty");
  const departmentParam = searchParams?.get("department");
  const semesterParam = searchParams?.get("semester");

  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facultyId, setFacultyId] = useState<string | null>(null);
  const [departmentId, setDepartmentId] = useState<string | null>(null);

  // whether user has enabled auto-redirect (stored in localStorage)
  const [autoRedirectEnabled, setAutoRedirectEnabled] = useState(false);

  // redirect to /faculty if required params missing
  useEffect(() => {
    if (!facultyParam || !departmentParam || !semesterParam) {
      router.push("/faculty");
      return;
    }
    setFacultyId(facultyParam);
    setDepartmentId(departmentParam);

    setLoading(true);
    setError(null);

    fetch(
      `/api/module-assignments?faculty_id=${facultyParam}&department_id=${departmentParam}&semester_id=${semesterParam}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setModules(data))
      .catch(() => setError("Failed to load modules"))
      .finally(() => setLoading(false));
  }, [facultyParam, departmentParam, semesterParam, router]);

  // initialize autoRedirectEnabled from localStorage on client
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("autoRedirectModules") === "true";
    setAutoRedirectEnabled(saved);

    // if it was already enabled, ensure the saved URL points to the current selection
    if (
      saved &&
      facultyParam &&
      departmentParam &&
      semesterParam
    ) {
      localStorage.setItem(
        "lastModuleURL",
        `/modules?faculty=${facultyParam}&department=${departmentParam}&semester=${semesterParam}`
      );
    }
    // only run this on mount / when params change
  }, [facultyParam, departmentParam, semesterParam]);

  // keep saved lastModuleURL updated while auto-redirect is enabled
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      autoRedirectEnabled &&
      facultyParam &&
      departmentParam &&
      semesterParam
    ) {
      localStorage.setItem(
        "lastModuleURL",
        `/modules?faculty=${facultyParam}&department=${departmentParam}&semester=${semesterParam}`
      );
    }
  }, [autoRedirectEnabled, facultyParam, departmentParam, semesterParam]);

  const handleAutoRedirectToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAutoRedirectEnabled(checked);

    if (typeof window === "undefined") return;

    localStorage.setItem("autoRedirectModules", checked ? "true" : "false");

    if (checked) {
      if (facultyParam && departmentParam && semesterParam) {
        localStorage.setItem(
          "lastModuleURL",
          `/modules?faculty=${facultyParam}&department=${departmentParam}&semester=${semesterParam}`
        );
      }
    } else {
      // you can remove lastModuleURL or keep it — here we remove to be explicit
      localStorage.removeItem("lastModuleURL");
    }
  };

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

  if (loading) return <Preloader />;

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
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

            <div>
              <h1 className="text-4xl font-bold mb-1">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Available Modules
                </span>
              </h1>
              <p className="text-lg font-medium text-gray-700">Select a module to view its content</p>
            </div>
          </div>

          {/* Checkbox placed in Modules page as requested */}
     <div className="flex">
  <div className="flex items-center h-5">
    <input
      id="default-selection-checkbox"
      aria-describedby="default-selection-text"
      type="checkbox"
      checked={autoRedirectEnabled}
      onChange={handleAutoRedirectToggle}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
    />
  </div>
  <div className="ms-2 text-sm">
    <label
      htmlFor="default-selection-checkbox"
      className="font-medium text-gray-900"
    >
      Set this selection as my default
    </label>

  </div>
</div>

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
                key={mod.module_id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-50"
                onClick={() => handleModuleSelect(mod.module_id)}
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

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{mod.module.description}</p>

                  <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <p className="flex items-center text-blue-600 font-semibold mt-2">
                {mod.video_count || 0} video{mod.video_count !== 1 ? 's' : ''} available
                  </p>
                    
                  </div>

                  {/* <div className="mt-6 flex justify-end">
                    <span className="text-blue-600 font-medium group-hover:text-indigo-700 transition-colors duration-300 flex items-center">
                      View Module
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div> */}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
