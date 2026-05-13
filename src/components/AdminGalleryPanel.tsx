// components/AdminGalleryPanel.tsx
import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Star, Image as ImageIcon, X, GripVertical, Upload, Loader2, ChevronDown } from "lucide-react";
import type { GalleryImage, Tour } from "../types";
import {
  getGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
  uploadGalleryImages,
  getTours,
} from "../services/storageService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AdminGalleryPanel() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isTourDropdownOpen, setIsTourDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar tours al iniciar
  useEffect(() => {
    loadTours();
  }, []);

  // Cargar galería cuando se selecciona un tour
  useEffect(() => {
    if (selectedTour) {
      loadGallery();
    }
  }, [selectedTour]);

  const loadTours = async () => {
    try {
      const allTours = await getTours();
      setTours(allTours);
      if (allTours.length > 0) {
        setSelectedTour(allTours[0]);
      }
    } catch (error) {
      console.error("Error cargando tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadGallery = async () => {
    if (!selectedTour) return;
    try {
      const galleryImages = await getGalleryImages(selectedTour.id);
      console.log("Imágenes cargadas:", galleryImages);
      setImages(galleryImages);
    } catch (error) {
      console.error("Error cargando galería:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setCaptions(files.map(() => ""));
  };

  const handleCaptionChange = (index: number, value: string) => {
    const newCaptions = [...captions];
    newCaptions[index] = value;
    setCaptions(newCaptions);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !selectedTour) return;
    
    setUploading(true);
    try {
      const fileList = Object.values(selectedFiles) as unknown as FileList;
      const uploadedImages = await uploadGalleryImages(selectedTour.id, fileList, captions);
      console.log("Imágenes subidas:", uploadedImages);
      await loadGallery();
      setSelectedFiles([]);
      setCaptions([]);
      setShowAddForm(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
      alert("Error al subir las imágenes: " + (error instanceof Error ? error.message : ""));
    } finally {
      setUploading(false);
    }
  };

  const handleSetCover = async (image: GalleryImage) => {
    if (!selectedTour) return;
    setLoadingAction(true);
    try {
      await updateGalleryImage(image.id, { is_cover: true });
      await loadGallery();
    } catch (error) {
      console.error("Error estableciendo portada:", error);
      alert("Error al establecer portada");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteImage = async (image: GalleryImage) => {
    if (!confirm(`¿Eliminar esta imagen${image.caption ? ` (${image.caption})` : ""}?`)) return;
    
    setLoadingAction(true);
    try {
      await deleteGalleryImage(image.id);
      await loadGallery();
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      alert("Error al eliminar imagen");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (dragIndex === dropIndex) return;

    const newImages = [...images];
    const [draggedItem] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    
    const orders = newImages.map((img, idx) => ({ id: img.id, sort_order: idx }));
    setImages(newImages);
    
    try {
      await reorderGalleryImages(orders);
      await loadGallery();
    } catch (error) {
      console.error("Error reordenando:", error);
    }
    setDragOverIndex(null);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setCaptions(prev => prev.filter((_, i) => i !== index));
  };

  // Función para obtener URL completa de la imagen
  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/uploads')) return `${API_BASE_URL}${imageUrl}`;
    return `${API_BASE_URL}/uploads/tours/${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-cyan-600 animate-spin" />
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <p className="text-slate-500">No hay tours creados aún.</p>
        <p className="text-sm text-slate-400">Crea un tour primero en la pestaña "Tours"</p>
      </div>
    );
  }

  return (
    <div>
      {/* Selector de Tour */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Seleccionar Tour
        </label>
        <div className="relative max-w-md">
          <button
            onClick={() => setIsTourDropdownOpen(!isTourDropdownOpen)}
            className="flex items-center justify-between w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <span className="truncate">
              {selectedTour ? selectedTour.title : "Selecciona un tour"}
            </span>
            <ChevronDown className={`h-5 w-5 transition-transform ${isTourDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isTourDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsTourDropdownOpen(false)} />
              <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {tours.map((tour) => (
                  <button
                    key={tour.id}
                    onClick={() => {
                      setSelectedTour(tour);
                      setIsTourDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    {tour.title}
                    <span className="text-xs text-slate-400 ml-2">{tour.displayDate}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Información del tour seleccionado */}
      {selectedTour && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Galería de {selectedTour.title}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {images.length} {images.length === 1 ? "imagen" : "imágenes"} en esta galería
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4" />
              Subir Imágenes
            </button>
          </div>

          {/* Formulario de subida de archivos */}
          {showAddForm && (
            <div className="mb-6 rounded-xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-cyan-500" />
                <h3 className="mt-2 text-lg font-semibold text-slate-800">Subir imágenes desde tu dispositivo</h3>
                <p className="text-sm text-slate-500">Selecciona una o varias imágenes (JPG, PNG, GIF, hasta 5MB cada una)</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="mt-4 block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-cyan-600 file:text-white
                    hover:file:bg-cyan-700"
                />
              </div>

              {/* Vista previa de imágenes seleccionadas */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-slate-700 mb-3">Vista previa ({selectedFiles.length} imágenes)</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white rounded-lg p-3 border border-slate-200">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx}`}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={captions[idx] || ""}
                            onChange={(e) => handleCaptionChange(idx, e.target.value)}
                            placeholder="Pie de foto (opcional)"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          />
                          <p className="text-xs text-slate-400 mt-1">
                            {(file.size / 1024 / 1024).toFixed(2)} MB - {file.name}
                          </p>
                        </div>
                        <button
                          onClick={() => removeSelectedFile(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => {
                        setSelectedFiles([]);
                        setCaptions([]);
                        setShowAddForm(false);
                      }}
                      className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                          Subiendo...
                        </>
                      ) : (
                        "Subir Imágenes"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lista de imágenes */}
          {images.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p>No hay imágenes en la galería de este tour</p>
              <p className="text-sm">Haz clic en "Subir Imágenes" para comenzar</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`relative group rounded-xl border-2 bg-white p-3 transition-all ${
                    dragOverIndex === index ? "border-cyan-500 bg-cyan-50" : "border-slate-200"
                  }`}
                >
                  {/* Handle para arrastrar */}
                  <div className="absolute top-2 left-2 cursor-grab opacity-0 group-hover:opacity-100 transition z-10">
                    <GripVertical className="h-5 w-5 text-slate-400" />
                  </div>

                  {/* Imagen - CORREGIDO: URL completa */}
                  <img
                    src={getImageUrl(image.image_url)}
                    alt={image.caption || `Imagen ${index + 1}`}
                    className="h-48 w-full rounded-lg object-cover"
                    onError={(e) => {
                      console.error("Error cargando imagen:", getImageUrl(image.image_url));
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x300/e2e8f0/475569?text=Error+de+imagen";
                    }}
                  />

                  {/* Badge portada */}
                  {image.is_cover && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-xs font-semibold text-white shadow-md">
                      <Star className="h-3 w-3 fill-white" />
                      Portada
                    </div>
                  )}

                  {/* Caption */}
                  {image.caption && (
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{image.caption}</p>
                  )}

                  {/* Acciones */}
                  <div className="mt-3 flex gap-2">
                    {!image.is_cover && (
                      <button
                        onClick={() => handleSetCover(image)}
                        disabled={loadingAction}
                        className="flex-1 rounded-lg border border-amber-200 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-50 disabled:opacity-50"
                      >
                        <Star className="inline h-3 w-3 mr-1" />
                        Portada
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteImage(image)}
                      disabled={loadingAction}
                      className="flex-1 rounded-lg border border-red-200 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="inline h-3 w-3 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Indicador de orden */}
          {images.length > 1 && (
            <p className="mt-4 text-center text-xs text-slate-400">
              💡 Arrastra las imágenes para reordenar su apariencia en la galería pública
            </p>
          )}
        </>
      )}
    </div>
  );
}