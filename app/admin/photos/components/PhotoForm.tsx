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

interface FileEntry {
  file: File;
  previewUrl: string;
  title: string;
  alt: string;
}

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
  const [uploadProgress, setUploadProgress] = useState('');

  // Multi-upload state
  const [files, setFiles] = useState<FileEntry[]>([]);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_SIZE = 10 * 1024 * 1024;

  const validateFile = (f: File): string | null => {
    if (!ALLOWED_TYPES.includes(f.type)) return 'Only JPEG, PNG, WebP, and GIF files are allowed';
    if (f.size > MAX_SIZE) return 'File size must be less than 10MB';
    return null;
  };

  // Single file (edit mode)
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
    }
  };

  // Multi file (add mode)
  const handleMultiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newEntries: FileEntry[] = [];
    const fileErrors: string[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const f = selectedFiles[i];
      const error = validateFile(f);
      if (error) {
        fileErrors.push(`${f.name}: ${error}`);
        continue;
      }
      newEntries.push({
        file: f,
        previewUrl: URL.createObjectURL(f),
        title: f.name.replace(/\.[^/.]+$/, ''),
        alt: '',
      });
    }

    if (fileErrors.length > 0) {
      setErrors({ ...errors, file: fileErrors.join('; ') });
    } else {
      setErrors({ ...errors, file: '' });
    }

    setFiles((prev) => [...prev, ...newEntries]);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateFileField = (index: number, field: 'title' | 'alt', value: string) => {
    setFiles((prev) => prev.map((entry, i) => i === index ? { ...entry, [field]: value } : entry));
  };

  // Edit mode submit (single photo)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!alt.trim()) newErrors.alt = 'Alt text is required';
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
      await onSubmit(formData);
    } catch {
      setErrors({ file: 'Failed to upload image' });
    } finally {
      setIsUploading(false);
    }
  };

  // Add mode submit (multi photo)
  const handleMultiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrors({ file: 'Please select at least one image' });
      return;
    }

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const entry = files[i];
        setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);

        const uploadFormData = new FormData();
        uploadFormData.append('file', entry.file);
        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          setErrors({ file: `Failed to upload ${entry.file.name}: ${error.error}` });
          continue;
        }
        const { url } = await uploadResponse.json();

        const formData = new FormData();
        formData.append('title', entry.title || entry.file.name.replace(/\.[^/.]+$/, ''));
        formData.append('alt', entry.alt || entry.title || entry.file.name.replace(/\.[^/.]+$/, ''));
        formData.append('category', '');
        formData.append('src', url);
        formData.append('hero_eligible', 'false');
        await onSubmit(formData);
      }
      setUploadProgress('');
    } catch {
      setErrors({ file: 'Failed to upload images' });
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  if (isEditMode) {
    return (
      <form onSubmit={handleEditSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
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
              Replace Image
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
                <Image src={previewUrl} alt="Preview" width={200} height={200} className="rounded-lg object-cover" unoptimized />
              </div>
            )}
          </div>

        </div>

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

  // Add mode — multi-upload
  return (
    <form onSubmit={handleMultiSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="mb-6">
        <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-1">
          Select Images
        </label>
        <input
          id="files"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleMultiFileChange}
          disabled={isLoading || isUploading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
        {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
      </div>

      {files.length > 0 && (
        <div className="space-y-4 mb-6">
          <p className="text-sm text-gray-500">{files.length} photo{files.length !== 1 ? 's' : ''} selected</p>
          {files.map((entry, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <Image
                src={entry.previewUrl}
                alt="Preview"
                width={80}
                height={80}
                className="rounded object-cover flex-shrink-0"
                unoptimized
              />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={entry.title}
                  onChange={(e) => updateFileField(index, 'title', e.target.value)}
                  placeholder="Title"
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                />
                <input
                  type="text"
                  value={entry.alt}
                  onChange={(e) => updateFileField(index, 'alt', e.target.value)}
                  placeholder="Alt text"
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadProgress && (
        <div className="mb-4 text-sm text-gray-600 font-medium">{uploadProgress}</div>
      )}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} disabled={isLoading || isUploading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Cancel
        </button>
        <button type="submit" disabled={isLoading || isUploading || files.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          {isUploading ? uploadProgress || 'Uploading...' : isLoading ? 'Saving...' : `Upload ${files.length || ''} Photo${files.length !== 1 ? 's' : ''}`}
        </button>
      </div>
    </form>
  );
}
