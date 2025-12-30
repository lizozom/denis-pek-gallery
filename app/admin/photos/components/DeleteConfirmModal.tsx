'use client';

import { useState } from 'react';
import type { GalleryImage } from '@/lib/gallery';

interface DeleteConfirmModalProps {
  photo: GalleryImage;
  onConfirm: (permanentDelete: boolean) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  photo,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const [permanentDelete, setPermanentDelete] = useState(false);

  const handleConfirm = async () => {
    await onConfirm(permanentDelete);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {permanentDelete ? 'Delete Photo Permanently' : 'Hide Photo from Gallery'}
        </h3>

        <div className="mb-4">
          <div className="aspect-square w-full max-w-xs mx-auto mb-4 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Title:</span> {photo.title}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Category:</span> {photo.category}
          </p>
        </div>

        {permanentDelete ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. The photo will be permanently removed from the database.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-800">
              The photo will be hidden from the gallery but will remain in the database. You can restore it later if needed.
            </p>
          </div>
        )}

        <div className="mb-6">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={permanentDelete}
              onChange={(e) => setPermanentDelete(e.target.checked)}
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">
              <span className="font-medium text-red-600">Delete permanently</span> instead of hiding
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              permanentDelete
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-gray-900 hover:bg-gray-800 focus:ring-gray-500'
            }`}
          >
            {isLoading ? (permanentDelete ? 'Deleting...' : 'Hiding...') : (permanentDelete ? 'Delete Permanently' : 'Hide Photo')}
          </button>
        </div>
      </div>
    </div>
  );
}
