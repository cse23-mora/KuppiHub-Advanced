-- Migration: Create faculty_hierarchy table with JSONB data
-- This stores the entire navigation hierarchy for module selection
-- Date: 2025-12-01

-- Create the hierarchy table
CREATE TABLE IF NOT EXISTS faculty_hierarchy (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_faculty_hierarchy_data ON faculty_hierarchy USING gin(data);

-- Insert the hierarchy data
INSERT INTO faculty_hierarchy (data) VALUES ('{
  "engineering": {
    "name": "Faculty of Engineering",
    "icon": "⚙️",
    "levels": ["Department", "Semester"],
    "children": {
      "cse": {
        "name": "Computer Science & Engineering",
        "children": {
          "s1": { "name": "Semester 1", "modules": [22, 23, 24, 25, 26, 27] },
          "s2": { "name": "Semester 2", "modules": [28, 29, 30, 31, 32, 33] },
          "s3": { "name": "Semester 3", "modules": [34, 35, 36, 37, 38, 39, 40, 41, 42] },
          "s4": { "name": "Semester 4", "modules": [86, 146, 152, 201, 203, 204, 205, 206, 207, 208] },
          "s5": { "name": "Semester 5", "modules": [86, 152, 159, 213, 214, 215, 216] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      },
      "mechanical": {
        "name": "Mechanical Engineering",
        "children": {
          "s1": { "name": "Semester 1", "modules": [22, 23, 24, 25, 26, 27] },
          "s2": { "name": "Semester 2", "modules": [32, 33, 31, 82, 83, 84, 85] },
          "s3": { "name": "Semester 3", "modules": [42, 40, 86, 87, 88, 89, 90, 91] },
          "s4": { "name": "Semester 4", "modules": [] },
          "s5": { "name": "Semester 5", "modules": [] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      },
      "ent": {
        "name": "Electronic & Telecommunication",
        "children": {
          "s1": { "name": "Semester 1", "modules": [22, 23, 24, 25, 26, 27] },
          "s2": { "name": "Semester 2", "modules": [32, 33, 218, 219, 220, 221, 222, 223] },
          "s3": { "name": "Semester 3", "modules": [40, 86, 152, 227, 228, 229, 230, 231, 232] },
          "s4": { "name": "Semester 4", "modules": [] },
          "s5": { "name": "Semester 5", "modules": [] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      },
      "electrical": {
        "name": "Electrical Engineering",
        "children": {
          "s1": { "name": "Semester 1", "modules": [22, 23, 24, 25, 26, 27] },
          "s2": { "name": "Semester 2", "modules": [32, 33, 31, 82, 83, 84, 85] },
          "s3": { "name": "Semester 3", "modules": [42, 40, 86, 87, 88, 89, 90, 91] },
          "s4": { "name": "Semester 4", "modules": [] },
          "s5": { "name": "Semester 5", "modules": [] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      },
      "civil": {
        "name": "Civil Engineering",
        "children": {
          "s1": { "name": "Semester 1", "modules": [22, 23, 24, 25, 26, 27] },
          "s2": { "name": "Semester 2", "modules": [32, 33, 109, 110, 111, 112, 113] },
          "s3": { "name": "Semester 3", "modules": [115, 40, 86, 116, 117, 118, 119, 120, 121] },
          "s4": { "name": "Semester 4", "modules": [] },
          "s5": { "name": "Semester 5", "modules": [] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      },
      "chemical": {
        "name": "Chemical & Process Engineering",
        "children": {
          "s1": { "name": "Semester 1", "modules": [22, 23, 24, 25, 26, 27] },
          "s2": { "name": "Semester 2", "modules": [127, 128, 129, 130, 33, 32] },
          "s3": { "name": "Semester 3", "modules": [142, 143, 144, 145, 40, 146, 83] },
          "s4": { "name": "Semester 4", "modules": [147, 148, 149, 150, 151, 152] },
          "s5": { "name": "Semester 5", "modules": [153, 154, 155, 156, 157, 158, 159] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      },
      "materials": {
        "name": "Materials Science & Engineering",
        "children": {
          "s1": { "name": "Semester 1", "modules": [22, 23, 24, 25, 26, 27] },
          "s2": { "name": "Semester 2", "modules": [175, 32, 83, 33, 164, 186, 187, 188] },
          "s3": { "name": "Semester 3", "modules": [195, 40, 86, 152, 196, 197, 198, 199] },
          "s4": { "name": "Semester 4", "modules": [] },
          "s5": { "name": "Semester 5", "modules": [] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      },
      "earth": {
        "name": "Earth Resources Engineering",
        "children": {
          "s1": { "name": "Semester 1", "modules": [22, 23, 24, 25, 26, 27] },
          "s2": { "name": "Semester 2", "modules": [32, 33, 161, 162, 163, 164, 165] },
          "s3": { "name": "Semester 3", "modules": [175, 176, 40, 86, 121, 177, 178, 179, 180, 181] },
          "s4": { "name": "Semester 4", "modules": [] },
          "s5": { "name": "Semester 5", "modules": [] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      },
      "textile": {
        "name": "Textile & Apparel Engineering",
        "children": {
          "s1": { "name": "Semester 1", "modules": [] },
          "s2": { "name": "Semester 2", "modules": [] },
          "s3": { "name": "Semester 3", "modules": [] },
          "s4": { "name": "Semester 4", "modules": [] },
          "s5": { "name": "Semester 5", "modules": [] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      },
      "transport": {
        "name": "Transport & Logistics Management",
        "children": {
          "s1": { "name": "Semester 1", "modules": [] },
          "s2": { "name": "Semester 2", "modules": [] },
          "s3": { "name": "Semester 3", "modules": [] },
          "s4": { "name": "Semester 4", "modules": [] },
          "s5": { "name": "Semester 5", "modules": [] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      }
    }
  },
  "medicine": {
    "name": "Faculty of Medicine",
    "icon": "🏥",
    "levels": ["Year", "Term"],
    "children": {
      "y1": {
        "name": "Year 1",
        "children": {
          "t1": { "name": "Term 1", "modules": [43, 44, 45, 46, 47, 48] },
          "t2": { "name": "Term 2", "modules": [] },
          "t3": { "name": "Term 3", "modules": [] }
        }
      },
      "y2": {
        "name": "Year 2",
        "children": {
          "t1": { "name": "Term 1", "modules": [49, 50, 51, 52] },
          "t2": { "name": "Term 2", "modules": [] },
          "t3": { "name": "Term 3", "modules": [] }
        }
      },
      "y3": {
        "name": "Year 3",
        "children": {
          "t1": { "name": "Term 1", "modules": [53, 54, 55, 56, 57, 58, 59] },
          "t2": { "name": "Term 2", "modules": [] },
          "t3": { "name": "Term 3", "modules": [] }
        }
      },
      "y4": {
        "name": "Year 4",
        "children": {
          "t1": { "name": "Term 1", "modules": [60, 61, 62, 63, 64, 65] },
          "t2": { "name": "Term 2", "modules": [] },
          "t3": { "name": "Term 3", "modules": [] }
        }
      },
      "y5": {
        "name": "Year 5",
        "children": {
          "t1": { "name": "Term 1", "modules": [] },
          "t2": { "name": "Term 2", "modules": [] },
          "t3": { "name": "Term 3", "modules": [] }
        }
      }
    }
  },
  "architecture": {
    "name": "Faculty of Architecture",
    "icon": "🏛️",
    "levels": ["Course", "Semester"],
    "children": {
      "bsc-arch": {
        "name": "B.Sc. Architecture",
        "children": {
          "s1": { "name": "Semester 1", "modules": [] },
          "s2": { "name": "Semester 2", "modules": [] },
          "s3": { "name": "Semester 3", "modules": [] },
          "s4": { "name": "Semester 4", "modules": [] },
          "s5": { "name": "Semester 5", "modules": [] },
          "s6": { "name": "Semester 6", "modules": [] }
        }
      },
      "bsc-qsv": {
        "name": "B.Sc. Quantity Surveying",
        "children": {
          "s1": { "name": "Semester 1", "modules": [] },
          "s2": { "name": "Semester 2", "modules": [] },
          "s3": { "name": "Semester 3", "modules": [] },
          "s4": { "name": "Semester 4", "modules": [] }
        }
      },
      "bsc-tp": {
        "name": "B.Sc. Town Planning",
        "children": {
          "s1": { "name": "Semester 1", "modules": [] },
          "s2": { "name": "Semester 2", "modules": [] },
          "s3": { "name": "Semester 3", "modules": [] },
          "s4": { "name": "Semester 4", "modules": [] }
        }
      }
    }
  },
  "it": {
    "name": "Faculty of Information Technology",
    "icon": "💻",
    "levels": ["Program", "Semester"],
    "children": {
      "bsc-it": {
        "name": "B.Sc. Information Technology",
        "children": {
          "s1": { "name": "Semester 1", "modules": [] },
          "s2": { "name": "Semester 2", "modules": [] },
          "s3": { "name": "Semester 3", "modules": [] },
          "s4": { "name": "Semester 4", "modules": [] },
          "s5": { "name": "Semester 5", "modules": [] },
          "s6": { "name": "Semester 6", "modules": [] },
          "s7": { "name": "Semester 7", "modules": [] },
          "s8": { "name": "Semester 8", "modules": [] }
        }
      }
    }
  },
  "business": {
    "name": "Faculty of Business",
    "icon": "📊",
    "levels": ["Department", "Semester"],
    "children": {
      "management": {
        "name": "Management Studies",
        "children": {
          "s1": { "name": "Semester 1", "modules": [] },
          "s2": { "name": "Semester 2", "modules": [] },
          "s3": { "name": "Semester 3", "modules": [] },
          "s4": { "name": "Semester 4", "modules": [] }
        }
      },
      "accounting": {
        "name": "Accounting",
        "children": {
          "s1": { "name": "Semester 1", "modules": [] },
          "s2": { "name": "Semester 2", "modules": [] },
          "s3": { "name": "Semester 3", "modules": [] },
          "s4": { "name": "Semester 4", "modules": [] }
        }
      }
    }
  },
  "science": {
    "name": "Faculty of Science",
    "icon": "🔬",
    "levels": ["Department", "Year"],
    "children": {
      "physics": {
        "name": "Physics",
        "children": {
          "y1": { "name": "Year 1", "modules": [] },
          "y2": { "name": "Year 2", "modules": [] },
          "y3": { "name": "Year 3", "modules": [] },
          "y4": { "name": "Year 4", "modules": [] }
        }
      },
      "chemistry": {
        "name": "Chemistry",
        "children": {
          "y1": { "name": "Year 1", "modules": [] },
          "y2": { "name": "Year 2", "modules": [] },
          "y3": { "name": "Year 3", "modules": [] },
          "y4": { "name": "Year 4", "modules": [] }
        }
      },
      "maths": {
        "name": "Mathematics",
        "children": {
          "y1": { "name": "Year 1", "modules": [] },
          "y2": { "name": "Year 2", "modules": [] },
          "y3": { "name": "Year 3", "modules": [] },
          "y4": { "name": "Year 4", "modules": [] }
        }
      }
    }
  }
}'::jsonb);

-- Comment
COMMENT ON TABLE faculty_hierarchy IS 'Stores the complete faculty hierarchy as JSONB for module selection navigation';
