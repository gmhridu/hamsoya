'use client';

import React from 'react';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useLogoutMutation } from '../../hooks/useAuth';
import useUser from '../../hooks/useAuthUser';
import { toast } from '../../lib/toast';

/**
 * Example dashboard page that demonstrates the authentication system
 * This page is protected and requires authentication
 */
const DashboardPage: React.FC = () => {
  const { data: user, isLoading } = useUser();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed', {
        description: 'Please try again',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary/5 via-white to-brand-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {logoutMutation.isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  User ID
                </label>
                <p className="text-gray-900 font-mono text-sm">{user?.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Authentication Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Authenticated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Session Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Auto-refresh Enabled
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Update Profile
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                Settings
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                Help & Support
              </button>
            </div>
          </div>
        </div>

        {/* Features Demo */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Authentication Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                ✅ Implemented Features
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Automatic token refresh with middleware</li>
                <li>• Redux state management with persistence</li>
                <li>• Persistent authentication state</li>
                <li>• Route protection with AuthGuard</li>
                <li>• Professional error handling</li>
                <li>• RTK Query integration</li>
                <li>• HTTP-only cookie support</li>
                <li>• Automatic logout on session expiry</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                🔧 Technical Implementation
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Next.js middleware for edge authentication</li>
                <li>• Redux Toolkit for state management</li>
                <li>• Next.js API routes for backend integration</li>
                <li>• TypeScript for type safety</li>
                <li>• Error boundaries for graceful failures</li>
                <li>• Redux Persist for state persistence</li>
                <li>• Professional UI components</li>
                <li>• Toast notifications for user feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap the page with AuthGuard to protect it
const ProtectedDashboardPage: React.FC = () => {
  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <DashboardPage />
    </AuthGuard>
  );
};

export default ProtectedDashboardPage;
