'use client';

interface ImageSkeletonProps {
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export default function ImageSkeleton({ aspectRatio = 'square' }: ImageSkeletonProps) {
  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  };

  return (
    <div className={`w-full ${aspectClasses[aspectRatio]} bg-gray-200 animate-pulse rounded-sm overflow-hidden`}>
      <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_200%] animate-shimmer" />
    </div>
  );
}
