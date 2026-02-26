'use server';

import { revalidatePath } from 'next/cache';
import {
  addGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  hideGalleryPhoto,
  reorderGalleryPhotos,
} from '@/lib/db';
import type { GalleryImage, MatColor, MatThickness } from '@/lib/gallery';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export interface ServerActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect('/admin/login');
  }
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/<script>/gi, '');
}

function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

export async function addPhotoAction(formData: FormData): Promise<ServerActionResponse<GalleryImage>> {
  await requireAuth();

  const title = sanitizeInput(formData.get('title') as string || '');
  const alt = sanitizeInput(formData.get('alt') as string || '');
  const category = sanitizeInput(formData.get('category') as string || '');
  const src = sanitizeInput(formData.get('src') as string || '');
  const hero_eligible = formData.get('hero_eligible') === 'true';
  const passepartout_color = (formData.get('passepartout_color') as MatColor) || 'none';
  const passepartout_thickness = (formData.get('passepartout_thickness') as MatThickness) || 'none';
  const frame_color = (formData.get('frame_color') as MatColor) || 'none';
  const frame_thickness = (formData.get('frame_thickness') as MatThickness) || 'none';

  if (!src) {
    return { success: false, error: 'Image URL is required' };
  }

  if (!isValidImageUrl(src)) {
    return { success: false, error: 'Invalid image URL' };
  }

  const newImage = await addGalleryPhoto({ title: title || 'Untitled', alt: alt || title || 'Photo', category, src, hero_eligible, passepartout_color, passepartout_thickness, frame_color, frame_thickness });

  if (!newImage) {
    return { success: false, error: 'Failed to add photo' };
  }

  revalidatePath('/admin/photos');
  revalidatePath('/[locale]', 'page');

  return { success: true, data: newImage };
}

export async function updatePhotoAction(
  id: number,
  formData: FormData
): Promise<ServerActionResponse> {
  await requireAuth();

  const title = sanitizeInput(formData.get('title') as string || '');
  const alt = sanitizeInput(formData.get('alt') as string || '');
  const category = sanitizeInput(formData.get('category') as string || '');
  const src = sanitizeInput(formData.get('src') as string || '');
  const hero_eligible = formData.get('hero_eligible') === 'true';
  const passepartout_color = (formData.get('passepartout_color') as MatColor) || 'none';
  const passepartout_thickness = (formData.get('passepartout_thickness') as MatThickness) || 'none';
  const frame_color = (formData.get('frame_color') as MatColor) || 'none';
  const frame_thickness = (formData.get('frame_thickness') as MatThickness) || 'none';

  if (!title || !alt || !src) {
    return { success: false, error: 'Title, alt text, and image are required' };
  }

  if (!isValidImageUrl(src)) {
    return { success: false, error: 'Invalid image URL' };
  }

  const updates = { title, alt, category, src, hero_eligible, passepartout_color, passepartout_thickness, frame_color, frame_thickness };
  const success = await updateGalleryPhoto(id, updates);

  if (!success) {
    return { success: false, error: 'Failed to update photo' };
  }

  revalidatePath('/admin/photos');
  revalidatePath('/[locale]', 'page');

  return { success: true };
}

export async function hidePhotoAction(id: number): Promise<ServerActionResponse> {
  await requireAuth();

  const success = await hideGalleryPhoto(id);

  if (!success) {
    return { success: false, error: 'Failed to hide photo' };
  }

  revalidatePath('/admin/photos');
  revalidatePath('/[locale]', 'page');

  return { success: true };
}

export async function deletePhotoAction(id: number, permanentDelete = false): Promise<ServerActionResponse> {
  await requireAuth();

  const success = permanentDelete
    ? await deleteGalleryPhoto(id)
    : await hideGalleryPhoto(id);

  if (!success) {
    return { success: false, error: permanentDelete ? 'Failed to delete photo' : 'Failed to hide photo' };
  }

  revalidatePath('/admin/photos');
  revalidatePath('/[locale]', 'page');

  return { success: true };
}

export async function reorderPhotosAction(newOrder: number[]): Promise<ServerActionResponse> {
  await requireAuth();

  if (!Array.isArray(newOrder) || newOrder.length === 0) {
    return { success: false, error: 'Invalid order data' };
  }

  const success = await reorderGalleryPhotos(newOrder);

  if (!success) {
    return { success: false, error: 'Failed to save new order' };
  }

  revalidatePath('/admin/photos');
  revalidatePath('/[locale]', 'page');

  return { success: true };
}

export async function bulkDeletePhotosAction(
  ids: number[],
  permanentDelete = false
): Promise<ServerActionResponse<{ deleted: number; failed: number }>> {
  await requireAuth();

  if (!Array.isArray(ids) || ids.length === 0) {
    return { success: false, error: 'No photos selected' };
  }

  let deleted = 0;
  let failed = 0;

  for (const id of ids) {
    const success = permanentDelete
      ? await deleteGalleryPhoto(id)
      : await hideGalleryPhoto(id);

    if (success) {
      deleted++;
    } else {
      failed++;
    }
  }

  revalidatePath('/admin/photos');
  revalidatePath('/[locale]', 'page');

  if (failed === ids.length) {
    return { success: false, error: 'Failed to delete any photos' };
  }

  return { success: true, data: { deleted, failed } };
}
