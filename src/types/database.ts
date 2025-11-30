// Database types for Supabase tables

export type UserRole = 'student' | 'tutor';

export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  module_code: string;
  module_name: string;
  faculty: string;
  department: string | null;
  semester: string;
  credits: number | null;
  description: string | null;
  created_at: string;
}

export interface Kuppi {
  id: string;
  title: string;
  description: string | null;
  module_code: string;
  tutor_id: string;
  youtube_links: string[];
  telegram_links: string[];
  material_urls: string[];
  thumbnail_url: string | null;
  language: 'sinhala' | 'tamil' | 'english';
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  users?: Pick<User, 'id' | 'display_name' | 'avatar_url'>;
  modules?: Pick<Module, 'module_code' | 'module_name'>;
}

export interface UserModule {
  id: string;
  user_id: string;
  module_code: string;
  faculty: string | null;
  department: string | null;
  semester: string | null;
  created_at: string;
  // Joined data
  modules?: Module;
}

export interface Admin {
  id: string;
  user_id: string;
  is_super_admin: boolean;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ModulesResponse {
  modules: Module[];
}

export interface KuppisResponse {
  kuppis: Kuppi[];
}

export interface UserModulesResponse {
  userModules: UserModule[];
}

export interface UserResponse {
  user: User | null;
}

// Form input types
export interface CreateKuppiInput {
  title: string;
  description?: string;
  moduleCode: string;
  tutorId: string;
  youtubeLinks?: string[];
  telegramLinks?: string[];
  materialUrls?: string[];
  thumbnailUrl?: string;
  language?: 'sinhala' | 'tamil' | 'english';
}

export interface UpdateKuppiInput extends Partial<CreateKuppiInput> {
  id: string;
}

export interface CreateUserInput {
  firebaseUid: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  role?: UserRole;
}

export interface AddUserModulesInput {
  userId: string;
  moduleCodes: string[];
  faculty?: string;
  department?: string;
  semester?: string;
}
