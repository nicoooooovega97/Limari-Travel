// services/storageService.ts
import type { StudyTrip, Tour, GalleryImage } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// 📌 CLAVE ÚNICA para el token en toda la aplicación
const TOKEN_KEY = "token";

// ============ Funciones de Token ============
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  console.log("Token guardado en localStorage");
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  console.log("Token eliminado de localStorage");
}

// ============ Funciones de Autenticación ============
export async function loginAdmin(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error de autenticación");
  }
  
  return response.json();
}

// Headers para peticiones autenticadas
const getAuthHeaders = (isFormData: boolean = false): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
};

// Función genérica para peticiones
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    let errorMessage = "Error en la petición";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

// Petición autenticada JSON
function authRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: getAuthHeaders(false),
  });
}

// ============ Funciones de Tours ============
export async function getTours(): Promise<Tour[]> {
  return request<Tour[]>("/tours");
}

export async function getTourById(id: number): Promise<Tour> {
  return request<Tour>(`/tours/${id}`);
}

export async function createTour(tour: Tour): Promise<Tour> {
  return authRequest<Tour>("/tours", {
    method: "POST",
    body: JSON.stringify(tour),
  });
}

export async function updateTour(id: number, tour: Tour): Promise<Tour> {
  return authRequest<Tour>(`/tours/${id}`, {
    method: "PUT",
    body: JSON.stringify(tour),
  });
}

export async function deleteTour(id: number): Promise<void> {
  return authRequest<void>(`/tours/${id}`, {
    method: "DELETE",
  });
}

// ============ Funciones de Study Trips ============
export async function getStudyTrips(): Promise<StudyTrip[]> {
  return request<StudyTrip[]>("/study-trips");
}

export async function createStudyTrip(trip: StudyTrip): Promise<StudyTrip> {
  return authRequest<StudyTrip>("/study-trips", {
    method: "POST",
    body: JSON.stringify(trip),
  });
}

export async function updateStudyTrip(id: number, trip: StudyTrip): Promise<StudyTrip> {
  return authRequest<StudyTrip>(`/study-trips/${id}`, {
    method: "PUT",
    body: JSON.stringify(trip),
  });
}

export async function deleteStudyTrip(id: number): Promise<void> {
  return authRequest<void>(`/study-trips/${id}`, {
    method: "DELETE",
  });
}

// ============ Funciones de Galería ============
export async function getGalleryImages(tourId: number): Promise<GalleryImage[]> {
  return request<GalleryImage[]>(`/galleries/tour/${tourId}`);
}

export async function getTourCover(tourId: number): Promise<GalleryImage | null> {
  try {
    const response = await fetch(`${API_URL}/galleries/tour/${tourId}/cover`);
    if (!response.ok) return null;
    const data = await response.json();
    return data || null;
  } catch {
    return null;
  }
}

export async function addGalleryImage(
  tourId: number,
  imageUrl: string,
  caption?: string,
  isCover?: boolean
): Promise<GalleryImage> {
  return authRequest<GalleryImage>("/galleries", {
    method: "POST",
    body: JSON.stringify({ tour_id: tourId, image_url: imageUrl, caption, is_cover: isCover }),
  });
}

export async function updateGalleryImage(
  id: number,
  updates: { caption?: string; is_cover?: boolean }
): Promise<GalleryImage> {
  return authRequest<GalleryImage>(`/galleries/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteGalleryImage(id: number): Promise<void> {
  return authRequest<void>(`/galleries/${id}`, {
    method: "DELETE",
  });
}

export async function reorderGalleryImages(orders: { id: number; sort_order: number }[]): Promise<void> {
  return authRequest<void>("/galleries/reorder", {
    method: "POST",
    body: JSON.stringify({ orders }),
  });
}

// 📌 SUBIR IMÁGENES - Función corregida
export async function uploadGalleryImages(
  tourId: number,
  files: FileList,
  captions?: string[]
): Promise<GalleryImage[]> {
  const formData = new FormData();
  
  // Agregar archivos
  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }
  
  // Agregar captions si existen
  if (captions && captions.length > 0) {
    formData.append("captions", JSON.stringify(captions));
  }
  
  const token = getToken();
  
  if (!token) {
    throw new Error("No hay sesión activa. Por favor, inicia sesión nuevamente.");
  }
  
  const response = await fetch(`${API_URL}/galleries/upload/${tourId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    let errorMessage = "Error al subir imágenes";
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
}

export async function uploadSingleImage(
  tourId: number,
  file: File,
  caption?: string,
  isCover?: boolean
): Promise<GalleryImage> {
  const formData = new FormData();
  formData.append("images", file);
  if (caption) formData.append("caption", caption);
  if (isCover) formData.append("is_cover", "true");
  
  const token = getToken();
  
  const response = await fetch(`${API_URL}/galleries/single/${tourId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al subir imagen");
  }
  
  return response.json();
}