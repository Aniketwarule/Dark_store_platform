'use client';

import { cn } from '@/lib/utils';
import {
  BarChart3,
  Box,
  ClipboardList,
  Home,
  LogOut,
  Settings,
  Store,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { ThemeToggle } from './theme-toggle';
import { useAuthStore } from '@/lib/store';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Box, label: 'Inventory', href: '/dashboard/inventory' },
  { icon: ClipboardList, label: 'Orders', href: '/dashboard/orders' },
  { icon: Users, label: 'Staff', href: '/dashboard/staff' },
  { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex h-screen flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Store className="mr-2 h-6 w-6" />
        <span className="font-semibold">Dark Store</span>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start')}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
          <ThemeToggle />
        </div>
        <Separator className="my-4" />
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}