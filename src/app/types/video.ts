// types/video.ts
export interface Video {
  id: number;
  title: string;
youtube_links: string[];
  telegram_links?: string[];
  material_urls?: string[];
  is_kuppi?: boolean;
  description?: string;
  language_code?: string;
  created_at?: string;
  owner?: {
    name: string;
    department: {
      name: string;
    };
  };
}