import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Trophy, Gift, Settings, Users, ChevronLeft } from 'lucide-react';

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Programs', icon: Trophy, path: '/programs' },
  { title: 'Winners', icon: Users, path: '/winners' },
  { title: 'Gifts', icon: Gift, path: '/gifts' },
  { title: 'Settings', icon: Settings, path: '/settings' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen border-r border-border bg-sidebar transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-gold">
          <Trophy className="h-5 w-5 text-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg truncate">Lucky Draw</h1>
            <p className="text-xs text-muted-foreground truncate">Management System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              collapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>
    </aside>
  );
}
