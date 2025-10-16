import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Zap,
  BarChart3,
  Activity,
  ChevronLeft,
} from 'lucide-react';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '../../components/ui/sidebar';

const navItems = [
  { title: 'Overview', url: '/', icon: LayoutDashboard },
  { title: 'Bookings', url: '/bookings', icon: Calendar },
  { title: 'Slots', url: '/slots', icon: Zap },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'System Health', url: '/health', icon: Activity },
];

export function Sidebar() {
  const { open } = useSidebar();

  return (
    <ShadcnSidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {open && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-sidebar-foreground">A2 Station</span>
            </div>
          )}
          <SidebarTrigger className="ml-auto">
            <ChevronLeft className={`h-4 w-4 transition-transform ${!open ? 'rotate-180' : ''}`} />
          </SidebarTrigger>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {open && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/60 space-y-1">
              <div className="flex justify-between">
                <span>Uptime</span>
                <span className="text-status-available">99.7%</span>
              </div>
              <div className="flex justify-between">
                <span>Power Load</span>
                <span className="text-status-charging">78%</span>
              </div>
              <div className="flex justify-between">
                <span>Temperature</span>
                <span>34°C</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </ShadcnSidebar>
  );
}
