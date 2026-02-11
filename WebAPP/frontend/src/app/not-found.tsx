'use client';

import Link from 'next/link';

/**
 * Global 404 Not Found page
 * Automatically shown when a route doesn't exist
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8 text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto bg-blue-100 rounded-full">
          <svg
            className="w-10 h-10 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
        
        <h2 className="mt-2 text-2xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        
        <p className="mt-4 text-gray-600">
          Sorry, we couldn't find the page you're looking for.
          The page may have been moved or deleted.
        </p>
        
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
