'use client';

import { AdminHeader } from '@/components/admin/admin-header';
import { ThemeProvider } from '@/components/layout/theme-provider';
import type { User } from '@/types/auth';

// Mock user data for preview
const mockUser: User = {
  id: '1',
  email: 'admin@hamsoya.com',
  name: 'Admin User',
  role: 'ADMIN',
  profile_image_url: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_verified: true,
};

export default function ModernHeaderPreview() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        <AdminHeader user={mockUser} />

        {/* Demo content to show the header in context */}
        <div className="container mx-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold gradient-text">
                Modern Admin Header
              </h1>
              <p className="text-lg text-muted-foreground">
                Improved hover effects, better spacing, and modern UI design
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-3">✨ Improvements Made</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Modern hover effects with subtle animations</li>
                  <li>• Reduced gaps in dropdown menus</li>
                  <li>• Improved visual hierarchy</li>
                  <li>• Better color contrast and readability</li>
                  <li>• Consistent spacing throughout</li>
                  <li>• Glass morphism effects</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-3">🎯 Interactive Elements</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Search bar with Ctrl+K shortcut</li>
                  <li>• Notifications dropdown</li>
                  <li>• Theme toggle dropdown</li>
                  <li>• User profile menu</li>
                  <li>• Quick actions sheet</li>
                  <li>• Command palette</li>
                </ul>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card text-center">
              <h3 className="text-lg font-semibold mb-3">🚀 Try the Interactive Elements</h3>
              <p className="text-muted-foreground">
                Click on the notification bell, user avatar, theme toggle, or press Ctrl+K to test the improved UI components.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
