// components/AdminTourForm.tsx
import { useState } from "react";
import type { Tour, TourStatus } from "../types";
import { X, Plus, Trash2 } from "lucide-react";

interface AdminTourFormProps {
  tour?: Tour;
  onSave: (tour: Tour) => void;
  onCancel: () => void;
}

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function AdminTourForm({ tour, onSave, onCancel }: AdminTourFormProps) {
  const [formData, setFormData] = useState<Partial<Tour>>(
    tour || {
      id: 0,
      title: "",
      image: "",
      date: "",
      displayDate: "",
      price: "",
      reservationPrice: "",
      status: "available",
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      description: "",
      includes: [],
      itinerary: [],
      importantInfo: [],
      schedule: [],
      cancellationPolicy: ""
    }
  );

  const [newInclude, setNewInclude] = useState("");
  const [newItinerary, setNewItinerary] = useState("");
  const [newImportantInfo, setNewImportantInfo] = useState("");
  const [newScheduleLocation, setNewScheduleLocation] = useState("");
  const [newScheduleTime, setNewScheduleTime] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const date = new Date(dateValue);
    const month = date.getMonth();
    const year = date.getFullYear();
    const displayDate = date.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
    
    setFormData(prev => ({
      ...prev,
      date: dateValue,
      displayDate: displayDate,
      month: month,
      year: year
    }));
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...(prev.includes || []), newInclude.trim()]
      }));
      setNewInclude("");
    }
  };

  const removeInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: (prev.includes || []).filter((_, i) => i !== index)
    }));
  };

  const addItinerary = () => {
    if (newItinerary.trim()) {
      setFormData(prev => ({
        ...prev,
        itinerary: [...(prev.itinerary || []), newItinerary.trim()]
      }));
      setNewItinerary("");
    }
  };

  const removeItinerary = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: (prev.itinerary || []).filter((_, i) => i !== index)
    }));
  };

  const addImportantInfo = () => {
    if (newImportantInfo.trim()) {
      setFormData(prev => ({
        ...prev,
        importantInfo: [...(prev.importantInfo || []), newImportantInfo.trim()]
      }));
      setNewImportantInfo("");
    }
  };

  const removeImportantInfo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      importantInfo: (prev.importantInfo || []).filter((_, i) => i !== index)
    }));
  };

  const addSchedule = () => {
    if (newScheduleLocation.trim() && newScheduleTime.trim()) {
      setFormData(prev => ({
        ...prev,
        schedule: [...(prev.schedule || []), { location: newScheduleLocation.trim(), time: newScheduleTime.trim() }]
      }));
      setNewScheduleLocation("");
      setNewScheduleTime("");
    }
  };

  const removeSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: (prev.schedule || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.price) {
      onSave(formData as Tour);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <div className="relative mx-auto max-w-4xl rounded-2xl bg-white shadow-2xl">
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6 rounded-t-2xl">
            <h2 className="text-2xl font-semibold">
              {tour ? "Editar Tour" : "Crear Nuevo Tour"}
            </h2>
            <button
              onClick={onCancel}
              className="rounded-full p-2 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Información básica */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Título del Tour *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  URL de la Imagen
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="/buinzoo.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Precio *
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="$49.990"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Precio de Reserva
                </label>
                <input
                  type="text"
                  name="reservationPrice"
                  value={formData.reservationPrice}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="$25.000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="available">Disponible</option>
                  <option value="limited">Últimos Cupos</option>
                  <option value="sold_out">Agotado</option>
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            {/* Qué incluye */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ¿Qué incluye?
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Nuevo ítem"
                />
                <button
                  type="button"
                  onClick={addInclude}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {(formData.includes || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeInclude(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerario */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lugares a Visitar
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newItinerary}
                  onChange={(e) => setNewItinerary(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Nuevo lugar"
                />
                <button
                  type="button"
                  onClick={addItinerary}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {(formData.itinerary || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeItinerary(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Información importante */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Información Importante
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newImportantInfo}
                  onChange={(e) => setNewImportantInfo(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Nueva información"
                />
                <button
                  type="button"
                  onClick={addImportantInfo}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {(formData.importantInfo || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeImportantInfo(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Horarios de salida */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Horarios de Salida
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newScheduleLocation}
                  onChange={(e) => setNewScheduleLocation(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Ubicación"
                />
                <input
                  type="text"
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                  className="w-24 rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Hora"
                />
                <button
                  type="button"
                  onClick={addSchedule}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {(formData.schedule || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-sm">{item.location} - {item.time}</span>
                    <button
                      type="button"
                      onClick={() => removeSchedule(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Política de cancelación */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Política de Cancelación
              </label>
              <textarea
                name="cancellationPolicy"
                value={formData.cancellationPolicy}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-slate-300 px-6 py-2 font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white hover:bg-cyan-700"
              >
                {tour ? "Guardar Cambios" : "Crear Tour"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}