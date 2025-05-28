import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { SidebarProvider } from '@/components/ui/sidebar';
type PageProps = {
  permissions: string[];
  sidebarOpen: boolean;
};

export function AppSidebar() {
  const { permissions, sidebarOpen } = usePage<PageProps>().props;

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
    <SidebarProvider open={sidebarOpen}>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard" prefetch>
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
    </SidebarProvider>
  );
}