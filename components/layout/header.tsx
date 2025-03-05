'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <div className="flex h-14 items-center border-b px-4 gap-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex-1 ml-4">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8"
          />
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <Bell className="h-4 w-4" />
      </Button>
    </div>
  );
}