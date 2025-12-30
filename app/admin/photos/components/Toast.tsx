'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, type === 'error' ? 5000 : 3000);

    return () => clearTimeout(timer);
  }, [type, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg transition-all z-50 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
      }`}
    >
      <div className="flex items-center gap-2">
        {type === 'error' ? (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-80 text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
