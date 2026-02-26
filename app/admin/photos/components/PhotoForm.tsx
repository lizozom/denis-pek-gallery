'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryImage, MatColor, MatThickness } from '@/lib/gallery';
import { getFrameStyles } from '@/lib/gallery';

interface PhotoFormProps {
  initialData?: Partial<GalleryImage>;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  isLoading?: boolean;
}

const COLOR_OPTIONS: { value: MatColor; label: string; swatch: string }[] = [
  { value: 'none', label: 'None', swatch: 'bg-gray-200 border-dashed' },
  { value: 'black', label: 'Black', swatch: 'bg-black' },
  { value: 'white', label: 'White', swatch: 'bg-white border-gray-300' },
];

const THICKNESS_OPTIONS: { value: MatThickness; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'thin', label: 'Thin' },
  { value: 'medium', label: 'Medium' },
  { value: 'thick', label: 'Thick' },
];

export default function PhotoForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
  isLoading = false,
}: PhotoFormProps) {
  const isEditMode = !!initialData;
  const [title, setTitle] = useState(initialData?.title || '');
  const [alt, setAlt] = useState(initialData?.alt || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [ppColor, setPpColor] = useState<MatColor>(initialData?.passepartout_color || 'none');
  const [ppThickness, setPpThickness] = useState<MatThickness>(initialData?.passepartout_thickness || 'none');
  const [frameColor, setFrameColor] = useState<MatColor>(initialData?.frame_color || 'black');
  const [frameThickness, setFrameThickness] = useState<MatThickness>(initialData?.frame_thickness || 'thick');

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_SIZE = 10 * 1024 * 1024;

  const validateFile = (f: File): string | null => {
    if (!ALLOWED_TYPES.includes(f.type)) return 'Only JPEG, PNG, WebP, and GIF files are allowed';
    if (f.size > MAX_SIZE) return 'File size must be less than 10MB';
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const error = validateFile(selectedFile);
      if (error) {
        setErrors({ ...errors, file: error });
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setErrors({ ...errors, file: '' });
      if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  // Build a preview image object for getFrameStyles
  const previewImage: GalleryImage = {
    id: 0,
    src: previewUrl || initialData?.src || '',
    alt: '',
    title: '',
    category: '',
    passepartout_color: ppColor,
    passepartout_thickness: ppThickness,
    frame_color: frameColor,
    frame_thickness: frameThickness,
  };
  const frameStyles = getFrameStyles(previewImage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';

    if (!isEditMode && !file) newErrors.file = 'Please select an image';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsUploading(true);
    try {
      let url = initialData?.src || '';
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          setErrors({ file: error.error || 'Failed to upload image' });
          setIsUploading(false);
          return;
        }
        ({ url } = await uploadResponse.json());
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('alt', alt);
      formData.append('category', '');
      formData.append('src', url);
      formData.append('hero_eligible', 'false');
      formData.append('passepartout_color', ppColor);
      formData.append('passepartout_thickness', ppThickness);
      formData.append('frame_color', frameColor);
      formData.append('frame_thickness', frameThickness);
      await onSubmit(formData);
    } catch {
      setErrors({ file: 'Failed to upload image' });
    } finally {
      setIsUploading(false);
    }
  };

  const showImagePreview = previewUrl || (isEditMode && initialData?.src);
  const imageSrc = previewUrl || initialData?.src || '';

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
          <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
            Alt Text
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
            {isEditMode ? 'Replace Image' : 'Image *'}
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
          {showImagePreview && (
            <div className="mt-3 inline-block">
              <div style={frameStyles || undefined} className="inline-block">
                <Image src={imageSrc} alt="Preview" width={200} height={200} className="rounded-sm object-cover block" unoptimized />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Passepartout & Frame options */}
      {showImagePreview && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Passepartout */}
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-medium text-gray-700 px-1">Passepartout (Mat)</legend>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500">Color</span>
                <div className="flex gap-2 mt-1">
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPpColor(opt.value)}
                      className={`w-8 h-8 rounded-full border-2 ${opt.swatch} ${
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
                    {THICKNESS_OPTIONS.filter((t) => t.value !== 'none').map((opt) => (
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
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-medium text-gray-700 px-1">Frame</legend>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500">Color</span>
                <div className="flex gap-2 mt-1">
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFrameColor(opt.value)}
                      className={`w-8 h-8 rounded-full border-2 ${opt.swatch} ${
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
                    {THICKNESS_OPTIONS.filter((t) => t.value !== 'none').map((opt) => (
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
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} disabled={isLoading || isUploading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Cancel
        </button>
        <button type="submit" disabled={isLoading || isUploading} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          {isUploading ? 'Uploading...' : isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
