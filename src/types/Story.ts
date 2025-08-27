export interface Story {
  id: string;
  couple_names: string;
  page_title: string;
  url_slug: string;
  cover_photo_url: string;
  gallery_photos: string[];
  music_url: string;
  digital_letter: string;
  special_date: string;
  puzzle_photo_url: string;
  puzzle_message: string;
  created_at: string;
}

export interface CreateStoryData {
  couple_names: string;
  page_title: string;
  url_slug: string;
  cover_photo_url: string;
  gallery_photos: string[];
  music_url: string;
  digital_letter: string;
  special_date: string;
  puzzle_photo_url: string;
  puzzle_message: string;
}