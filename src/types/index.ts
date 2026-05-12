// types/index.ts

export type TourStatus = "available" | "limited" | "sold_out";

export interface Tour {
  id: number;
  title: string;
  image: string;
  date: string;
  displayDate: string;
  price: string;
  reservationPrice: string;
  status: TourStatus;
  month: number;
  year: number;
  description?: string;
  includes?: string[];
  itinerary?: string[];
  importantInfo?: string[];
  schedule?: { location: string; time: string }[];
  cancellationPolicy?: string;
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