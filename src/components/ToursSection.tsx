// components/ToursSection.tsx
import { useState, useMemo, useEffect } from "react";
import TourCard from "./TourCard";
import { Search, ChevronDown, X } from "lucide-react";
import { getTours } from "../services/storageService";
import type { Tour } from "../types";

// Meses en español
const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

type StatusType = "all" | "available" | "limited" | "sold_out";

const statusLabels: Record<StatusType, string> = {
  all: "Todos los estados",
  available: "Disponibles",
  limited: "Últimos Cupos",
  sold_out: "Agotados"
};

export default function ToursSection() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("all");
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar tours desde el backend
  useEffect(() => {
    const loadTours = async () => {
      try {
        const loadedTours = await getTours();
        setTours(loadedTours);
      } finally {
        setLoading(false);
      }
    };
    loadTours();
  }, []);

  // Obtener años únicos de los tours
  const availableYears = useMemo(() => {
    return [...new Set(tours.map(t => t.year))].sort((a, b) => a - b);
  }, [tours]);

  // Filtrar tours
  const filteredTours = useMemo(() => {
    let filtered = [...tours];

    if (searchTerm.trim()) {
      filtered = filtered.filter(tour =>
        tour.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMonth !== null) {
      filtered = filtered.filter(tour => tour.month === selectedMonth);
    }

    if (selectedYear !== null) {
      filtered = filtered.filter(tour => tour.year === selectedYear);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(tour => tour.status === selectedStatus);
    }

    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filtered;
  }, [tours, searchTerm, selectedMonth, selectedYear, selectedStatus]);

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedMonth(null);
    setSelectedYear(null);
    setSelectedStatus("all");
  };

  // Contar filtros activos
  const activeFiltersCount = [
    searchTerm !== "",
    selectedMonth !== null,
    selectedYear !== null,
    selectedStatus !== "all"
  ].filter(Boolean).length;

  if (loading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-slate-200 rounded mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // DropdownSelect component (definido dentro para acceder a months y availableYears)
  const DropdownSelect = ({ 
    label, 
    value, 
    onChange, 
    options, 
    isOpen, 
    setIsOpen,
    renderOption 
  }: { 
    label: string;
    value: any;
    onChange: (value: any) => void;
    options: any[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    renderOption: (option: any, index: number) => React.ReactNode;
  }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
      >
        <span className={value !== null && value !== "all" ? "font-medium text-cyan-600" : "text-slate-500"}>
          {label}: {value !== null && value !== "all" ? (typeof value === 'number' ? months[value] : (value === "available" ? "Disponibles" : value === "limited" ? "Últimos Cupos" : value === "sold_out" ? "Agotados" : value)) : "Todos"}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            {options.map((option, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="cursor-pointer px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                {renderOption(option, idx)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <section id="tours" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">
            Próximas Experiencias
          </p>
          <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Nuestros Tours Disponibles
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            Conoce los destinos que tenemos preparados para ti. Contamos con flexibilidad
            de horarios y los mejores recorridos.
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mt-12">
          <div className="flex flex-wrap items-center gap-3">
            {/* Buscador */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar destino..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {/* Filtro por Mes */}
            <DropdownSelect
              label="Mes"
              value={selectedMonth}
              onChange={setSelectedMonth}
              options={[
                { value: null, label: "Todos los meses" },
                ...months.map((month, index) => ({ 
                  value: index, 
                  label: month,
                  disabled: !tours.some(t => t.month === index)
                }))
              ]}
              isOpen={isMonthOpen}
              setIsOpen={setIsMonthOpen}
              renderOption={(option) => (
                <span className={option.disabled ? "text-slate-300" : ""}>
                  {option.label}
                </span>
              )}
            />

            {/* Filtro por Año */}
            {availableYears.length > 0 && (
              <DropdownSelect
                label="Año"
                value={selectedYear}
                onChange={setSelectedYear}
                options={[
                  { value: null, label: "Todos los años" },
                  ...availableYears.map(year => ({ value: year, label: year.toString() }))
                ]}
                isOpen={isYearOpen}
                setIsOpen={setIsYearOpen}
                renderOption={(option) => option.label}
              />
            )}

            {/* Filtro por Estado */}
            <DropdownSelect
              label="Estado"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: "all", label: "Todos los estados" },
                { value: "available", label: "Disponibles" },
                { value: "limited", label: "Últimos Cupos" },
                { value: "sold_out", label: "Agotados" }
              ]}
              isOpen={isStatusOpen}
              setIsOpen={setIsStatusOpen}
              renderOption={(option) => option.label}
            />

            {/* Botón limpiar filtros */}
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
            Mostrando <span className="font-semibold text-slate-700">{filteredTours.length}</span>{" "}
            {filteredTours.length === 1 ? "tour" : "tours"}
          </p>
        </div>

        {/* Grid de Tours */}
        {filteredTours.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white py-16 text-center">
            <div className="mx-auto max-w-md">
              <Search className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                No encontramos resultados
              </h3>
              <p className="mt-2 text-slate-500">
                No hay tours que coincidan con los filtros seleccionados.
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} {...tour} date={tour.displayDate} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}