// components/StudyTripsSection.tsx
import { useState, useMemo, useEffect } from "react";
import { Bus, Utensils, Ticket, Clock, MapPin, X, ChevronRight, Search, ChevronDown } from "lucide-react";
import { getStudyTrips } from "../services/storageService";
import type { StudyTrip } from "../types";

const whatsappNumber = "56961256751";

// Opciones de filtro por duración
const durationOptions = ["Todos", "1 día", "2 días / 1 noche", "3 días / 2 noches"];

// Componente para el detalle del programa (modal)
function ProgramDetail({ program, onClose }: { program: StudyTrip; onClose: () => void }) {
  if (!program) return null;

  const whatsappMessage = `Hola, me interesa el programa "${program.title}" para una gira de estudio. ¿Podrían darme más información sobre el programa y los valores?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold md:text-3xl">{program.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {program.duration}
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Descripción del Programa</h3>
            <p className="mt-2 text-slate-600">{program.description}</p>
          </div>

          {/* Qué incluye */}
          {program.includes && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold">¿Qué Incluye el Programa?</h3>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {program.includes.transport && program.includes.transport.length > 0 && (
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-fuchsia-600">
                      <Bus className="h-5 w-5" />
                      <h4 className="font-semibold">Transporte</h4>
                    </div>
                    <ul className="mt-2 ml-6 list-disc text-sm text-slate-600">
                      {program.includes.transport.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.includes.meals && program.includes.meals.length > 0 && (
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-cyan-600">
                      <Utensils className="h-5 w-5" />
                      <h4 className="font-semibold">Alimentación</h4>
                    </div>
                    <ul className="mt-2 ml-6 list-disc text-sm text-slate-600">
                      {program.includes.meals.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.includes.tickets && program.includes.tickets.length > 0 && (
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-amber-600">
                      <Ticket className="h-5 w-5" />
                      <h4 className="font-semibold">Tickets y Entradas</h4>
                    </div>
                    <ul className="mt-2 ml-6 list-disc text-sm text-slate-600">
                      {program.includes.tickets.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.includes.itinerary && program.includes.itinerary.length > 0 && (
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <MapPin className="h-5 w-5" />
                      <h4 className="font-semibold">Itinerario Destacado</h4>
                    </div>
                    <ul className="mt-2 ml-6 list-disc text-sm text-slate-600">
                      {program.includes.itinerary.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl bg-gradient-to-r from-fuchsia-50 to-cyan-50 p-6 text-center">
            <p className="text-lg font-semibold text-slate-800">¿Quieres más información o cotizar este programa?</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
              >
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudyTripsSection() {
  const [studyTrips, setStudyTrips] = useState<StudyTrip[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<StudyTrip | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("Todos");
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar giras de estudio desde el backend
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const trips = await getStudyTrips();
        setStudyTrips(trips);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  const handleWhatsAppConsult = (programTitle: string) => {
    const whatsappMessage = `Hola, me interesa el programa "${programTitle}" para una gira de estudio. ¿Podrían darme más información sobre el programa y los valores?`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappLink, "_blank");
  };

  // Filtrar programas
  const filteredPrograms = useMemo(() => {
    let filtered = [...studyTrips];

    if (searchTerm.trim()) {
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDuration !== "Todos") {
      filtered = filtered.filter(program => program.duration === selectedDuration);
    }

    return filtered;
  }, [studyTrips, searchTerm, selectedDuration]);

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDuration("Todos");
  };

  const activeFiltersCount = (searchTerm !== "" ? 1 : 0) + (selectedDuration !== "Todos" ? 1 : 0);

  if (loading) {
    return (
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-slate-200 rounded mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
            Aprendizaje y Aventura
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Giras de Estudio y Programas Escolares
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            Programas educativos diseñados para complementar el aprendizaje con experiencias inolvidables. Seguridad, confort y diversión garantizados.
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mt-12">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar programa educativo..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDurationOpen(!isDurationOpen)}
                className="flex items-center justify-between gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <span className={selectedDuration !== "Todos" ? "font-medium text-cyan-600" : "text-slate-500"}>
                  Duración: {selectedDuration}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDurationOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isDurationOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDurationOpen(false)} />
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    {durationOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setSelectedDuration(option);
                          setIsDurationOpen(false);
                        }}
                        className="cursor-pointer px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex h-12 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-600 transition-all hover:bg-red-100"
              >
                <X className="h-4 w-4" />
                Limpiar ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        {/* Resultados */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-semibold text-slate-700">{filteredPrograms.length}</span>{" "}
            {filteredPrograms.length === 1 ? "programa" : "programas"}
          </p>
        </div>

        {/* Listado de programas */}
        {filteredPrograms.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white py-16 text-center">
            <div className="mx-auto max-w-md">
              <Search className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                No encontramos resultados
              </h3>
              <p className="mt-2 text-slate-500">
                No hay programas que coincidan con los filtros seleccionados.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2.5 font-medium text-white transition hover:bg-cyan-600"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-xl"
                onClick={() => setSelectedProgram(program)}
              >
                <div className="aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/475569?text=Imagen+no+disponible";
                    }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                      <Clock className="h-3 w-3" />
                      {program.duration}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppConsult(program.title);
                      }}
                      className="text-sm font-semibold transition hover:brightness-110"
                      style={{ color: "#F2AB27" }}
                    >
                      {program.price}
                    </button>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold line-clamp-1">{program.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{program.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {program.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    className="mt-5 inline-flex w-full items-center justify-center gap-1 rounded-xl py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                    style={{ backgroundColor: "#0511F2" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProgram(program);
                    }}
                  >
                    Ver programa completo
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {selectedProgram && (
        <ProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} />
      )}
    </section>
  );
}