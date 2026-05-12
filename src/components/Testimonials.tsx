// components/TestimonialCarousel.tsx
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
  Send,
  CheckCircle
} from "lucide-react";

import { useState, useEffect, useCallback } from "react";

interface Testimonial {
  id: number;
  name: string;
  initial: string;
  rating: number;
  comment: string;
}

// Datos de testimonios
const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Aylin Ledezma Avalos",
    initial: "AL",
    rating: 5,
    comment:
      "Turismo Buses Pulpica es, sin duda, una de las mejores opciones para viajar en confort y seguridad. He tenido el placer de viajar con ellos en varias ocasiones y ofrecen un servicio excepcional."
  },
  {
    id: 2,
    name: "Nicole Veliz",
    initial: "NV",
    rating: 5,
    comment:
      "Viajar con Buses Pulpica es descubrir que la logística impecable y la calidez no tienen por qué ir por caminos separados. Guías amables, transporte con limpieza de hotel y wifi..."
  },
  {
    id: 3,
    name: "Krishna",
    initial: "K",
    rating: 5,
    comment:
      "Es la segunda vez viajando junto a ellos, sin duda son unos de los mejores en el rubro; siempre al pendiente de los pasajeros y familiarizándose con cada uno de nosotros."
  },
  {
    id: 4,
    name: "Valeska Concha",
    initial: "VC",
    rating: 5,
    comment:
      "En mi experiencia es la mejor empresa de turismo que existe en la zona. Responsables, organizados, ordenados en todo lo que respecta a la parte logística de cada viaje."
  },
  {
    id: 5,
    name: "Edith Mardones Avila",
    initial: "EM",
    rating: 5,
    comment:
      "Máquina de última generación con tecnología que facilita el viaje. Tripulación a bordo de primera calidad, amables y empáticos con los pasajeros."
  },
  {
    id: 6,
    name: "Carlos Rojas",
    initial: "CR",
    rating: 5,
    comment:
      "Los micros llegaron a tiempo, fueron súper cómodos y el servicio fue amable en todo el recorrido."
  },
  {
    id: 7,
    name: "María González",
    initial: "MG",
    rating: 5,
    comment:
      "Excelente servicio, muy puntuales y el bus muy cómodo. Viajé con mi familia y todos quedamos encantados."
  }
];

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(testimonialsData);

  const [startIndex, setStartIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Estados para el modal de reseña
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: ""
  });

  // Cargar reseñas guardadas al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("limari_reviews");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setTestimonials(parsed);
        }
      } catch (e) {
        console.error("Error cargando reseñas:", e);
      }
    }
  }, []);

  const visibleTestimonials = testimonials.slice(
    startIndex,
    startIndex + 3
  );

  const hasNext = startIndex + 3 < testimonials.length;

  const nextSlide = useCallback(() => {
    if (isAnimating) return;

    if (hasNext) {
      setIsAnimating(true);

      setTimeout(() => {
        setStartIndex((prev) => prev + 1);

        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 300);
    } else if (testimonials.length > 3) {
      // Volver al inicio
      setStartIndex(0);
    }
  }, [hasNext, isAnimating, testimonials.length]);

  const prevSlide = () => {
    if (isAnimating) return;

    if (startIndex > 0) {
      setIsAnimating(true);

      setTimeout(() => {
        setStartIndex((prev) => prev - 1);

        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 300);
    }
  };

  // Auto-play cada 10 segundos
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      if (hasNext) {
        nextSlide();
      } else if (testimonials.length > 3) {
        setStartIndex(0);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, hasNext, testimonials.length]);

  const handleUserInteraction = () => {
    setIsAutoPlaying(false);

    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 30000);
  };

  // Manejar el envío de una nueva reseña
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Por favor ingresa tu nombre");
      return;
    }

    if (!formData.comment.trim()) {
      setFormError("Por favor escribe tu opinión");
      return;
    }

    if (formData.comment.length < 10) {
      setFormError("Tu opinión debe tener al menos 10 caracteres");
      return;
    }

    const newReview: Testimonial = {
      id: Date.now(),
      name: formData.name.trim(),
      initial: formData.name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      rating: formData.rating,
      comment: formData.comment.trim()
    };

    const updatedReviews = [...testimonials, newReview];

    setTestimonials(updatedReviews);

    localStorage.setItem(
      "limari_reviews",
      JSON.stringify(updatedReviews)
    );

    setFormSubmitted(true);

    setFormData({
      name: "",
      rating: 5,
      comment: ""
    });

    setTimeout(() => {
      setFormSubmitted(false);
      setIsModalOpen(false);
    }, 2000);
  };

  const renderStars = (
    rating: number,
    interactive: boolean = false,
    onStarClick?: (star: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onStarClick?.(star) : undefined}
            className={interactive ? "focus:outline-none" : ""}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              } ${interactive ? "transition hover:scale-110" : ""}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getInitials = (name: string, initial?: string) => {
    if (initial) return initial;

    const words = name.split(" ");

    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    return name.charAt(0).toUpperCase();
  };

  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((acc, t) => acc + t.rating, 0) /
          testimonials.length
        ).toFixed(1)
      : "5.0";


  return (
    <section className="bg-slate-50 py-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
            Lo que dicen nuestros pasajeros
          </p>
          <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Testimonios Reales
          </h2>

          <div className="mt-6 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-lg text-slate-600">
              <span className="text-2xl font-bold text-slate-900">{averageRating}</span> 
              {" "}estrellas · Basado en {testimonials.length} {testimonials.length === 1 ? "opinión" : "opiniones"}
            </p>
          </div>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Nuestra mayor recompensa es tu satisfacción. Lee lo que nuestros pasajeros dicen sobre nosotros.
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative mt-12">
          <button
            onClick={() => {
              prevSlide();
              handleUserInteraction();
            }}
            disabled={startIndex === 0 || isAnimating}
            className={`absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition md:-left-6 ${
              startIndex === 0 || isAnimating
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-slate-100"
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>

          <div className="overflow-hidden rounded-2xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg"
                >
                  <div className="flex flex-col">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-sm font-bold text-white">
                      {getInitials(testimonial.name, testimonial.initial)}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{testimonial.name}</h3>
                    <div className="mt-1">{renderStars(testimonial.rating)}</div>
                    <p className="mt-4 text-slate-600 leading-relaxed line-clamp-4">
                      "{testimonial.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              nextSlide();
              handleUserInteraction();
            }}
            disabled={!hasNext || isAnimating}
            className={`absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition md:-right-6 ${
              !hasNext || isAnimating
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-slate-100"
            }`}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-1">
            {testimonials.slice(0, testimonials.length - 2).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index === startIndex || isAnimating) return;
                  setStartIndex(index);
                  handleUserInteraction();
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  startIndex === index
                    ? "w-8 bg-cyan-600"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm transition hover:bg-slate-100"
          >
            {isAutoPlaying ? (
              <>
                <Pause className="h-3 w-3" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span>Auto</span>
              </>
            )}
          </button>
          <span className="text-sm text-slate-400">
            Mostrando {startIndex + 1} - {Math.min(startIndex + 3, testimonials.length)} de {testimonials.length}
          </span>
        </div>

        {/* Botón para dejar reseña - AHORA ABRE EL MODAL */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#F2AB27] px-6 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Déjanos tu opinión
            <Star className="h-4 w-4 fill-white" />
          </button>
        </div>
      </div>

      {/* MODAL PARA DEJAR RESEÑA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header del modal */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-5">
              <h3 className="text-xl font-semibold text-slate-900">Comparte tu experiencia</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                  <h4 className="mt-4 text-xl font-semibold text-slate-900">¡Gracias por tu opinión!</h4>
                  <p className="mt-2 text-slate-500">Tu reseña ha sido publicada exitosamente.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  {formError && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tu nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Calificación *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 transition ${
                              star <= formData.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 hover:text-amber-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tu opinión *
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      rows={4}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="Cuéntanos cómo fue tu experiencia con nosotros..."
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Mínimo 10 caracteres
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700"
                  >
                    <Send className="h-4 w-4" />
                    Publicar opinión
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes slideOutLeft {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-out-left {
          animation: slideOutLeft 0.3s ease-in-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-in-out forwards;
        }
      `}</style>
    </section>
  );
}