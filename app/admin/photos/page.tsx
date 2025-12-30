import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getGalleryPhotos } from '@/lib/db';
import PhotoManagement from './components/PhotoManagement';

export default async function PhotosPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  // Include hidden photos in admin view so admins can manage all photos
  const photos = await getGalleryPhotos(true);

  return <PhotoManagement initialPhotos={photos} />;
}
