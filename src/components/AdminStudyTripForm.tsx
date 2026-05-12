// components/AdminStudyTripForm.tsx
import { useState } from "react";
import type { StudyTrip } from "../types";
import { X, Plus, Trash2 } from "lucide-react";

interface AdminStudyTripFormProps {
  trip?: StudyTrip;
  onSave: (trip: StudyTrip) => void;
  onCancel: () => void;
}

export default function AdminStudyTripForm({ trip, onSave, onCancel }: AdminStudyTripFormProps) {
  const [formData, setFormData] = useState<Partial<StudyTrip>>(
    trip || {
      id: 0,
      title: "",
      duration: "1 día",
      description: "",
      price: "Consultar",
      image: "",
      tags: [],
      includes: {
        transport: [],
        meals: [],
        tickets: [],
        itinerary: []
      }
    }
  );

  const [newTag, setNewTag] = useState("");
  const [newTransport, setNewTransport] = useState("");
  const [newMeal, setNewMeal] = useState("");
  const [newTicket, setNewTicket] = useState("");
  const [newItineraryItem, setNewItineraryItem] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index)
    }));
  };

  const addIncludeItem = (category: "transport" | "meals" | "tickets" | "itinerary", value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
              includes: {
        transport: prev.includes?.transport || [],
        meals: prev.includes?.meals || [],
        tickets: prev.includes?.tickets || [],
        itinerary: prev.includes?.itinerary || [],
        [category]: [...(prev.includes?.[category] || []), value.trim()]
      }
      }));
      setter("");
    }
  };

  const removeIncludeItem = (category: "transport" | "meals" | "tickets" | "itinerary", index: number) => {
    setFormData(prev => ({
      ...prev,
            includes: {
        transport: prev.includes?.transport || [],
        meals: prev.includes?.meals || [],
        tickets: prev.includes?.tickets || [],
        itinerary: prev.includes?.itinerary || [],
        [category]: (prev.includes?.[category] || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title) {
      onSave(formData as StudyTrip);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <div className="relative mx-auto max-w-4xl rounded-2xl bg-white shadow-2xl">
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6 rounded-t-2xl">
            <h2 className="text-2xl font-semibold">
              {trip ? "Editar Gira de Estudio" : "Crear Nueva Gira de Estudio"}
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
                  Título *
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
                  Duración
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="1 día"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Precio
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Consultar"
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

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tags / Etiquetas
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Nueva etiqueta"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.tags || []).map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(idx)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Transporte */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Transporte incluido
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTransport}
                  onChange={(e) => setNewTransport(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Ej: Bus de turismo exclusivo"
                />
                <button
                  type="button"
                  onClick={() => addIncludeItem("transport", newTransport, setNewTransport)}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {(formData.includes?.transport || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeIncludeItem("transport", idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Alimentación */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Alimentación incluida
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newMeal}
                  onChange={(e) => setNewMeal(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Ej: 1 desayuno a bordo"
                />
                <button
                  type="button"
                  onClick={() => addIncludeItem("meals", newMeal, setNewMeal)}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {(formData.includes?.meals || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeIncludeItem("meals", idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tickets */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tickets y Entradas
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTicket}
                  onChange={(e) => setNewTicket(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Ej: Entrada al parque"
                />
                <button
                  type="button"
                  onClick={() => addIncludeItem("tickets", newTicket, setNewTicket)}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {(formData.includes?.tickets || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeIncludeItem("tickets", idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerario destacado */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Itinerario Destacado
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newItineraryItem}
                  onChange={(e) => setNewItineraryItem(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Ej: Visita guiada de 2 horas"
                />
                <button
                  type="button"
                  onClick={() => addIncludeItem("itinerary", newItineraryItem, setNewItineraryItem)}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {(formData.includes?.itinerary || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeIncludeItem("itinerary", idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
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
                {trip ? "Guardar Cambios" : "Crear Gira"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}