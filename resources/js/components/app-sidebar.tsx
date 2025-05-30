// layouts/app-sidebar.tsx

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Folder, BookOpen } from 'lucide-react';
import AppLogo from './app-logo';
import { type NavItem } from '@/types';

type PageProps = {
  permissions: string[];
  sidebarOpen: boolean;
  auth: {
    user: any;
    role: string;
  };
};

export function AppSidebar() {
  const { permissions, auth } = usePage<PageProps>().props;
  const { toggleSidebar } = useSidebar(); // ← para botón colapsable

  const hasPermission = (perm: string) => permissions.includes(perm);

  const mainNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutGrid,
    },
    ...(hasPermission('administrar') ? [{
      title: 'Usuarios',
      href: '/users',
      icon: Folder,
    }] : []),
    ...(hasPermission('administrar') ? [{
      title: 'Roles',
      href: '/roles',
      icon: Folder,
    }] : []),
    ...(hasPermission('administrar') ? [{
      title: 'Atenciones',
      href: '/supports',
      icon: Folder,
    }] : []),
  ];

  const footerNavItems: NavItem[] = [
    {
      title: 'Repository',
      href: 'https://github.com/laravel/react-starter-kit',
      icon: Folder,
    },
    {
      title: 'Documentation',
      href: 'https://laravel.com/docs/starter-kits',
      icon: BookOpen,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
