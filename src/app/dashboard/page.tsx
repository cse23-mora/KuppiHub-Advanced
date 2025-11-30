"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderSearch from "../components/HeaderSearch";

interface ModuleData {
  module_id: number;
  module: { code: string; name: string; description: string };
  faculty?: { name: string };
  department?: { name: string };
  semester?: { name: string };
  video_count?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleData[] | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Load modules from localStorage and optionally refresh video counts
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("dashboardModules");
      const parsed: ModuleData[] = raw ? JSON.parse(raw) : [];
      setModules(parsed);

      // Optionally refresh video counts from API
      if (parsed.length > 0) {
        refreshModuleCounts(parsed);
      }
    } catch (err) {
      console.error("Failed to read dashboard modules", err);
      setModules([]);
    }
  }, []);

  // Fetch fresh video counts for dashboard modules
  const refreshModuleCounts = async (currentModules: ModuleData[]) => {
    try {
      const moduleIds = currentModules.map((m) => m.module_id).join(",");
      const res = await fetch(`/api/dashboard-modules?ids=${moduleIds}`);
      if (!res.ok) return;
      const freshData: ModuleData[] = await res.json();

      // Merge fresh data with existing
      const freshMap: Record<number, ModuleData> = {};
      freshData.forEach((m) => (freshMap[m.module_id] = m));

      const updated = currentModules.map((m) =>
        freshMap[m.module_id] ? { ...m, ...freshMap[m.module_id] } : m
      );

      setModules(updated);
      localStorage.setItem("dashboardModules", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to refresh module counts", err);
    }
  };

  const handleModuleClick = (moduleId: number) => {
    if (editMode) return; // Don't navigate in edit mode
    router.push(`/module-kuppi/${moduleId}`);
  };

  const handleRemoveModule = (e: React.MouseEvent, moduleId: number) => {
    e.stopPropagation();
    if (!modules) return;

    const updated = modules.filter((m) => m.module_id !== moduleId);
    setModules(updated);
    localStorage.setItem("dashboardModules", JSON.stringify(updated));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  if (modules === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">My Dashboard</span>
            </h1>
            <p className="text-lg text-gray-700">Modules you've added to your dashboard</p>
          </div>
          <div className="flex items-center space-x-3">
            {modules.length > 0 && (
              <button
                onClick={toggleEditMode}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                  editMode
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {editMode ? 'Done' : 'Edit'}
              </button>
            )}
            <HeaderSearch />
          </div>
        </div>

        {modules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-6 bg-white rounded-2xl shadow-lg border border-blue-100"
          >
            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-xl font-semibold text-gray-800">No modules in your dashboard</h3>
            <p className="mt-1 text-gray-600">Add modules from the modules list to see them here.</p>
           
                
      
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((m, i) => (
              <motion.div
                key={m.module_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleModuleClick(m.module_id)}
                className={`bg-white rounded-2xl shadow-md p-6 border cursor-pointer hover:shadow-xl transition-all duration-300 group ${
                  editMode ? 'border-red-200 hover:scale-100' : 'border-blue-50 hover:scale-105'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                    editMode 
                      ? 'bg-red-50' 
                      : 'bg-gradient-to-r from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200'
                  }`}>
                    <svg className={`w-7 h-7 ${editMode ? 'text-red-500' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  {editMode && (
                    <button
                      onClick={(e) => handleRemoveModule(e, m.module_id)}
                      className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all"
                      title="Remove from dashboard"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <h2 className={`text-xl font-semibold mb-2 transition-colors ${
                  editMode ? 'text-gray-800' : 'text-gray-800 group-hover:text-blue-600'
                }`}>{m.module.code} - {m.module.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{m.module.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold text-blue-600">{m.video_count || 0}</span> video{m.video_count !== 1 ? 's' : ''}
                  </div>
                  {!editMode && (
                    <span className="text-blue-600 text-sm font-medium group-hover:text-indigo-700 flex items-center">
                      View
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                  {editMode && (
                    <span className="text-red-500 text-sm font-medium">Click X to remove</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
