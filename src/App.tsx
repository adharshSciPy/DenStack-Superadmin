import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store'; // adjust path as needed

import LoginPage from './components/Login/LoginPage';
// import { DashboardLayout } from './components/superadmin-dashboard.tsx';
import { SuperadminDashboard } from './components/superadmin-dashboard';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.title = 'DenStack - Dental Network Management';
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div
          className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark' : ''}`}
          style={{ background: 'var(--background)' }}
        >
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* You can wrap your dashboard with dark mode support */}
              <Route
                path="/dashboard"
                element={
                    <SuperadminDashboard
                      onToggleDarkMode={toggleDarkMode}
                      isDarkMode={isDarkMode}
                    />
                }
              />

              {/* Redirect all other routes */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </div>
      </PersistGate>
    </Provider>
  );
}
