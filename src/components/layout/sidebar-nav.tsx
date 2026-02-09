'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { navItems } from '@/lib/data';
import type { NavItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item: NavItem) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={{ children: item.title, className: 'bg-primary text-primary-foreground' }}
            className={cn(
              'group',
              pathname === item.href &&
                'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
            )}
          >
            <Link href={item.href}>
              <item.icon
                className={cn(
                  'group-hover:text-primary-foreground',
                  pathname === item.href ? 'text-primary-foreground' : 'text-primary'
                )}
              />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
