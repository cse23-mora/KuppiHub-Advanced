// All modules data - flat structure
// module_code is the unique key

export interface ModuleData {
  module_code: string;
  module_name: string;
}

// All available modules
export const allModules: ModuleData[] = [
  // MPR - Semester 1 (Common)
  { module_code: 'MA1014', module_name: 'Mathematics' },
  { module_code: 'CS1033', module_name: 'Programming Fundamentals' },
  { module_code: 'EE1040', module_name: 'Electrical Fundamentals' },
  { module_code: 'CE1023', module_name: 'Fluid Mechanics' },
  { module_code: 'ME1033', module_name: 'Mechanics' },
  { module_code: 'MT1023', module_name: 'Properties of Materials' },

  // CSE - Semester 2
  { module_code: 'EL1030', module_name: 'Language Skills Enhancement' },
  { module_code: 'MA1024', module_name: 'Methods of Mathematics' },
  { module_code: 'EE2094', module_name: 'Theory of Electricity' },
  { module_code: 'CS2023', module_name: 'Data Structures and Algorithms' },
  { module_code: 'CS1040', module_name: 'Program Construction' },
  { module_code: 'CS1050', module_name: 'Computer Organization and Digital Design' },

  // CSE - Semester 3
  { module_code: 'CS2953', module_name: 'Communication Skills' },
  { module_code: 'ME1823', module_name: 'Fundamentals of Engineering Thermodynamics' },
  { module_code: 'MA2014', module_name: 'Differential Equations' },
  { module_code: 'MA3014', module_name: 'Applied Statistics' },
  { module_code: 'CS2033', module_name: 'Data Communication and Networking' },
  { module_code: 'CS2043', module_name: 'Operating Systems' },
  { module_code: 'CS2053', module_name: 'Computer Architecture' },
  { module_code: 'CS3043', module_name: 'Database Systems' },
  { module_code: 'CS3613', module_name: 'Introduction to Artificial Intelligence' },

  // CSE - Semester 4
  { module_code: 'MA2034', module_name: 'Linear Algebra' },
  { module_code: 'MA2054', module_name: 'Graph Theory' },
  { module_code: 'CS3023', module_name: 'Software Engineering' },
  { module_code: 'CS3063', module_name: 'Theory of Computing' },
  { module_code: 'CS3243', module_name: 'IoT Devices and Applications' },
  { module_code: 'CS3513', module_name: 'Programming Languages' },
  { module_code: 'CS3533', module_name: 'Machine Learning' },
  { module_code: 'CS3033', module_name: 'Network and Web Security' },

  // CSE - Semester 5
  { module_code: 'CS4043', module_name: 'Human-Computer Interaction' },
  { module_code: 'CS4053', module_name: 'Distributed and Cloud Computing' },
  { module_code: 'CS4063', module_name: 'Secure Software Development' },
  { module_code: 'CS4623', module_name: 'Computer Vision' },

  // CSE - Semester 6
  { module_code: 'CS4023', module_name: 'Trends in Computer Science' },
  { module_code: 'CS4633', module_name: 'Natural Language Processing' },
  { module_code: 'CS4643', module_name: 'Data Mining' },
  { module_code: 'EC4583', module_name: 'Computational Imaging and Cameras' },

  // CSE - Semester 7
  { module_code: 'CS4513', module_name: 'Parallel Computing' },
  { module_code: 'CS4713', module_name: 'Computer Graphics' },
  { module_code: 'CS4723', module_name: 'Entrepreneurship in CS' },
  { module_code: 'CS4733', module_name: 'Mobile and Wireless Security' },
  { module_code: 'CS4833', module_name: 'Advanced Software Engineering' },

  // CSE - Semester 8
  { module_code: 'CS5013', module_name: 'Research Project I' },
  { module_code: 'CS5023', module_name: 'Research Project II' },
  { module_code: 'CS5813', module_name: 'Quantum Computing' },

  // EEE Department modules
  { module_code: 'EE2014', module_name: 'Engineering Electromagnetics' },
  { module_code: 'EE2023', module_name: 'Electronic Circuits' },
  { module_code: 'EE2033', module_name: 'Signals and Systems' },
  { module_code: 'EE3013', module_name: 'Power Systems' },
  { module_code: 'EE3023', module_name: 'Control Systems' },
  { module_code: 'EE3033', module_name: 'Digital Signal Processing' },
  { module_code: 'EE3043', module_name: 'Microprocessor Systems' },
  { module_code: 'EE4013', module_name: 'High Voltage Engineering' },
  { module_code: 'EE4023', module_name: 'Power Electronics' },

  // Mechanical Engineering modules
  { module_code: 'ME2013', module_name: 'Thermodynamics II' },
  { module_code: 'ME2023', module_name: 'Fluid Mechanics II' },
  { module_code: 'ME2033', module_name: 'Mechanics of Materials' },
  { module_code: 'ME3013', module_name: 'Heat Transfer' },
  { module_code: 'ME3023', module_name: 'Machine Design' },
  { module_code: 'ME3033', module_name: 'Manufacturing Technology' },
  { module_code: 'ME4013', module_name: 'Automotive Engineering' },
  { module_code: 'ME4023', module_name: 'Robotics' },

  // Civil Engineering modules
  { module_code: 'CE2013', module_name: 'Structural Analysis' },
  { module_code: 'CE2023', module_name: 'Geotechnical Engineering' },
  { module_code: 'CE2033', module_name: 'Hydraulics' },
  { module_code: 'CE3013', module_name: 'Structural Design' },
  { module_code: 'CE3023', module_name: 'Transportation Engineering' },
  { module_code: 'CE3033', module_name: 'Environmental Engineering' },
  { module_code: 'CE4013', module_name: 'Construction Management' },
  { module_code: 'CE4023', module_name: 'Advanced Structural Analysis' },

  // Add more modules as needed...
];

// Helper function to get module by code
export function getModuleByCode(code: string): ModuleData | undefined {
  return allModules.find(m => m.module_code === code);
}

// Helper function to search modules
export function searchModules(query: string): ModuleData[] {
  const lowerQuery = query.toLowerCase();
  return allModules.filter(
    m => m.module_code.toLowerCase().includes(lowerQuery) ||
         m.module_name.toLowerCase().includes(lowerQuery)
  );
}
