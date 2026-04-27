import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { ModernSidebar } from '../../components/ModernSidebar';
import { ModernNavbar } from '../../components/ModernNavbar';

export function ModernAdminLayout() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!['admin', 'staff'].includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ModernSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={logout}
          userEmail={user?.email}
        />
        <ModernNavbar
          userName={user?.name}
          userAvatar={user?.avatar}
          isCollapsed={sidebarCollapsed}
        />
        <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
