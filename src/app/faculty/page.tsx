'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Preloader from '../components/Preloader';
interface Faculty {
  id: number;
  name: string;
}

export default function FacultyPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      fetch ('./api/faculties', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setFaculties(data);
        setLoading(false);
      })
      // .catch(error => {
      //   setError('Failed to load faculties');
      //   setLoading(false);
      // });
    } catch{
      setError('Failed to load faculties');
      setLoading(false);
    }
  };
     
  const handleFacultySelect = (facultyId: number) => {
    // Store selection in localStorage or state management
    localStorage.setItem('selectedFaculty', facultyId.toString());
    router.push(`/department?faculty=${facultyId}`);
  };

  if (loading) return <Preloader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

return (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-5">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to KuppiHub
        </h1>
                 <p className="text-xl text-gray-600">
            Select your faculty to get started
          </p>

        {/* New description */}
    <h2 className="hidden  text-md text-gray-700 max-w-2xl mx-auto">
   <span className="font-semibold">100% free </span> 
  education platform built for all students of the University of Moratuwa. 
  Learn, share, and grow together with <span className="font-semibold">100% free resources</span> and kuppi sessions.
</h2>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculties.map((faculty) => (
          <button
            key={faculty.id}
            onClick={() => handleFacultySelect(faculty.id)}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {faculty.name}
              </h3>
              <p className="text-sm text-gray-500">Click to select</p>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-16 text-center max-w-3xl mx-auto">


<div className='hidden'>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <a
    href="/department?faculty=1"
    title="All engineering courses, modules, and resources for university students."
    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-300"
  >
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Engineering</h3>
      <p className="text-sm text-gray-500">All engineering courses, modules, and resources for university students.</p>
    </div>
  </a>

  <a
    href="/department?faculty=2"
    title="Medical faculty courses and study resources for aspiring doctors."
    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-300"
  >
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Medicine</h3>
      <p className="text-sm text-gray-500">Medical faculty courses and study resources for aspiring doctors.</p>
    </div>
  </a>

  <a
    href="/department?faculty=3"
    title="Business, management, and commerce modules for university learners."
    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-300"
  >
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Business</h3>
      <p className="text-sm text-gray-500">Business, management, and commerce modules for university learners.</p>
    </div>
  </a>

  <a
    href="/department?faculty=4"
    title="IT and computer science courses with digital resources and notes."
    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-300"
  >
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Information Technology</h3>
      <p className="text-sm text-gray-500">IT and computer science courses with digital resources and notes.</p>
    </div>
  </a>

  <a
    href="/department?faculty=5"
    title="Architecture faculty content including modules, notes, and study guides."
    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-300"
  >
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Architecture</h3>
      <p className="text-sm text-gray-500">Architecture faculty content including modules, notes, and study guides.</p>
    </div>
  </a>

  <a
    href="/department?faculty=7"
    title="Resources and courses for graduate and postgraduate programs."
    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-300"
  >
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Graduate Studies</h3>
      <p className="text-sm text-gray-500">Resources and courses for graduate and postgraduate programs.</p>
    </div>
  </a>
</div>


</div>
</div>

    </div>
  </div>
);

}