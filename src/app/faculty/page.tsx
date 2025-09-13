import Preloader from "../components/Preloader";

interface Faculty {
  id: number;
  name: string;
}

async function getFaculties(): Promise<Faculty[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/faculties`, {
    next: { revalidate: false }, // no revalidation, static forever
  });

  if (!res.ok) throw new Error("Failed to fetch faculties");
  return res.json();
}

export default async function FacultyPage() {
  let faculties: Faculty[] = [];

  try {
    faculties = await getFaculties();
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Failed to load faculties</div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-blue-50 to-indigo-100 p-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to KuppiHub
          </h1>
          <p className="text-xl text-gray-600">
            Select your faculty to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculties.map((faculty) => (
            <a
              key={faculty.id}
              href={`/department?faculty=${faculty.id}`}
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
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
