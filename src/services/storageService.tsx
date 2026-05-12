import type { StudyTrip, Tour } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const JSON_HEADERS: HeadersInit = {
  "Content-Type": "application/json"
};

const TOKEN_KEY = "admin_token";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.error ||
      response.statusText ||
      "Error en la petición"
    );
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

function authRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  options.headers = {
    ...JSON_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  return request<T>(path, options);
}

export async function loginAdmin(
  username: string,
  password: string
) {
  return request<{ token: string; username: string }>(
    "/auth/login",
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ username, password })
    }
  );
}

export async function getTours(): Promise<Tour[]> {
  return request<Tour[]>("/tours");
}

export async function getTourById(id: number): Promise<Tour> {
  return request<Tour>(`/tours/${id}`);
}

export async function createTour(
  tour: Tour
): Promise<Tour> {
  return authRequest<Tour>("/tours", {
    method: "POST",
    body: JSON.stringify(tour)
  });
}

export async function updateTour(
  id: number,
  tour: Tour
): Promise<Tour> {
  return authRequest<Tour>(`/tours/${id}`, {
    method: "PUT",
    body: JSON.stringify(tour)
  });
}

export async function deleteTour(id: number): Promise<void> {
  return authRequest<void>(`/tours/${id}`, {
    method: "DELETE"
  });
}

export async function getStudyTrips(): Promise<StudyTrip[]> {
  return request<StudyTrip[]>("/study-trips");
}

export async function createStudyTrip(
  trip: StudyTrip
): Promise<StudyTrip> {
  return authRequest<StudyTrip>("/study-trips", {
    method: "POST",
    body: JSON.stringify(trip)
  });
}

export async function updateStudyTrip(
  id: number,
  trip: StudyTrip
): Promise<StudyTrip> {
  return authRequest<StudyTrip>(`/study-trips/${id}`, {
    method: "PUT",
    body: JSON.stringify(trip)
  });
}

export async function deleteStudyTrip(
  id: number
): Promise<void> {
  return authRequest<void>(`/study-trips/${id}`, {
    method: "DELETE"
  });
}