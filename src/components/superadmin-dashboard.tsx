import { useState, useEffect } from 'react';
import { Sidebar } from './dashboard/sidebar';
import { DashboardContent } from './dashboard/dashboard-content';
import { TopNavbar } from './dashboard/top-navbar';

interface SuperadminDashboardProps {
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

export function SuperadminDashboard({ onToggleDarkMode, isDarkMode }: SuperadminDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      setSidebarCollapsed(mobile); // Auto-collapse on mobile
      if (mobile) {
        setSidebarOpen(false); // Close mobile sidebar by default
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Close mobile sidebar when section changes
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        isMobile 
          ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'relative'
      }`}>
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          collapsed={sidebarCollapsed && !isMobile}
          onToggleCollapse={handleSidebarToggle}
          isMobile={isMobile}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopNavbar 
          onToggleDarkMode={onToggleDarkMode}
          isDarkMode={isDarkMode}
          onToggleSidebar={handleSidebarToggle}
          isMobile={isMobile}
        />
        
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-3 sm:p-4 lg:p-6">
            <DashboardContent activeSection={activeSection} />
          </div>
        </main>
      </div>
    </div>
  );
}