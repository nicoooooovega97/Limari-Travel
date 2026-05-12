// pages/TourDetail.tsx
import { useParams, Link } from "react-router-dom";
import { Bus, Calendar, Clock, MapPin, AlertCircle, CreditCard, ArrowLeft, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getTourById } from "../services/storageService";
import type { Tour } from "../types";

export default function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTour = async () => {
      if (!id) {
        setTour(null);
        setLoading(false);
        return;
      }

      try {
        const fetchedTour = await getTourById(Number(id));
        setTour(fetchedTour);
      } catch (error) {
        setTour(null);
      } finally {
        setLoading(false);
      }
    };

    loadTour();
  }, [id]);

  const whatsappNumber = "56961256751";
  const whatsappMessage = `Hola, me interesa reservar el tour "${tour?.title}" para la fecha ${tour?.displayDate}. ¿Podrían darme más información?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-slate-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Tour no encontrado</h2>
          <Link to="/tours" className="mt-4 inline-flex items-center gap-2 text-cyan-600 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Volver a todos los tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-12">
        
        {/* Botón volver */}
        <Link to="/tours" className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          Volver a todos los tours
        </Link>

        {/* Grid principal */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Columna izquierda - Imagen y detalles principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen */}
            <div className="overflow-hidden rounded-3xl bg-slate-100">
              <img 
                src={tour.image} 
                alt={tour.title}
                className="h-[400px] w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/1200x800/e2e8f0/475569?text=Imagen+no+disponible";
                }}
              />
            </div>

            {/* Título y fecha */}
            <div>
              <h1 className="text-4xl font-semibold sm:text-5xl">{tour.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {tour.displayDate}
                </span>
              </div>
            </div>

            {/* Estado del tour */}
            {tour.status === "sold_out" && (
              <div className="rounded-2xl bg-red-50 p-4 text-red-700 border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">¡Cupos Agotados!</span>
                </div>
                <p className="mt-1 text-sm">Este tour ya no tiene cupos disponibles. Puedes contactarnos para futuras fechas.</p>
              </div>
            )}

            {tour.status === "limited" && (
              <div className="rounded-2xl bg-yellow-50 p-4 text-yellow-700 border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">¡Últimos Cupos!</span>
                </div>
                <p className="mt-1 text-sm">Quedan pocos cupos disponibles. ¡Reserva pronto!</p>
              </div>
            )}

            {/* Descripción */}
            {tour.description && (
              <div>
                <h2 className="text-2xl font-semibold">Descripción del Tour</h2>
                <p className="mt-3 text-slate-600 leading-relaxed">{tour.description}</p>
              </div>
            )}

            {/* Qué incluye */}
            {tour.includes && tour.includes.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold">¿Qué Incluye?</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {tour.includes.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-600">
                      <Bus className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerario / Lugares a visitar */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold">📍 Lugares a Visitar</h2>
                <div className="mt-4 space-y-2">
                  {tour.itinerary.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información importante */}
            {tour.importantInfo && tour.importantInfo.length > 0 && (
              <div className="rounded-2xl bg-amber-50 p-6 border border-amber-200">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  Información Importante
                </h2>
                <ul className="mt-3 space-y-2">
                  {tour.importantInfo.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-amber-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Política de cancelación */}
            {tour.cancellationPolicy && (
              <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-slate-600" />
                  Política de Cancelación
                </h2>
                <p className="mt-2 text-slate-600">{tour.cancellationPolicy}</p>
              </div>
            )}
          </div>

          {/* Columna derecha - Card de reserva */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="text-center">
                <p className="text-sm text-slate-500">Precio por persona</p>
                <p className="text-4xl font-bold text-slate-900">{tour.price}</p>
                <p className="text-sm text-slate-500 mt-1">Reserva con {tour.reservationPrice}</p>
              </div>

              {/* Horarios de salida */}
              {tour.schedule && tour.schedule.length > 0 && (
                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Puntos de Salida
                  </h3>
                  <div className="mt-2 space-y-2">
                    {tour.schedule.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.location}</span>
                        <span className="font-mono text-slate-900">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón de reserva */}
              <a
                href={tour.status !== "sold_out" ? whatsappLink : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 w-full rounded-xl py-3 font-semibold text-center inline-flex items-center justify-center gap-2 transition-all ${
                  tour.status === "sold_out"
                    ? "bg-slate-300 cursor-not-allowed text-slate-500"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                onClick={(e) => {
                  if (tour.status === "sold_out") {
                    e.preventDefault();
                  }
                }}
              >
                <MessageCircle className="h-5 w-5" />
                {tour.status === "sold_out" ? "Cupos Agotados" : "Reservar por WhatsApp"}
              </a>

              <p className="mt-4 text-center text-xs text-slate-400">
                Atendido por: Jorge Oro Cortés
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}