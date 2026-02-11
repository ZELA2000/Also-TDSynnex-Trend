'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Global error page for unhandled errors
 * Automatically shown when an error occurs during rendering
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Global error:', error);
    
    // TODO: Log to error monitoring service (Sentry, LogRocket, etc.)
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
          <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-red-100 rounded-full">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h1 className="mt-6 text-3xl font-bold text-center text-gray-900">
              Something went wrong!
            </h1>
            
            <p className="mt-4 text-center text-gray-600">
              We're sorry for the inconvenience. An unexpected error has occurred.
            </p>

            {process.env.NODE_ENV === 'development' && error && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <p className="text-xs font-semibold text-red-800 mb-2">Error Details:</p>
                <p className="text-xs font-mono text-red-700 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-600 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={reset}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 text-center border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Dashboard
              </Link>
            </div>
            
            <p className="mt-6 text-xs text-center text-gray-500">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
