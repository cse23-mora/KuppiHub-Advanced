export interface LinkItem {
  id: string;
  url: string;
}

export interface ModuleSearchResult {
  id: number;
  code: string;
  name: string;
  video_count: number;
}

export interface FormData {
  moduleId: number | null;
  moduleCode: string;
  title: string;
  description: string;
  languageCode: string;
  indexNo: string;
  isKuppi: boolean;
  youtubeLinks: LinkItem[];
  telegramLinks: LinkItem[];
  gdriveLinks: LinkItem[];
  onedriveLinks: LinkItem[];
  materialLinks: LinkItem[];
}

// Generate unique ID
export const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial form state
export const initialFormData: FormData = {
  moduleId: null,
  moduleCode: "",
  title: "",
  description: "",
  languageCode: "si",
  indexNo: "",
  isKuppi: true,
  youtubeLinks: [{ id: generateId(), url: "" }],
  telegramLinks: [],
  gdriveLinks: [],
  onedriveLinks: [],
  materialLinks: [],
};

export type LinkCategory = "youtubeLinks" | "telegramLinks" | "gdriveLinks" | "onedriveLinks" | "materialLinks";
