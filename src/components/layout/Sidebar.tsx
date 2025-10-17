import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Zap,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../components/ui/sidebar";
import { useEffect, useState } from "react";

const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Bookings", url: "/bookings", icon: Calendar },
  { title: "Slots", url: "/slots", icon: Zap },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "System Health", url: "/health", icon: Activity },
];

export function Sidebar() {
  const { open } = useSidebar();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const startTime = 1760682023;
    
    const interval = setInterval(() => {
      const currentTime = Date.now() / 1000;
      const elapsedTime = Math.floor(currentTime - startTime);
      setUptime(elapsedTime);
    }, 1000); // Update every second

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this runs once on mount

  // Format uptime for display (optional)
  const formatUptime = (seconds : number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ShadcnSidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {open && (
            <div className="flex justify-center items-center gap-2 w-full h-[100px] rounded-lg gradient-card force-light">
                <img src="/logo.png" alt="A2 Logo" className="w-[130px] "/>
            </div>
          )}
          
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
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary font-medium active"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
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
                <span className="text-status-available">{formatUptime(uptime)}</span>
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
