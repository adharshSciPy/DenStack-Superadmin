import { Button } from './ui/button';
import { Moon, Sun, Leaf } from 'lucide-react';

interface NavbarProps {
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

export function Navbar({ onToggleDarkMode, isDarkMode }: NavbarProps) {
  return (
    <nav className="bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6" />
            <span className="text-lg font-medium">GreenUI</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="#" 
              className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-md transition-colors"
            >
              Home
            </a>
            <a 
              href="#" 
              className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-md transition-colors"
            >
              Features
            </a>
            <a 
              href="#" 
              className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-md transition-colors"
            >
              About
            </a>
            <a 
              href="#" 
              className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-md transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDarkMode}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}