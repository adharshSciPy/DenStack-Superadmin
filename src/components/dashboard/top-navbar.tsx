import { Bell, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';

interface TopNavbarProps {
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  onToggleSidebar: () => void;
  isMobile?: boolean;
}

export function TopNavbar({ onToggleDarkMode, isDarkMode, onToggleSidebar, isMobile }: TopNavbarProps) {
  return (
    <header className="h-14 sm:h-16 glass backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-3 sm:px-6 relative">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="glass backdrop-blur-sm border-0 shrink-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clinics, users, orders..."
            className="pl-10 glass backdrop-blur-sm border-0 text-sm"
            style={{ background: 'var(--input-background)' }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Quick Actions - Hidden on mobile */}
        <div className="hidden xl:flex items-center gap-2 mr-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="glass backdrop-blur-sm border-0 hover:shadow-md transition-all duration-200"
          >
            <Settings className="h-4 w-4 mr-2" />
            Quick Setup
          </Button>
        </div>

        {/* Mobile Search Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="sm:hidden glass backdrop-blur-sm border-0"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative glass backdrop-blur-sm border-0 hover:shadow-md transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 gradient-primary text-white w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center border-0 shadow-lg">
            3
          </Badge>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDarkMode}
          className="text-muted-foreground hover:text-foreground glass backdrop-blur-sm border-0 hover:shadow-md transition-all duration-200"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 glass backdrop-blur-sm border-0 hover:shadow-md transition-all duration-200"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="hidden md:inline text-sm">Super Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 sm:w-56 glass backdrop-blur-sm border-0"
            style={{ background: 'var(--popover)' }}
          >
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}