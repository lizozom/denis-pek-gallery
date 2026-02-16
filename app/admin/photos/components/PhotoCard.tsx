'use client';

import { useState } from 'react';
import type { GalleryImage } from '@/lib/gallery';
import PhotoForm from './PhotoForm';

interface PhotoCardProps {
  photo: GalleryImage;
  isReordering: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  onDragStart?: (e: React.DragEvent, id: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: number) => void;
  isDragging?: boolean;
  isLoading?: boolean;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
}

export default function PhotoCard({
  photo,
  isReordering,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
  isLoading = false,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect,
}: PhotoCardProps) {
  const [imageError, setImageError] = useState(false);

  if (isEditing) {
    return (
      <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
        <PhotoForm
          initialData={photo}
          onSubmit={onSave}
          onCancel={onCancel}
          submitLabel="Save Changes"
          isLoading={isLoading}
        />
      </div>
    );
  }

  const handleCardClick = () => {
    if (isSelectionMode && onToggleSelect) {
      onToggleSelect(photo.id);
    } else if (!isReordering) {
      onEdit();
    }
  };

  return (
    <div
      draggable={isReordering}
      onDragStart={(e) => onDragStart?.(e, photo.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, photo.id)}
      onClick={handleCardClick}
      className={`group relative bg-white border-2 rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
        isReordering ? 'cursor-move hover:scale-105 hover:shadow-xl border-gray-200 hover:border-gray-400' : ''
      } ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'} ${
        isSelectionMode || !isReordering ? 'cursor-pointer' : ''
      } ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:shadow-md hover:border-gray-300'}`}
    >
      {/* Selection checkbox */}
      {isSelectionMode && (
        <div className="absolute top-3 left-3 z-20">
          <div
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white/90 border-gray-300 hover:border-blue-400'
            }`}
          >
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Reorder drag indicator */}
      {isReordering && (
        <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm rounded-md px-2.5 py-1.5 shadow-lg border border-gray-200">
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      )}

      {/* Image container */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {/* Error state */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <svg
                className="mx-auto h-10 w-10 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-gray-400 mt-2">Failed to load</p>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 z-10" />

        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.alt}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Card info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 truncate" title={photo.title}>
            {photo.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">ID: {photo.id}</p>
        </div>

      </div>

    </div>
  );
}
