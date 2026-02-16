'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/gallery';

interface EditPhotoModalProps {
  photo: GalleryImage;
  onSave: (formData: FormData) => Promise<void>;
  onDelete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EditPhotoModal({
  photo,
  onSave,
  onDelete,
  onCancel,
  isLoading = false,
}: EditPhotoModalProps) {
  const [title, setTitle] = useState(photo.title);
  const [alt, setAlt] = useState(photo.alt);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!alt.trim()) {
      newErrors.alt = 'Alt text is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('alt', alt);
      formData.append('category', '');
      formData.append('src', photo.src);
      formData.append('hero_eligible', 'false');

      await onSave(formData);
    } catch {
      setErrors({ submit: 'Failed to save changes' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Edit Photo</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Image Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Image
              </label>
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p><span className="font-medium">ID:</span> {photo.id}</p>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} id="edit-photo-form" className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50"
                  placeholder="Photo title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text *
                </label>
                <input
                  id="alt"
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50"
                  placeholder="Describe image for accessibility"
                />
                {errors.alt && <p className="mt-1 text-sm text-red-600">{errors.alt}</p>}
              </div>

            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onDelete}
              disabled={isLoading || isUploading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              Delete
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading || isUploading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-photo-form"
                disabled={isLoading || isUploading}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
