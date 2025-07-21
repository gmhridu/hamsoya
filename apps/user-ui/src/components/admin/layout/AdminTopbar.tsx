'use client';

import { Bell, LogOut, Menu, Settings, User } from 'lucide-react';
import React from 'react';
import { useLogoutMutation } from '../../../store/authApi';
import { useAppSelector } from '../../../store/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

interface AdminTopbarProps {
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

/**
 * Admin topbar component with user menu and notifications
 */
export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  onMenuClick,
  onToggleSidebar,
  sidebarCollapsed,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'A';

  return (
    <header className="sticky top-0 z-20 border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Menu and toggle */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop sidebar toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hidden lg:flex"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Environment badge */}
          <Badge
            variant={
              process.env.NODE_ENV === 'production' ? 'default' : 'secondary'
            }
            className="hidden sm:inline-flex"
          >
            {process.env.NODE_ENV === 'production'
              ? 'Production'
              : 'Development'}
          </Badge>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs"></span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-brand-primary text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
