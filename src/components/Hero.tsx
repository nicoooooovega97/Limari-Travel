// components/Hero.tsx
import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const images = [
  { src: "/desierto-florido1.jpg", alt: "Desierto Florido 1" },
  { src: "/desierto-florido.jpeg", alt: "Desierto Florido" },
  { src: "/punta-chorros2.jpg", alt: "Punta Chorros 2" },
  { src: "/punta-chorros.jpeg", alt: "Punta Chorros" },
  { src: "/valle-elqui1.jpeg", alt: "Valle del Elqui 1" },
  { src: "/valle-elqui.jpg", alt: "Valle del Elqui" },
  { src: "/torres-paine.jpg", alt: "Torres del Paine" },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambio automático cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-slate-950 text-white"
    >
      {/* Carrusel de imágenes de fondo */}
      <div className="absolute inset-0 transition-opacity duration-700">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/1920x1080/1e293b/475569?text=Imagen+no+disponible";
            }}
          />
        ))}
      </div>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-slate-950/60" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-cyan-500/20 to-transparent" />

      {/* Botones de navegación del carrusel */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 focus:outline-none"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 focus:outline-none"
        aria-label="Imagen siguiente"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores (dots) */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-6 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Contenido estático */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 px-6 py-24 text-center lg:py-28">
        <div className="max-w-3xl space-y-8">
          <p className="text-base font-semibold uppercase tracking-[0.38em] text-amber-300">
            Experiencia en Viajar
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Descubre Nuevos Destinos con Limari Travel
          </h1>

          <p className="mx-auto max-w-2xl text-slate-200 sm:text-lg">
            Empresa de Turismo de Ovalle, Región de Coquimbo. Confort, seguridad y la mejor atención para tus viajes inolvidables.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0511F2] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Próximos Viajes Disponibles
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F2AB27] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}