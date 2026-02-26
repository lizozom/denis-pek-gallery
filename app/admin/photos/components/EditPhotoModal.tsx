'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryImage, MatColor, MatThickness } from '@/lib/gallery';
import { getFrameStyles } from '@/lib/gallery';

interface EditPhotoModalProps {
  photo: GalleryImage;
  onSave: (formData: FormData) => Promise<void>;
  onDelete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const COLOR_OPTIONS: { value: MatColor; label: string; swatch: string }[] = [
  { value: 'none', label: 'None', swatch: 'bg-gray-200 border-dashed' },
  { value: 'black', label: 'Black', swatch: 'bg-black' },
  { value: 'white', label: 'White', swatch: 'bg-white border-gray-300' },
];

const THICKNESS_OPTIONS: { value: MatThickness; label: string }[] = [
  { value: 'thin', label: 'Thin' },
  { value: 'medium', label: 'Medium' },
  { value: 'thick', label: 'Thick' },
];

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

  const [ppColor, setPpColor] = useState<MatColor>(photo.passepartout_color || 'none');
  const [ppThickness, setPpThickness] = useState<MatThickness>(photo.passepartout_thickness || 'none');
  const [frameColor, setFrameColor] = useState<MatColor>(photo.frame_color || 'none');
  const [frameThickness, setFrameThickness] = useState<MatThickness>(photo.frame_thickness || 'none');

  const previewImage: GalleryImage = {
    ...photo,
    passepartout_color: ppColor,
    passepartout_thickness: ppThickness,
    frame_color: frameColor,
    frame_thickness: frameThickness,
  };
  const frameStyles = getFrameStyles(previewImage);

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
      formData.append('passepartout_color', ppColor);
      formData.append('passepartout_thickness', ppThickness);
      formData.append('frame_color', frameColor);
      formData.append('frame_thickness', frameThickness);

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
              <div className="w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center p-4">
                <div style={frameStyles || undefined} className="inline-block">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={400}
                    height={400}
                    className="block object-cover"
                    unoptimized
                  />
                </div>
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

              {/* Passepartout */}
              <fieldset className="border border-gray-200 rounded-md p-3">
                <legend className="text-sm font-medium text-gray-700 px-1">Passepartout (Mat)</legend>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">Color</span>
                    <div className="flex gap-2 mt-1">
                      {COLOR_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPpColor(opt.value)}
                          className={`w-7 h-7 rounded-full border-2 ${opt.swatch} ${
                            ppColor === opt.value ? 'ring-2 ring-offset-1 ring-blue-500' : ''
                          }`}
                          title={opt.label}
                        />
                      ))}
                    </div>
                  </div>
                  {ppColor !== 'none' && (
                    <div>
                      <span className="text-xs text-gray-500">Thickness</span>
                      <div className="flex gap-2 mt-1">
                        {THICKNESS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setPpThickness(opt.value)}
                            className={`px-3 py-1 text-xs rounded-md border ${
                              ppThickness === opt.value
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </fieldset>

              {/* Frame */}
              <fieldset className="border border-gray-200 rounded-md p-3">
                <legend className="text-sm font-medium text-gray-700 px-1">Frame</legend>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">Color</span>
                    <div className="flex gap-2 mt-1">
                      {COLOR_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFrameColor(opt.value)}
                          className={`w-7 h-7 rounded-full border-2 ${opt.swatch} ${
                            frameColor === opt.value ? 'ring-2 ring-offset-1 ring-blue-500' : ''
                          }`}
                          title={opt.label}
                        />
                      ))}
                    </div>
                  </div>
                  {frameColor !== 'none' && (
                    <div>
                      <span className="text-xs text-gray-500">Thickness</span>
                      <div className="flex gap-2 mt-1">
                        {THICKNESS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFrameThickness(opt.value)}
                            className={`px-3 py-1 text-xs rounded-md border ${
                              frameThickness === opt.value
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </fieldset>

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
