'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/gallery';

interface EditPhotoModalProps {
  photo: GalleryImage;
  onSave: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CATEGORIES = ['Landscape', 'Portrait', 'Urban', 'Nature'];

export default function EditPhotoModal({
  photo,
  onSave,
  onCancel,
  isLoading = false,
}: EditPhotoModalProps) {
  const [title, setTitle] = useState(photo.title);
  const [alt, setAlt] = useState(photo.alt);
  const [category, setCategory] = useState(photo.category);
  const [src, setSrc] = useState(photo.src);
  const [heroEligible, setHeroEligible] = useState(photo.hero_eligible || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!alt.trim()) {
      newErrors.alt = 'Alt text is required';
    }

    if (!src.trim()) {
      newErrors.src = 'Image URL is required';
    } else {
      try {
        const url = new URL(src);
        if (!['http:', 'https:'].includes(url.protocol)) {
          newErrors.src = 'URL must start with http:// or https://';
        }
      } catch {
        newErrors.src = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('alt', alt);
    formData.append('category', category);
    formData.append('src', src);
    formData.append('hero_eligible', heroEligible.toString());

    await onSave(formData);
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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

              <div>
                <label htmlFor="src" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  id="src"
                  type="url"
                  value={src}
                  onChange={(e) => setSrc(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.src && <p className="mt-1 text-sm text-red-600">{errors.src}</p>}
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={heroEligible}
                    onChange={(e) => setHeroEligible(e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500 disabled:opacity-50"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Hero Eligible
                  </span>
                  <span className="text-sm text-gray-500">
                    (Use as homepage hero)
                  </span>
                </label>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-photo-form"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
