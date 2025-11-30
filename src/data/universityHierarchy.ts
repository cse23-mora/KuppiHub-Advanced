// Hierarchy Data for Faculty/Department/Semester Structure
// This data can be stored in Firebase Firestore or used as static JSON
// The structure supports faculties with or without departments

export interface ModuleInfo {
  code: string;
  name: string;
}

export interface SemesterData {
  id: string;
  name: string;
  number: number;
  modules: ModuleInfo[];
}

export interface DepartmentData {
  id: string;
  name: string;
  semesters: SemesterData[];
}

export interface FacultyData {
  id: string;
  name: string;
  hasDepartments: boolean;
  departments?: DepartmentData[];
  semesters?: SemesterData[]; // For faculties without departments (like Medicine)
}

// Complete university hierarchy data
export const universityData: FacultyData[] = [
  {
    id: 'engineering',
    name: 'Faculty of Engineering',
    hasDepartments: true,
    departments: [
      {
        id: 'mpr',
        name: 'MPR (Common - Semester 1)',
        semesters: [
          {
            id: 'sem1',
            name: 'Semester 1',
            number: 1,
            modules: [
              { code: 'MA1014', name: 'Mathematics' },
              { code: 'CS1033', name: 'Programming Fundamentals' },
              { code: 'EE1040', name: 'Electrical Fundamentals' },
              { code: 'CE1023', name: 'Fluid Mechanics' },
              { code: 'ME1033', name: 'Mechanics' },
              { code: 'MT1023', name: 'Properties of Materials' },
            ],
          },
        ],
      },
      {
        id: 'cse',
        name: 'Computer Science & Engineering',
        semesters: [
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'EL1030', name: 'Language Skills Enhancement' },
              { code: 'MA1024', name: 'Methods of Mathematics' },
              { code: 'EE2094', name: 'Theory of Electricity' },
              { code: 'CS2023', name: 'Data Structures and Algorithms' },
              { code: 'CS1040', name: 'Program Construction' },
              { code: 'CS1050', name: 'Computer Organization and Digital Design' },
            ],
          },
          {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            modules: [
              { code: 'CS2953', name: 'Communication Skills' },
              { code: 'ME1823', name: 'Fundamentals of Engineering Thermodynamics' },
              { code: 'MA2014', name: 'Differential Equations' },
              { code: 'MA3014', name: 'Applied Statistics' },
              { code: 'CS2033', name: 'Data Communication and Networking' },
              { code: 'CS2043', name: 'Operating Systems' },
              { code: 'CS2053', name: 'Computer Architecture' },
              { code: 'CS3043', name: 'Database Systems' },
              { code: 'CS3613', name: 'Introduction to Artificial Intelligence' },
            ],
          },
          {
            id: 'sem4',
            name: 'Semester 4',
            number: 4,
            modules: [
              { code: 'MA2034', name: 'Linear Algebra' },
              { code: 'MA2054', name: 'Graph Theory' },
              { code: 'CS3023', name: 'Software Engineering' },
              { code: 'CS3063', name: 'Theory of Computing' },
              { code: 'CS3243', name: 'IoT Devices and Applications' },
              { code: 'CS3513', name: 'Programming Languages' },
              { code: 'CS3111', name: 'Introduction to Machine Learning' },
              { code: 'CS3121', name: 'Introduction to Data Science' },
            ],
          },
          {
            id: 'sem5',
            name: 'Semester 5',
            number: 5,
            modules: [
              { code: 'MA2024', name: 'Calculus' },
              { code: 'MA3024', name: 'Numerical Methods' },
              { code: 'MA3030', name: 'Operational Research' },
              { code: 'MN3043', name: 'Business Economics and Financial Accounting' },
              { code: 'CS3631', name: 'Deep Neural Networks' },
              { code: 'CS3621', name: 'Data Mining' },
              { code: 'CS3501', name: 'Data Science and Engineering Project' },
            ],
          },
        ],
      },
      {
        id: 'ent',
        name: 'Electronic & Telecommunication',
        semesters: [
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'EL1030', name: 'Language Skills Enhancement' },
              { code: 'MA1024', name: 'Methods of Mathematics' },
              { code: 'EN1014', name: 'Electronic Engineering' },
              { code: 'EN1054', name: 'Introduction to Telecommunications Engineering' },
              { code: 'EN1020', name: 'Circuits, Signals, and Systems' },
              { code: 'EN1094', name: 'Laboratory Practice' },
              { code: 'EN1971', name: 'Communication Skills' },
              { code: 'EN1190', name: 'Engineering Design Project' },
            ],
          },
          {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            modules: [
              { code: 'MA2014', name: 'Differential Equations' },
              { code: 'MA2024', name: 'Calculus' },
              { code: 'MA3024', name: 'Numerical Methods' },
              { code: 'EN2014', name: 'Electronic Circuits and Analysis' },
              { code: 'EN2031', name: 'Fundamentals of Computer Organization and Design' },
              { code: 'EN2063', name: 'Signals and Systems' },
              { code: 'EN2091', name: 'Laboratory Practice and Projects' },
              { code: 'EN2130', name: 'Communication Design Project' },
              { code: 'EN2054', name: 'Communication Systems and Networks' },
            ],
          },
        ],
      },
      {
        id: 'electrical',
        name: 'Electrical Engineering',
        semesters: [
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'EL1030', name: 'Language Skills Enhancement' },
              { code: 'MA1024', name: 'Methods of Mathematics' },
              { code: 'EE2094', name: 'Theory of Electricity' },
              { code: 'EN1803', name: 'Basic Electronics for Engineering Applications' },
              { code: 'CS2843', name: 'Computer Systems' },
              { code: 'ME1803', name: 'Introduction to Manufacturing Processes' },
              { code: 'EE3954', name: 'Communication and Presentation Skills' },
            ],
          },
          {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            modules: [
              { code: 'ME1823', name: 'Fundamentals of Engineering Thermodynamics' },
              { code: 'MA2014', name: 'Differential Equations' },
              { code: 'MA2024', name: 'Calculus' },
              { code: 'EE2100', name: 'Circuits and Fields' },
              { code: 'EE3024', name: 'Digital Signal Processing' },
              { code: 'EE3204', name: 'Engineering Systems Design' },
              { code: 'EE2034', name: 'Power Systems I' },
              { code: 'CE1823', name: 'Aspects of Civil Engineering' },
            ],
          },
        ],
      },
      {
        id: 'mechanical',
        name: 'Mechanical Engineering',
        semesters: [
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'EL1030', name: 'Language Skills Enhancement' },
              { code: 'MA1024', name: 'Methods of Mathematics' },
            ],
          },
        ],
      },
      {
        id: 'civil',
        name: 'Civil Engineering',
        semesters: [
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'EL1030', name: 'Language Skills Enhancement' },
              { code: 'MA1024', name: 'Methods of Mathematics' },
              { code: 'CE1113', name: 'Structural Mechanics I' },
              { code: 'CE1123', name: 'Fluid Dynamics' },
              { code: 'CE1133', name: 'Building Construction and Materials' },
              { code: 'CE1210', name: 'Computing for Civil Engineering' },
              { code: 'CE2261', name: 'Building Design Process & Applications' },
            ],
          },
          {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            modules: [
              { code: 'CE1140', name: 'Introduction to Conceptual Design' },
              { code: 'MA2014', name: 'Differential Equations' },
              { code: 'MA2024', name: 'Calculus' },
              { code: 'CE2014', name: 'Structural Mechanics II' },
              { code: 'CE2023', name: 'Design of Steel Structures' },
              { code: 'CE2033', name: 'Hydraulic Engineering' },
              { code: 'CE2043', name: 'Soil Mechanics & Geology I' },
              { code: 'CE2053', name: 'Construction Planning & Cost Estimating' },
              { code: 'CE2063', name: 'Surveying I' },
            ],
          },
        ],
      },
      {
        id: 'chemical',
        name: 'Chemical & Process Engineering',
        semesters: [
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'CH1051', name: 'Engineering Thermodynamics' },
              { code: 'CH1044', name: 'Fluid Dynamics' },
              { code: 'CH1071', name: 'Chemistry and Green Chemistry for Process Engineers' },
              { code: 'CH1061', name: 'Chemical and Bioprocess Engineering Principles' },
              { code: 'MA1024', name: 'Methods of Mathematics' },
              { code: 'EL1030', name: 'Language Skills Enhancement' },
            ],
          },
          {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            modules: [
              { code: 'CH2631', name: 'Chemical Thermodynamics' },
              { code: 'CH2015', name: 'Heat and Mass Transfer' },
              { code: 'CH2160', name: 'Bioprocess Engineering and Practices' },
              { code: 'CH2170', name: 'Laboratory Practices I' },
              { code: 'MA2034', name: 'Linear Algebra' },
              { code: 'MA2014', name: 'Differential Equations' },
              { code: 'EN1803', name: 'Basic Electronics for Engineering Applications' },
            ],
          },
        ],
      },
      {
        id: 'materials',
        name: 'Materials Science & Engineering',
        semesters: [
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'CS2813', name: 'Visual Programming' },
              { code: 'EL1030', name: 'Language Skills Enhancement' },
              { code: 'EN1803', name: 'Basic Electronics for Engineering Applications' },
              { code: 'MA1024', name: 'Methods of Mathematics' },
              { code: 'ME1091', name: 'Engineering Drawing & Computer Aided Modelling' },
              { code: 'MT1070', name: 'Thermodynamics and Phase Equilibria' },
              { code: 'MT1080', name: 'Fundamentals of Materials Science and Engineering' },
              { code: 'MT1940', name: 'Fundamentals of Engineering Design and Workshop Practice' },
            ],
          },
          {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            modules: [
              { code: 'EE2804', name: 'Applied Electricity' },
              { code: 'MA2014', name: 'Differential Equations' },
              { code: 'MA2024', name: 'Calculus' },
              { code: 'MA3024', name: 'Numerical Methods' },
              { code: 'MT2021', name: 'Polymer Science and Technology' },
              { code: 'MT2053', name: 'Communication Skills' },
              { code: 'MT2211', name: 'Mechanical Behaviour of Materials' },
              { code: 'MT2220', name: 'Ferrous Metals and Alloys' },
            ],
          },
        ],
      },
      {
        id: 'earth',
        name: 'Earth Resources Engineering',
        semesters: [
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'EL1030', name: 'Language Skills Enhancement' },
              { code: 'MA1024', name: 'Methods of Mathematics' },
              { code: 'ER1014', name: 'Geology' },
              { code: 'ER1040', name: 'Introduction to Mining & Mineral Engineering' },
              { code: 'ER1050', name: 'Basic Mine Thermodynamics' },
              { code: 'ME1091', name: 'Engineering Drawing & Computer Aided Modelling' },
              { code: 'ER1902', name: 'Introduction to Engineering Design & Workshop Technology' },
            ],
          },
          {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            modules: [
              { code: 'CS2813', name: 'Visual Programming' },
              { code: 'ER2631', name: 'Elementary Gemmology' },
              { code: 'MA2014', name: 'Differential Equations' },
              { code: 'MA2024', name: 'Calculus' },
              { code: 'CE2063', name: 'Surveying I' },
              { code: 'ER2110', name: 'Rock Blasting and Explosives Engineering' },
              { code: 'ER2420', name: 'Introduction to Ocean Resources Engineering' },
              { code: 'ER2034', name: 'Principles of RS and GIS' },
              { code: 'ER2054', name: 'Introduction to Petroleum Engineering' },
              { code: 'CE1813', name: 'Mechanics of Materials' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'medicine',
    name: 'Faculty of Medicine',
    hasDepartments: false,
    semesters: [
      {
        id: 'year1-term1',
        name: 'Year 1 - Term 1',
        number: 1,
        modules: [
          { code: 'MD1010', name: 'Foundation' },
          { code: 'MD1120', name: 'Blood and Immunology' },
        ],
      },
      {
        id: 'year1-term2',
        name: 'Year 1 - Term 2',
        number: 2,
        modules: [
          { code: 'MD1130', name: 'Cardiovascular' },
          { code: 'MD1140', name: 'Respiratory' },
          { code: 'MD1150', name: 'Gastrointestinal' },
          { code: 'MD1160', name: 'Endocrine, Metabolism & Nutrition' },
        ],
      },
      {
        id: 'year2-term1',
        name: 'Year 2 - Term 1',
        number: 3,
        modules: [
          { code: 'MD2170', name: 'BSS Reproductive' },
          { code: 'MD2180', name: 'Renal' },
          { code: 'MD2190', name: 'Locomotor' },
          { code: 'MD2210', name: 'Neuroscience' },
        ],
      },
      {
        id: 'year3-term1',
        name: 'Year 3 - Term 1',
        number: 5,
        modules: [
          { code: 'MD3310', name: 'Introductory' },
          { code: 'MD3320', name: 'Infectious Diseases' },
          { code: 'MD3330', name: 'Cardiovascular' },
          { code: 'MD3340', name: 'Respiratory' },
          { code: 'MD3350', name: 'Mental Health' },
          { code: 'MD3360', name: 'Medio-legal & toxicology' },
          { code: 'MD3370', name: 'Growth, development & nutrition' },
        ],
      },
      {
        id: 'year4-term1',
        name: 'Year 4 - Term 1',
        number: 7,
        modules: [
          { code: 'MD4380', name: 'Blood, lymph & immunology' },
          { code: 'MD4390', name: 'Trauma' },
          { code: 'MD4410', name: 'Endocrine & Metabolism' },
          { code: 'MD4420', name: 'ASS Reproductive' },
          { code: 'MD4430', name: 'Gastrointestinal' },
          { code: 'MD4440', name: 'Neurology & Musculoskeletal' },
        ],
      },
    ],
  },
  {
    id: 'it',
    name: 'Faculty of Information Technology',
    hasDepartments: false,
    semesters: [
      {
        id: 'sem1',
        name: 'Semester 1',
        number: 1,
        modules: [
          { code: 'IT1010', name: 'Introduction to Programming' },
          { code: 'IT1020', name: 'Computer Fundamentals' },
        ],
      },
      {
        id: 'sem2',
        name: 'Semester 2',
        number: 2,
        modules: [
          { code: 'IT1030', name: 'Object Oriented Programming' },
          { code: 'IT1040', name: 'Database Management' },
        ],
      },
    ],
  },
  {
    id: 'business',
    name: 'Faculty of Business',
    hasDepartments: false,
    semesters: [
      {
        id: 'sem1',
        name: 'Semester 1',
        number: 1,
        modules: [
          { code: 'BM1010', name: 'Principles of Management' },
          { code: 'BM1020', name: 'Financial Accounting' },
        ],
      },
      {
        id: 'sem2',
        name: 'Semester 2',
        number: 2,
        modules: [
          { code: 'BM1030', name: 'Marketing Management' },
          { code: 'BM1040', name: 'Business Statistics' },
        ],
      },
    ],
  },
  {
    id: 'architecture',
    name: 'Faculty of Architecture',
    hasDepartments: true,
    departments: [
      {
        id: 'barch',
        name: 'B.Sc. Architecture',
        semesters: [
          {
            id: 'sem1',
            name: 'Semester 1',
            number: 1,
            modules: [
              { code: 'AR1011', name: 'Design Fundamentals I' },
              { code: 'AR1021', name: 'Architectural Drawing I' },
              { code: 'AR1031', name: 'History of Architecture I' },
              { code: 'AR1041', name: 'Building Construction I' },
              { code: 'AR1051', name: 'Environmental Studies' },
            ],
          },
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'AR1012', name: 'Design Fundamentals II' },
              { code: 'AR1022', name: 'Architectural Drawing II' },
              { code: 'AR1032', name: 'History of Architecture II' },
              { code: 'AR1042', name: 'Building Construction II' },
              { code: 'AR1052', name: 'Structural Mechanics' },
            ],
          },
          {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            modules: [
              { code: 'AR2013', name: 'Architectural Design I' },
              { code: 'AR2023', name: 'Building Services I' },
              { code: 'AR2033', name: 'Theory of Architecture I' },
              { code: 'AR2043', name: 'Building Materials' },
            ],
          },
          {
            id: 'sem4',
            name: 'Semester 4',
            number: 4,
            modules: [
              { code: 'AR2014', name: 'Architectural Design II' },
              { code: 'AR2024', name: 'Building Services II' },
              { code: 'AR2034', name: 'Theory of Architecture II' },
              { code: 'AR2044', name: 'Urban Design Fundamentals' },
            ],
          },
          {
            id: 'sem5',
            name: 'Semester 5',
            number: 5,
            modules: [
              { code: 'AR3015', name: 'Architectural Design III' },
              { code: 'AR3025', name: 'Construction Technology' },
              { code: 'AR3035', name: 'Landscape Architecture' },
              { code: 'AR3045', name: 'Professional Practice I' },
            ],
          },
          {
            id: 'sem6',
            name: 'Semester 6',
            number: 6,
            modules: [
              { code: 'AR3016', name: 'Architectural Design IV' },
              { code: 'AR3026', name: 'Interior Design' },
              { code: 'AR3036', name: 'Urban Planning' },
              { code: 'AR3046', name: 'Professional Practice II' },
            ],
          },
        ],
      },
      {
        id: 'bqe',
        name: 'B.Sc. Quantity Surveying',
        semesters: [
          {
            id: 'sem1',
            name: 'Semester 1',
            number: 1,
            modules: [
              { code: 'QS1011', name: 'Introduction to Quantity Surveying' },
              { code: 'QS1021', name: 'Construction Technology I' },
              { code: 'QS1031', name: 'Measurement I' },
              { code: 'QS1041', name: 'Mathematics for QS' },
            ],
          },
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'QS1012', name: 'Cost Studies I' },
              { code: 'QS1022', name: 'Construction Technology II' },
              { code: 'QS1032', name: 'Measurement II' },
              { code: 'QS1042', name: 'Contract Law' },
            ],
          },
          {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            modules: [
              { code: 'QS2013', name: 'Cost Studies II' },
              { code: 'QS2023', name: 'Construction Economics' },
              { code: 'QS2033', name: 'Building Services' },
              { code: 'QS2043', name: 'Project Management I' },
            ],
          },
          {
            id: 'sem4',
            name: 'Semester 4',
            number: 4,
            modules: [
              { code: 'QS2014', name: 'Cost Planning' },
              { code: 'QS2024', name: 'Contract Administration' },
              { code: 'QS2034', name: 'Structural Systems' },
              { code: 'QS2044', name: 'Project Management II' },
            ],
          },
        ],
      },
      {
        id: 'btp',
        name: 'B.Sc. Town & Country Planning',
        semesters: [
          {
            id: 'sem1',
            name: 'Semester 1',
            number: 1,
            modules: [
              { code: 'TP1011', name: 'Introduction to Planning' },
              { code: 'TP1021', name: 'Planning Graphics' },
              { code: 'TP1031', name: 'Geography for Planners' },
              { code: 'TP1041', name: 'Statistics for Planning' },
            ],
          },
          {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            modules: [
              { code: 'TP1012', name: 'Planning Theory I' },
              { code: 'TP1022', name: 'Land Use Planning' },
              { code: 'TP1032', name: 'Environmental Planning' },
              { code: 'TP1042', name: 'GIS for Planners' },
            ],
          },
          {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            modules: [
              { code: 'TP2013', name: 'Urban Planning Studio I' },
              { code: 'TP2023', name: 'Transportation Planning' },
              { code: 'TP2033', name: 'Planning Law' },
              { code: 'TP2043', name: 'Housing Studies' },
            ],
          },
          {
            id: 'sem4',
            name: 'Semester 4',
            number: 4,
            modules: [
              { code: 'TP2014', name: 'Urban Planning Studio II' },
              { code: 'TP2024', name: 'Regional Planning' },
              { code: 'TP2034', name: 'Infrastructure Planning' },
              { code: 'TP2044', name: 'Planning Practice' },
            ],
          },
        ],
      },
    ],
  },
];

// Helper functions
export const getFacultyById = (facultyId: string): FacultyData | undefined => {
  return universityData.find(f => f.id === facultyId);
};

export const getDepartmentById = (facultyId: string, departmentId: string): DepartmentData | undefined => {
  const faculty = getFacultyById(facultyId);
  return faculty?.departments?.find(d => d.id === departmentId);
};

export const getSemesterById = (
  facultyId: string, 
  semesterId: string, 
  departmentId?: string
): SemesterData | undefined => {
  const faculty = getFacultyById(facultyId);
  if (!faculty) return undefined;
  
  if (faculty.hasDepartments && departmentId) {
    const department = getDepartmentById(facultyId, departmentId);
    return department?.semesters?.find(s => s.id === semesterId);
  } else {
    return faculty.semesters?.find(s => s.id === semesterId);
  }
};

export const getModulesForPath = (
  facultyId: string,
  semesterId: string,
  departmentId?: string
): ModuleInfo[] => {
  const semester = getSemesterById(facultyId, semesterId, departmentId);
  return semester?.modules || [];
};

export default universityData;
