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
}: PhotoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
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

  return (
    <div
      draggable={isReordering}
      onDragStart={(e) => onDragStart?.(e, photo.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, photo.id)}
      className={`group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
        isReordering ? 'cursor-move hover:scale-105 hover:shadow-xl hover:border-gray-400' : 'hover:shadow-md hover:border-gray-300'
      } ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}`}
    >
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
        {/* Loading placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}

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

        {/* Image */}
        <img
          src={photo.src}
          alt={photo.alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
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

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full border border-gray-200">
            {photo.category}
          </span>
        </div>
      </div>

      {/* Hover overlay with action buttons */}
      {!isReordering && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900/90 backdrop-blur-sm rounded-md hover:bg-gray-800 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
          >
            <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600/90 backdrop-blur-sm rounded-md hover:bg-red-700 transition-all transform translate-y-2 group-hover:translate-y-0 delay-75 shadow-lg"
          >
            <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
