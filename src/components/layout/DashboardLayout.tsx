import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Sidebar } from '../../components/layout/Sidebar';
import { SidebarProvider } from '../../components/ui/sidebar';

interface DashboardLayoutProps {
  children?: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isDark, setIsDark] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  A2 e-Corridor
                </h1>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-sm">
                  <div className="w-2 h-2 rounded-full bg-status-available animate-pulse" />
                  <span className="text-muted-foreground">Adama Highway Hub</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-xs opacity-60">
                    {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>

                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                  OP
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
