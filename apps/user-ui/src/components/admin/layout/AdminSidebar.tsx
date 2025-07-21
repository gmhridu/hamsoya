'use client';

import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  Image,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '../../../lib/utils';

interface AdminSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

/**
 * Admin sidebar navigation component
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}) => {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: <BarChart3 className="h-5 w-5" />,
      exact: true,
    },
    {
      title: 'Hero',
      href: '/admin/hero',
      icon: <Image className="h-5 w-5" />,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: 'Products',
      href: '/admin/products',
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: 'Feedback',
      href: '/admin/feedback',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-brand-primary">
              Hamsoya Admin
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium',
                    (
                      item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    )
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute bottom-4 w-full px-4">
          <Link
            href="/"
            className="flex w-full items-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <Home className="h-5 w-5" />
            <span>Back to Website</span>
          </Link>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden transform border-r bg-white transition-all duration-300 ease-in-out lg:block',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-brand-primary">
                Hamsoya Admin
              </span>
            </Link>
          )}
          <button
            onClick={onToggleCollapse}
            className={cn(
              'rounded-full p-1 hover:bg-gray-100',
              isCollapsed && 'mx-auto'
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium',
                    isCollapsed ? 'justify-center' : 'space-x-3',
                    (
                      item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    )
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute bottom-4 w-full px-4">
          <Link
            href="/"
            className={cn(
              'flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200',
              isCollapsed ? 'justify-center' : 'space-x-2 w-full'
            )}
            title={isCollapsed ? 'Back to Website' : undefined}
          >
            <Home className="h-5 w-5" />
            {!isCollapsed && <span>Back to Website</span>}
          </Link>
        </div>
      </div>
    </>
  );
};
