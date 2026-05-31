import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { ModernSidebar } from '../../components/ModernSidebar';
import { ModernNavbar } from '../../components/ModernNavbar';

// Routes staff are NOT allowed to access
const ADMIN_ONLY_PATHS = [
  '/admin-coldtech-secure/customers',
  '/admin-coldtech-secure/products',
  '/admin-coldtech-secure/orders',
  '/admin-coldtech-secure/services',
  '/admin-coldtech-secure/staff',
  '/admin-coldtech-secure/offers',
  '/admin-coldtech-secure/banners',
  '/admin-coldtech-secure/team',
  '/admin-coldtech-secure/testimonials',
  '/admin-coldtech-secure/gallery',
  '/admin-coldtech-secure/blog',
  '/admin-coldtech-secure/ai-blog',
  '/admin-coldtech-secure/amc',
  '/admin-coldtech-secure/expenses',
  '/admin-coldtech-secure/invoices',
  '/admin-coldtech-secure/accounting',
];

export function ModernAdminLayout() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#06091A' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!['admin', 'staff'].includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  const isAdmin = user?.role === 'admin';

  // Block staff from admin-only routes
  if (!isAdmin && ADMIN_ONLY_PATHS.some(p => location.pathname.startsWith(p))) {
    return <Navigate to="/admin-coldtech-secure" replace />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen" style={{ background: '#06091A' }}>
        <ModernSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={logout}
          userEmail={user?.email}
          isAdmin={isAdmin}
        />
        <ModernNavbar
          userName={user?.name}
          userAvatar={user?.avatar}
          isCollapsed={sidebarCollapsed}
        />
        <main
          className="pt-16 transition-all duration-300 min-h-screen"
          style={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
