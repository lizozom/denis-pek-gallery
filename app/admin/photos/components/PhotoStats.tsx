'use client';

import type { GalleryImage } from '@/lib/gallery';

interface PhotoStatsProps {
  photos: GalleryImage[];
}

export default function PhotoStats({ photos }: PhotoStatsProps) {
  const total = photos.length;

  // Count photos by category
  const categoryCounts = photos.reduce((acc, photo) => {
    acc[photo.category] = (acc[photo.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {/* Total photos */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">Total Photos</p>
            <p className="text-3xl font-bold mt-2">{total}</p>
          </div>
          <div className="bg-white/10 rounded-full p-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Category breakdowns */}
      {categories.map(([category, count], index) => {
        const colors = [
          'from-blue-500 to-blue-600',
          'from-green-500 to-green-600',
          'from-purple-500 to-purple-600',
          'from-orange-500 to-orange-600',
        ];
        const color = colors[index % colors.length];

        return (
          <div
            key={category}
            className={`bg-gradient-to-br ${color} rounded-lg p-5 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/90">{category}</p>
                <p className="text-3xl font-bold mt-2">{count}</p>
                <p className="text-xs text-white/70 mt-1">
                  {Math.round((count / total) * 100)}% of total
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
