// pages/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { StudyTrip, Tour } from "../types";
import {
  createStudyTrip,
  createTour,
  deleteStudyTrip,
  deleteTour,
  getStudyTrips,
  getTours,
  updateStudyTrip,
  updateTour
} from "../services/storageService";
import AdminTourForm from "../components/AdminTourForm";
import AdminStudyTripForm from "../components/AdminStudyTripForm";
import { LogOut, Plus, Edit, Trash2, Bus, GraduationCap, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

type TabType = "tours" | "studyTrips";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("tours");
  const [tours, setTours] = useState<Tour[]>([]);
  const [studyTrips, setStudyTrips] = useState<StudyTrip[]>([]);
  const [showTourForm, setShowTourForm] = useState(false);
  const [showStudyTripForm, setShowStudyTripForm] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | undefined>(undefined);
  const [editingStudyTrip, setEditingStudyTrip] = useState<StudyTrip | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: TabType; id: number; title: string } | null>(null);

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [toursData, studyTripsData] = await Promise.all([getTours(), getStudyTrips()]);
      setTours(toursData);
      setStudyTrips(studyTripsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveTour = async (tour: Tour) => {
    if (editingTour && editingTour.id) {
      await updateTour(editingTour.id, tour);
    } else {
      await createTour(tour);
    }
    await loadData();
    setShowTourForm(false);
    setEditingTour(undefined);
  };

  const handleSaveStudyTrip = async (trip: StudyTrip) => {
    if (editingStudyTrip && editingStudyTrip.id) {
      await updateStudyTrip(editingStudyTrip.id, trip);
    } else {
      await createStudyTrip(trip);
    }
    await loadData();
    setShowStudyTripForm(false);
    setEditingStudyTrip(undefined);
  };

  const handleDeleteTour = async (id: number) => {
    await deleteTour(id);
    await loadData();
    setDeleteConfirm(null);
  };

  const handleDeleteStudyTrip = async (id: number) => {
    await deleteStudyTrip(id);
    await loadData();
    setDeleteConfirm(null);
  };

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-cyan-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-cyan-600">
                Limari Travel
              </Link>
              <span className="text-sm text-slate-400">|</span>
              <span className="text-sm font-medium text-slate-600">Panel de Administración</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("tours")}
              className={`flex items-center gap-2 border-b-2 px-2 py-4 text-sm font-medium transition ${
                activeTab === "tours"
                  ? "border-cyan-600 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Bus className="h-4 w-4" />
              Tours
              <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                {tours.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("studyTrips")}
              className={`flex items-center gap-2 border-b-2 px-2 py-4 text-sm font-medium transition ${
                activeTab === "studyTrips"
                  ? "border-cyan-600 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Giras de Estudio
              <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                {studyTrips.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header con botón crear */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {activeTab === "tours" ? "Gestión de Tours" : "Gestión de Giras de Estudio"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "tours"
                ? "Administra los tours disponibles para el público"
                : "Administra los programas de giras de estudio"}
            </p>
          </div>
          <button
            onClick={() => {
              if (activeTab === "tours") {
                setEditingTour(undefined);
                setShowTourForm(true);
              } else {
                setEditingStudyTrip(undefined);
                setShowStudyTripForm(true);
              }
            }}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4" />
            {activeTab === "tours" ? "Nuevo Tour" : "Nueva Gira"}
          </button>
        </div>

        {/* Tour List */}
        {activeTab === "tours" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <div key={tour.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="h-40 w-full rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x200/e2e8f0/475569";
                  }}
                />
                <div className="mt-3">
                  <h3 className="font-semibold text-slate-900 line-clamp-1">{tour.title}</h3>
                  <p className="text-sm text-slate-500">{tour.displayDate}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-cyan-600">{tour.price}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tour.status === "available" ? "bg-green-100 text-green-700" :
                      tour.status === "limited" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {tour.status === "available" ? "Disponible" :
                       tour.status === "limited" ? "Últimos cupos" :
                       "Agotado"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTour(tour);
                      setShowTourForm(true);
                    }}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <Edit className="inline h-4 w-4 mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ type: "tours", id: tour.id, title: tour.title })}
                    className="flex-1 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="inline h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Study Trips List */}
        {activeTab === "studyTrips" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {studyTrips.map((trip) => (
              <div key={trip.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="h-40 w-full rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x200/e2e8f0/475569";
                  }}
                />
                <div className="mt-3">
                  <h3 className="font-semibold text-slate-900 line-clamp-1">{trip.title}</h3>
                  <p className="text-sm text-slate-500">{trip.duration}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {trip.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingStudyTrip(trip);
                      setShowStudyTripForm(true);
                    }}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <Edit className="inline h-4 w-4 mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ type: "studyTrips", id: trip.id, title: trip.title })}
                    className="flex-1 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="inline h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-900">Confirmar Eliminación</h3>
                <button onClick={() => setDeleteConfirm(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-slate-600">
                ¿Estás seguro de que deseas eliminar <strong className="text-red-600">"{deleteConfirm.title}"</strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-lg border border-slate-200 py-2 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === "tours") {
                      handleDeleteTour(deleteConfirm.id);
                    } else {
                      handleDeleteStudyTrip(deleteConfirm.id);
                    }
                  }}
                  className="flex-1 rounded-lg bg-red-600 py-2 font-medium text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modales de formularios */}
      {showTourForm && (
        <AdminTourForm
          tour={editingTour}
          onSave={handleSaveTour}
          onCancel={() => {
            setShowTourForm(false);
            setEditingTour(undefined);
          }}
        />
      )}

      {showStudyTripForm && (
        <AdminStudyTripForm
          trip={editingStudyTrip}
          onSave={handleSaveStudyTrip}
          onCancel={() => {
            setShowStudyTripForm(false);
            setEditingStudyTrip(undefined);
          }}
        />
      )}
    </div>
  );
}
