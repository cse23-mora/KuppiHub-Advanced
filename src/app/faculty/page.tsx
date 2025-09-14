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
        {/* <p className="text-xl text-gray-600 mb-6">
          Select your faculty to get started
        </p> */}

        {/* New description */}
        <p className="hidden sm:block text-md text-gray-700 max-w-2xl mx-auto ">
          KuppiHub is Sri Lanka’s No. 1 <span className="font-semibold">free & open-source </span> 
          education platform built for all students of the University of Moratuwa. 
          Learn, share, and grow together with <span className="font-semibold">100% free resources</span> and kuppi sessions.
        </p>
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
  <h2 className="text-2xl font-bold text-gray-800 mb-4">
    Why Choose KuppiHub?
  </h2>
  <p className="text-md text-gray-700 leading-relaxed">
    <strong>KuppiHub</strong> is Sri Lanka’s <strong>No. 1 free and open-source education platform</strong> 
    built exclusively for <strong>University of Moratuwa (UoM)</strong> students. 
    It is more than just a website — it’s a <strong>student-powered hub for free learning, collaboration, and academic support</strong>. 
    From <strong>kuppi sessions</strong> to <strong>past papers, lecture notes, tutorials, and study resources</strong>, 
    everything you need is gathered here in one place.
  </p>

  <p className="text-md text-gray-700 mt-4 leading-relaxed">
    Whether you’re in <strong>Engineering, Architecture, IT, Business, or Design</strong>, 
    KuppiHub helps you <strong>connect with peers, share knowledge, and prepare for exams smarter</strong>. 
    Our open-source platform is built by students, for students — 
    ensuring that every UoM student has <strong>100% free access to quality education</strong>.
  </p>

  <p className="text-md text-gray-700 mt-4 leading-relaxed">
    Join the fastest-growing <strong>online learning community in Sri Lanka</strong>. 
    KuppiHub is trusted by thousands of University of Moratuwa students for 
    <strong>group discussions, subject materials, and kuppi culture</strong>. 
    It’s not just free — it’s <strong>collaborative, open, and designed to help you succeed</strong>.
  </p>

  <p className="text-md text-gray-700 mt-4 leading-relaxed">
    <strong>KuppiHub – Sri Lanka’s free learning platform at UoM.</strong>  
    Open-source, 100% free, and always here to support your academic journey.
  </p>

</div>
</div>

    </div>
  </div>
);

}

