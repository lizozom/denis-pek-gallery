'use client';

import { useState } from 'react';
import type { GalleryImage } from '@/lib/gallery';

interface PhotoFormProps {
  initialData?: Partial<GalleryImage>;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  isLoading?: boolean;
}

const CATEGORIES = ['Landscape', 'Portrait', 'Urban', 'Nature'];

export default function PhotoForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
  isLoading = false,
}: PhotoFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [alt, setAlt] = useState(initialData?.alt || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [src, setSrc] = useState(initialData?.src || '');
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

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="https://example.com/image.jpg"
          />
          {errors.src && <p className="mt-1 text-sm text-red-600">{errors.src}</p>}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
