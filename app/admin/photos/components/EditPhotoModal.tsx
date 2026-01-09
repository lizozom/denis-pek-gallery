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
  const [heroEligible, setHeroEligible] = useState(photo.hero_eligible || false);
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

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = photo.src;

      // Upload new file if selected
      if (file) {
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
        imageUrl = url;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('alt', alt);
      formData.append('category', category);
      formData.append('src', imageUrl);
      formData.append('hero_eligible', heroEligible.toString());

      await onSave(formData);
    } catch {
      setErrors({ ...errors, file: 'Failed to upload image' });
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
                {previewUrl ? 'New Image' : 'Current Image'}
              </label>
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={previewUrl || photo.src}
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
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                  Replace Image
                </label>
                <input
                  id="file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  disabled={isLoading || isUploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to keep current image</p>
                {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
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
  );
}
