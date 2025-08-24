"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Module {
  id: number;
  code: string;
  name: string;
  description: string;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    // Fetch modules for this faculty/department/semester
    fetch(`/api/module-assignments?faculty_id=${faculty}&department_id=${department}&semester_id=${semester}`)
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch(() => setError("Failed to load modules"))
      .finally(() => setLoading(false));
  }, [searchParams, router]);

  const handleModuleSelect = (moduleId: number) => {
    router.push(`/module-kuppi/${moduleId}`);
  };

  if (loading) return <p className="text-center text-xl">Loading modules...</p>;
  if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-emerald-100">
      <h1 className="text-3xl font-bold mb-6">Available Modules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer"
            onClick={() => handleModuleSelect(module.id)}
          >
            <h2 className="text-xl font-semibold">{module.code} - {module.name}</h2>
            <p className="text-gray-600">{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
