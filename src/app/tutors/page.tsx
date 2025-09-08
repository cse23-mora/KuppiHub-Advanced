import Image from "next/image";
// import Preloader from "../components/Preloader";

interface Student {
  id: number;
  name: string;
  image_url: string | null;
  linkedin_url: string | null;
  faculty: string;
  department: string;
  video_count: number;
  modules_done: string[];
}

// This is a Server Component by default
export default async function TutorsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tutors`, {
    // fetch at build, not client
    cache: "force-cache", 
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tutors");
  }

  const data = await res.json();
  const students: Student[] = data.students;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {students.map((student) => (
        <div
          key={student.id}
          className="border rounded-lg p-4 shadow hover:shadow-lg transition"
        >
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={student.image_url || "/tutor.png"}
              alt={student.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold text-center">{student.name}</h2>
          <p className="text-center text-gray-600">
            {student.faculty} - {student.department}
          </p>
          <p className="text-center mt-2">
            Done: {student.video_count} Kuppis
          </p>
          {student.modules_done.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-sm">
              {student.modules_done.map((module, idx) => (
                <li key={idx}>{module}</li>
              ))}
            </ul>
          )}
          {student.linkedin_url && (
            <div className="text-center mt-4">
              <a
                href={student.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                LinkedIn
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Optional: fully static (never re-fetch)
export const revalidate = false;
