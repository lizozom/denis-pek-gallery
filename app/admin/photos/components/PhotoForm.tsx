'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  const [heroEligible, setHeroEligible] = useState(initialData?.hero_eligible || false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!alt.trim()) {
      newErrors.alt = 'Alt text is required';
    }

    if (!file) {
      newErrors.file = 'Please select an image file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors({ ...errors, file: 'Only JPEG, PNG, WebP, and GIF files are allowed' });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, file: 'File size must be less than 10MB' });
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setErrors({ ...errors, file: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !file) {
      return;
    }

    setIsUploading(true);

    try {
      // Upload file first
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        setErrors({ ...errors, file: error.error || 'Failed to upload image' });
        setIsUploading(false);
        return;
      }

      const { url } = await uploadResponse.json();

      // Now submit the form with the uploaded URL
      const formData = new FormData();
      formData.append('title', title);
      formData.append('alt', alt);
      formData.append('category', category);
      formData.append('src', url);
      formData.append('hero_eligible', heroEligible.toString());

      await onSubmit(formData);
    } catch {
      setErrors({ ...errors, file: 'Failed to upload image' });
    } finally {
      setIsUploading(false);
    }
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
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Image *
          </label>
          <input
            id="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={isLoading || isUploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
          {previewUrl && (
            <div className="mt-3">
              <Image
                src={previewUrl}
                alt="Preview"
                width={200}
                height={200}
                className="rounded-lg object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={heroEligible}
              onChange={(e) => setHeroEligible(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-sm font-medium text-gray-700">
              Hero Eligible
            </span>
            <span className="text-sm text-gray-500">
              (Use this image as the homepage hero background)
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading || isUploading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
