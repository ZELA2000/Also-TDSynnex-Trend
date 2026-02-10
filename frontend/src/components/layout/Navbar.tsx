'use client';

import { Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6">
      <div className="flex h-full items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscriptions, products, customers..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-gray-500 text-xs">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
