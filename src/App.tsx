import { useState, useEffect } from 'react';
import { SuperadminDashboard } from './components/superadmin-dashboard';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.title = 'DenStack - Dental Network Management';
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark' : ''}`}
      style={{ background: 'var(--background)' }}
    >
      <SuperadminDashboard onToggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
    </div>
  );
}