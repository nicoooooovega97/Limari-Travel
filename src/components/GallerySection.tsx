// components/GallerySection.tsx
import { useState, useEffect } from "react";
import { X, Calendar, Image as ImageIcon, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { getTours, getGalleryImages } from "../services/storageService";
import type { Tour, GalleryImage } from "../types";

// 📌 URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Función para obtener URL completa de la imagen
const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return "https://placehold.co/600x400/e2e8f0/475569?text=Imagen+no+disponible";
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads')) return `${API_BASE_URL}${imageUrl}`;
  return `${API_BASE_URL}/uploads/tours/${imageUrl}`;
};

// Modal de galería para un tour específico
function TourGalleryModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const galleryImages = await getGalleryImages(tour.id);
        console.log("Imágenes cargadas para modal:", galleryImages);
        setImages(galleryImages);
      } catch (error) {
        console.error("Error cargando galería:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, [tour.id]);

  const currentImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (selectedImageIndex !== null) {
        setSelectedImageIndex(null);
      } else {
        onClose();
      }
    } else if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, images]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="rounded-2xl bg-white p-8">
          <div className="animate-pulse text-center">Cargando galería...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80" onClick={onClose}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative max-w-6xl w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white p-5">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{tour.title}</h3>
              <p className="text-sm text-slate-500">
                {tour.displayDate} • {images.length} {images.length === 1 ? "foto" : "fotos"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Vista detallada de imagen */}
          {selectedImageIndex !== null && currentImage ? (
            <div className="flex-1 flex flex-col">
              <div className="relative flex-1 bg-slate-900 flex items-center justify-center min-h-[50vh]">
                <button
                  onClick={goToPrevious}
                  className={`absolute left-4 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 ${
                    selectedImageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={selectedImageIndex === 0}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                {/* 📌 CORREGIDO: Usar getImageUrl para la URL completa */}
                <img
                  src={getImageUrl(currentImage.image_url)}
                  alt={currentImage.caption || tour.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain"
                  onError={(e) => {
                    console.error("Error cargando imagen en modal:", getImageUrl(currentImage.image_url));
                    (e.target as HTMLImageElement).src = "https://placehold.co/800x600/e2e8f0/475569?text=Imagen+no+disponible";
                  }}
                />
                
                <button
                  onClick={goToNext}
                  className={`absolute right-4 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 ${
                    selectedImageIndex === images.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={selectedImageIndex === images.length - 1}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              {currentImage.caption && (
                <div className="bg-slate-100 p-4 text-center">
                  <p className="text-slate-700">{currentImage.caption}</p>
                </div>
              )}
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="m-4 mx-auto inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700"
              >
                ← Volver a la galería
              </button>
            </div>
          ) : (
            <>
              {/* Grid de imágenes */}
              <div className="flex-1 overflow-y-auto p-6">
                {images.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <p>No hay imágenes disponibles para este tour</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {images.map((img, idx) => (
                      <div
                        key={img.id}
                        className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-lg"
                        onClick={() => setSelectedImageIndex(idx)}
                      >
                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                          {/* 📌 CORREGIDO: Usar getImageUrl para la URL completa */}
                          <img
                            src={getImageUrl(img.image_url)}
                            alt={img.caption || ""}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            onError={(e) => {
                              console.error("Error cargando imagen en grid:", getImageUrl(img.image_url));
                              (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/475569?text=Imagen+no+disponible";
                            }}
                          />
                          {img.is_cover && (
                            <div className="absolute top-2 right-2 rounded-full bg-amber-400 px-2 py-1 text-xs font-semibold text-white shadow-md">
                              Portada
                            </div>
                          )}
                        </div>
                        {img.caption && (
                          <p className="p-3 text-sm text-slate-600 line-clamp-2">{img.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón WhatsApp */}
              <div className="border-t border-slate-200 p-5 bg-slate-50 rounded-b-2xl">
                <a
                  href={`https://wa.me/56961256751?text=${encodeURIComponent(
                    `Hola, me encantó la galería del tour "${tour.title}". ¿Podrían darme más información?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar por este tour
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GallerySection() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [coverImages, setCoverImages] = useState<Record<number, GalleryImage | null>>({});

  // Cargar tours
  useEffect(() => {
    const loadTours = async () => {
      try {
        const allTours = await getTours();
        // Ordenar por fecha descendente (más recientes primero)
        const sortedTours = allTours.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTours(sortedTours);

        // Cargar portadas de cada tour
        const covers: Record<number, GalleryImage | null> = {};
        for (const tour of sortedTours) {
          const gallery = await getGalleryImages(tour.id);
          const cover = gallery.find(img => img.is_cover) || gallery[0] || null;
          covers[tour.id] = cover;
        }
        setCoverImages(covers);
      } catch (error) {
        console.error("Error cargando tours:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTours();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-slate-200 rounded mx-auto mb-4"></div>
              <div className="h-4 w-96 bg-slate-200 rounded mx-auto"></div>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-slate-200 rounded-2xl"></div>
                <div className="h-6 bg-slate-200 rounded mt-4 w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded mt-2 w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Filtrar tours que tienen al menos una imagen en galería
  const toursWithGallery = tours.filter(tour => coverImages[tour.id] !== null);

  if (toursWithGallery.length === 0) {
    return (
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <ImageIcon className="mx-auto h-16 w-16 text-slate-300 mb-4" />
          <h1 className="text-3xl font-semibold text-slate-800">Galería de Experiencias</h1>
          <p className="mt-4 text-slate-500 max-w-md mx-auto">
            Pronto compartiremos las mejores fotos de nuestros viajes.
            ¡Síguenos en redes sociales para no perderte nada!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
            Momentos Inolvidables
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Nuestra Galería de Experiencias
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            Descubre los mejores momentos de nuestros pasajeros organizados por tours y fechas de realización.
          </p>
        </div>

        {/* Grid de Tours con galería */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {toursWithGallery.map((tour) => {
            const coverImage = coverImages[tour.id];
            
            return (
              <div
                key={tour.id}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                onClick={() => setSelectedTour(tour)}
              >
                {/* Imagen de portada */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {coverImage ? (
                    // 📌 CORREGIDO: Usar getImageUrl para la URL completa
                    <img
                      src={getImageUrl(coverImage.image_url)}
                      alt={coverImage.caption || tour.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      onError={(e) => {
                        console.error("Error cargando portada:", getImageUrl(coverImage.image_url));
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x450/e2e8f0/475569?text=Imagen+no+disponible";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-200">
                      <ImageIcon className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                  
                  {/* Overlay al hacer hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Contador de fotos */}
                  <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                    Ver galería →
                  </div>
                </div>

                {/* Información del tour */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4" />
                    <span>{tour.displayDate}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900 line-clamp-1">
                    {tour.title}
                  </h3>
                  {coverImage?.caption && (
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                      {coverImage.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal de galería */}
        {selectedTour && (
          <TourGalleryModal
            tour={selectedTour}
            onClose={() => setSelectedTour(null)}
          />
        )}
      </div>
    </section>
  );
}