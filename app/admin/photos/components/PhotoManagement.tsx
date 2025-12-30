'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GalleryImage } from '@/lib/gallery';
import PhotoCard from './PhotoCard';
import PhotoForm from './PhotoForm';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditPhotoModal from './EditPhotoModal';
import Toast from './Toast';
import PhotoStats from './PhotoStats';
import {
  addPhotoAction,
  updatePhotoAction,
  deletePhotoAction,
  reorderPhotosAction,
} from '../actions';

interface PhotoManagementProps {
  initialPhotos: GalleryImage[];
}

export default function PhotoManagement({ initialPhotos }: PhotoManagementProps) {
  const router = useRouter();
  // Photos are already ordered newest first from database (position DESC)
  const [photos, setPhotos] = useState<GalleryImage[]>([...initialPhotos]);
  const [editingPhoto, setEditingPhoto] = useState<GalleryImage | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<GalleryImage | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [hasReordered, setHasReordered] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleAddPhoto = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await addPhotoAction(formData);
      if (result.success && result.data) {
        // Optimistic update: Add new photo at the beginning (newest first)
        setPhotos([result.data, ...photos]);
        showToast('Photo added successfully', 'success');
        setIsAdding(false);
        // Still refresh to ensure server state is accurate
        router.refresh();
      } else {
        showToast(result.error || 'Failed to add photo', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePhoto = async (id: number, formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await updatePhotoAction(id, formData);
      if (result.success) {
        // Optimistic update: Update photo in state
        setPhotos(photos.map(photo =>
          photo.id === id
            ? {
                ...photo,
                title: formData.get('title') as string,
                alt: formData.get('alt') as string,
                category: formData.get('category') as string,
                src: formData.get('src') as string,
              }
            : photo
        ));
        showToast('Photo updated successfully', 'success');
        setEditingPhoto(null);
        router.refresh();
      } else {
        showToast(result.error || 'Failed to update photo', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (permanentDelete: boolean) => {
    if (!deleteConfirm) return;

    setIsLoading(true);
    try {
      const result = await deletePhotoAction(deleteConfirm.id, permanentDelete);
      if (result.success) {
        // Optimistic update: Remove photo from state
        setPhotos(photos.filter(photo => photo.id !== deleteConfirm.id));
        showToast(
          permanentDelete ? 'Photo deleted permanently' : 'Photo hidden from gallery',
          'success'
        );
        setDeleteConfirm(null);
        router.refresh();
      } else {
        showToast(result.error || 'Failed to delete photo', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const draggedIndex = photos.findIndex((p) => p.id === draggedId);
    const targetIndex = photos.findIndex((p) => p.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      return;
    }

    const newPhotos = [...photos];
    const [draggedPhoto] = newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(targetIndex, 0, draggedPhoto);

    setPhotos(newPhotos);
    setDraggedId(null);
    setHasReordered(true);
  };

  const handleSaveOrder = async () => {
    setIsLoading(true);
    try {
      const newOrder = photos.map((p) => p.id);
      const result = await reorderPhotosAction(newOrder);
      if (result.success) {
        showToast('Order saved successfully', 'success');
        setHasReordered(false);
        setIsReordering(false);
        router.refresh();
      } else {
        showToast(result.error || 'Failed to save order', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReorder = () => {
    setIsReordering(false);
    setHasReordered(false);
    setPhotos(initialPhotos);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Photo Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your gallery photos</p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Gallery
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        {!isAdding && !editingPhoto && <PhotoStats photos={photos} />}

        {/* Action buttons */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-3">
            {!isReordering && (
              <button
                onClick={() => setIsAdding(true)}
                disabled={isAdding || editingPhoto !== null}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Photo
              </button>
            )}
            {!isAdding && editingPhoto === null && (
              <button
                onClick={() => setIsReordering(!isReordering)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                {isReordering ? 'Cancel Reordering' : 'Reorder Photos'}
              </button>
            )}
          </div>

          {isReordering && hasReordered && (
            <button
              onClick={handleSaveOrder}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isLoading ? 'Saving...' : 'Save Order'}
            </button>
          )}
        </div>

        {isReordering && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-md p-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong className="font-semibold">Reorder Mode Active:</strong> Drag and drop photos to rearrange them, then click "Save Order" to save your changes.
                </p>
              </div>
            </div>
          </div>
        )}

        {isAdding && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Photo</h2>
            <PhotoForm
              onSubmit={handleAddPhoto}
              onCancel={() => setIsAdding(false)}
              submitLabel="Add Photo"
              isLoading={isLoading}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isReordering={isReordering}
              isEditing={false}
              onEdit={() => setEditingPhoto(photo)}
              onDelete={() => setDeleteConfirm(photo)}
              onSave={() => Promise.resolve()}
              onCancel={() => {}}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={draggedId === photo.id}
              isLoading={false}
            />
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">No photos yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first photo to the gallery.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Photo
              </button>
            </div>
          </div>
        )}
      </main>

      {editingPhoto && (
        <EditPhotoModal
          photo={editingPhoto}
          onSave={(formData) => handleUpdatePhoto(editingPhoto.id, formData)}
          onCancel={() => setEditingPhoto(null)}
          isLoading={isLoading}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          photo={deleteConfirm}
          onConfirm={handleDeletePhoto}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={isLoading}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
