import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Wrench, Users, Zap, 
  Image, MessageSquare, Camera, BookOpen, Shield, DollarSign, 
  FileText, Book, CreditCard, BarChart3, ChevronLeft, ChevronRight,
  ExternalLink, LogOut
} from 'lucide-react';
import logo from '../assets/logo.png';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { to: '/admin-coldtech-secure', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin-coldtech-secure/customers', label: 'Customers', icon: Users },
      { to: '/admin-coldtech-secure/products', label: 'Products', icon: Package },
      { to: '/admin-coldtech-secure/orders', label: 'Orders', icon: ShoppingCart },
      { to: '/admin-coldtech-secure/services', label: 'Service Tickets', icon: Wrench },
    ]
  },
  {
    label: 'Management',
    items: [
      { to: '/admin-coldtech-secure/staff', label: 'Staff', icon: Users },
      { to: '/admin-coldtech-secure/offers', label: 'Daily Offers', icon: Zap },
      { to: '/admin-coldtech-secure/banners', label: 'Banners', icon: Image },
      { to: '/admin-coldtech-secure/team', label: 'Team', icon: Users },
      { to: '/admin-coldtech-secure/testimonials', label: 'Testimonials', icon: MessageSquare },
      { to: '/admin-coldtech-secure/gallery', label: 'Work Gallery', icon: Camera },
      { to: '/admin-coldtech-secure/blog', label: 'Blog Posts', icon: BookOpen },
      { to: '/admin-coldtech-secure/ai-blog', label: '✦ AI Blog', icon: Zap },
      { to: '/admin-coldtech-secure/amc', label: 'AMC Clients', icon: Shield },
    ]
  },
  {
    label: 'Accounting',
    items: [
      { to: '/admin-coldtech-secure/expenses', label: 'Expenses', icon: DollarSign },
      { to: '/admin-coldtech-secure/invoices', label: 'Invoices', icon: FileText },
      { to: '/admin-coldtech-secure/accounting/parties', label: 'Parties', icon: Users },
      { to: '/admin-coldtech-secure/accounting/ledgers', label: 'Ledgers', icon: Book },
      { to: '/admin-coldtech-secure/accounting/products', label: 'Acc. Products', icon: Package },
      { to: '/admin-coldtech-secure/accounting/invoices', label: 'Acc. Invoices', icon: FileText },
      { to: '/admin-coldtech-secure/accounting/payments', label: 'Payments', icon: CreditCard },
      { to: '/admin-coldtech-secure/accounting/reports', label: 'Reports', icon: BarChart3 },
      { to: '/admin-coldtech-secure/invoice-preview', label: 'Invoice Template', icon: FileText },
    ]
  }
];

export function ModernSidebar({ isCollapsed, onToggle, onLogout, userEmail, isAdmin = true }) {
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img src={logo} alt="Coldtech" className="w-8 h-8 rounded-lg object-cover" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Coldtech</p>
                <p className="text-xs text-gray-500">{isAdmin ? 'Admin Panel' : 'Staff Panel'}</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <img src={logo} alt="Coldtech" className="w-8 h-8 rounded-lg object-cover mx-auto" />
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3 text-gray-600" /> : <ChevronLeft className="w-3 h-3 text-gray-600" />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV_SECTIONS.map((section, idx) => {
            // For staff, only show Dashboard
            if (!isAdmin && section.label !== 'Main') return null;
            
            return (
              <div key={idx} className="mb-6">
                {!isCollapsed && (
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                    {section.label}
                  </p>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    // For staff, only show Dashboard
                    if (!isAdmin && item.to !== '/admin-coldtech-secure') return null;
                    
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          } ${isCollapsed ? 'justify-center' : ''}`
                        }
                        title={isCollapsed ? item.label : ''}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-200 space-y-1">
          <Link
            to="/"
            target="_blank"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'View Site' : ''}
          >
            <ExternalLink className="w-5 h-5" />
            {!isCollapsed && <span>View Site</span>}
          </Link>
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Log Out' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
          {!isCollapsed && (
            <div className="px-3 pt-2">
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
