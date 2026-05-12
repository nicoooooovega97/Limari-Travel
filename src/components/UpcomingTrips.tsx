// components/UpcomingTrips.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { getTours } from "../services/storageService";
import type { Tour } from "../types";

export default function UpcomingTrips() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTours = async () => {
      try {
        const allTours = await getTours();
        // Filtrar tours disponibles y con cupos (no agotados)
        const availableTours = allTours
          .filter(tour => tour.status !== "sold_out")
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3); // Mostrar máximo 3
        setTours(availableTours);
      } catch (error) {
        console.error("Error cargando tours:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTours();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "limited":
        return "bg-yellow-100 text-yellow-700";
      case "available":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "limited":
        return "Últimos Cupos";
      case "available":
        return "Disponible";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-pulse">
            <div className="mx-auto h-8 w-48 rounded bg-slate-200"></div>
            <div className="mx-auto mt-4 h-4 w-64 rounded bg-slate-200"></div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-200"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (tours.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: '#F2AB27' }}>
            Próximas Experiencias
          </p>
          <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Nuestros Tours Destacados
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            Explora nuestras próximas salidas y únete a una experiencia única. Tenemos los mejores panoramas para ti y tu familia.
          </p>
        </div>

        {/* Filtros rápidos */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="rounded-full px-5 py-2 text-sm font-medium text-white shadow-sm" style={{ backgroundColor: '#F2AB27' }}>
            Todos los Viajes
          </button>
          <button className="rounded-full bg-white px-5 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-100" style={{ color: '#F2AB27' }}>
            Disponibles
          </button>
          <button className="rounded-full bg-white px-5 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-100" style={{ color: '#F2AB27' }}>
            Últimos Cupos
          </button>
        </div>

        {/* Grid de tours */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <Link
              key={tour.id}
              to={`/tours/${tour.id}`}
              className="group block overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Imagen */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/475569?text=Imagen+no+disponible";
                  }}
                />
                {/* Badge de estado */}
                {tour.status === "limited" && (
                  <div className="absolute right-3 top-3 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                    ⚡ Últimos Cupos
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>{tour.displayDate}</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 line-clamp-1">
                  {tour.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                  {tour.description || "Descubre esta increíble experiencia con nosotros."}
                </p>

                {/* Precio y reserva */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-cyan-600">{tour.price}</span>
                    <span className="ml-1 text-sm text-slate-500">CLP</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Reserva con {tour.reservationPrice}
                  </span>
                </div>

                {/* Botón */}
                <div
                  className={`mt-4 flex w-full items-center justify-center gap-1 rounded-xl py-2.5 text-sm font-semibold transition text-white`}
                  style={{ backgroundColor: '#F2AB27' }}
                >
                  Explorar Viaje
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Ver más tours */}
        <div className="mt-10 text-center">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold transition hover:bg-cyan-50"
            style={{ color: '#F2AB27', border: `1px solid #F2AB27` }}
          >
            Ver todos los tours
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}