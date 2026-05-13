// types/index.ts

export type TourStatus = "available" | "limited" | "sold_out";

export interface GalleryImage {
  id: number;
  tour_id: number;
  image_url: string;
  caption: string | null;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
}

export interface Tour {
  id: number;
  title: string;
  image: string;
  date: string;
  displayDate: string;
  price: string;
  reservationPrice: string;
  status: "available" | "limited" | "sold_out";
  month: number;
  year: number;
  description: string | null;
  includes: string[] | null;
  itinerary: string[] | null;
  importantInfo: string[] | null;
  schedule: { location: string; time: string }[] | null;
  cancellationPolicy?: string;
  gallery?: GalleryImage[]; // Imágenes de la galería
  coverImage?: GalleryImage | null; // Imagen de portada específica
}
export interface StudyTrip {
  id: number;
  title: string;
  duration: string;
  description: string;
  price: string;
  image: string;
  tags: string[];
  includes?: {
    transport: string[];
    meals: string[];
    tickets: string[];
    itinerary: string[];
  };
  whatsappMessage?: string;
}

export interface AdminUser {
  username: string;
  password: string;
}