// components/AdminTourGallery.tsx
import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Star, Image as ImageIcon, X, GripVertical, Upload, Loader2 } from "lucide-react";
import type { GalleryImage, Tour } from "../types";
import {
  getGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
  uploadGalleryImages,
} from "../services/storageService";

interface AdminTourGalleryProps {
  tour: Tour;
  onClose: () => void;
}

export default function AdminTourGallery({ tour, onClose }: AdminTourGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadGallery();
  }, [tour.id]);

  const loadGallery = async () => {
    try {
      const galleryImages = await getGalleryImages(tour.id);
      setImages(galleryImages);
    } catch (error) {
      console.error("Error cargando galería:", error);
    } finally {
      setLoading(false);
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
    if (selectedFiles.length === 0) return;

    const token = localStorage.getItem("token");
    console.log("Token presente:", !!token);
    
    setUploading(true);
    try {
      const fileList = Object.values(selectedFiles) as unknown as FileList;
      const uploadedImages = await uploadGalleryImages(tour.id, fileList, captions);
      setImages(prev => [...uploadedImages, ...prev]);
      setSelectedFiles([]);
      setCaptions([]);
      setShowAddForm(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
      alert("Error al subir las imágenes");
    } finally {
      setUploading(false);
    }
  };

  const handleSetCover = async (image: GalleryImage) => {
    setLoadingAction(true);
    try {
      await updateGalleryImage(image.id, { is_cover: true });
      setImages(prev => prev.map(img => ({
        ...img,
        is_cover: img.id === image.id,
      })));
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
      setImages(prev => prev.filter(img => img.id !== image.id));
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
    } catch (error) {
      console.error("Error reordenando:", error);
      await loadGallery();
    }
    setDragOverIndex(null);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setCaptions(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded-2xl bg-white p-8">
          <div className="animate-pulse text-center">Cargando galería...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <div className="relative mx-auto max-w-6xl rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6 rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-semibold">Galería de {tour.title}</h2>
              <p className="text-sm text-slate-500 mt-1">
                Administra las imágenes de este tour
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Botón agregar */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="mb-6 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4" />
              Subir Imágenes
            </button>

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
              <div className="text-center py-12 text-slate-500">
                <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p>No hay imágenes en la galería de este tour</p>
                <p className="text-sm">Haz clic en "Subir Imágenes" para comenzar</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

                    {/* Imagen */}
                    <img
                      src={image.image_url}
                      alt={image.caption || `Imagen ${index + 1}`}
                      className="h-40 w-full rounded-lg object-cover"
                      onError={(e) => {
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
                💡 Arrastra las imágenes para reordenar su apariencia en la galería
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}