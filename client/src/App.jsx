import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ServiceRequest } from './pages/ServiceRequest';
import { TrackService } from './pages/TrackService';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ITSolutionsPune } from './pages/ITSolutionsPune';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { ActivateAccount } from './pages/ActivateAccount';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { RefundPolicy } from './pages/RefundPolicy';
import { ServiceTerms } from './pages/ServiceTerms';
import { Services } from './pages/Services';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminStaff } from './pages/admin/AdminStaff';
import { StaffDashboard } from './pages/admin/StaffDashboard';
import { AdminOffers } from './pages/admin/AdminOffers';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminAMC } from './pages/admin/AdminAMC';
import { AdminBanners } from './pages/admin/AdminBanners';
import { AdminTeam } from './pages/admin/AdminTeam';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminWorkGallery } from './pages/admin/AdminWorkGallery';
import { AdminAIBlog } from './pages/admin/AdminAIBlog';
import { AdminExpenses } from './pages/admin/AdminExpenses';
import { AdminInvoices } from './pages/admin/AdminInvoices';
import { AdminParties } from './pages/admin/AdminParties';
import { AdminLedgers } from './pages/admin/AdminLedgers';
import { AdminAccountingProducts } from './pages/admin/AdminAccountingProducts';
import { AdminAccountingInvoices } from './pages/admin/AdminAccountingInvoices';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminReports } from './pages/admin/AdminReports';
import { useAuth } from './context/AuthContext';

import { ScrollToTop } from './components/ScrollToTop';

/** Renders AdminDashboard for admin, StaffDashboard for staff */
function AdminIndex() {
  const { user } = useAuth();
  return user?.role === 'staff' ? <StaffDashboard /> : <AdminDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#111827',
                color: '#e5e7eb',
                border: '1px solid rgba(51, 65, 85, 0.6)',
              },
            }}
          />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/services/request" element={<ServiceRequest />} />
              <Route path="/services/track" element={<TrackService />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/it-solutions-pune" element={<ITSolutionsPune />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/activate" element={<ActivateAccount />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/service-terms" element={<ServiceTerms />} />
              <Route path="/services" element={<Services />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            <Route path="/admin-coldtech-secure" element={<AdminLayout />}>
              <Route index element={<AdminIndex />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="amc" element={<AdminAMC />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="gallery" element={<AdminWorkGallery />} />
              <Route path="ai-blog" element={<AdminAIBlog />} />
              <Route path="expenses" element={<AdminExpenses />} />
              <Route path="invoices" element={<AdminInvoices />} />
              <Route path="accounting/parties" element={<AdminParties />} />
              <Route path="accounting/ledgers" element={<AdminLedgers />} />
              <Route path="accounting/products" element={<AdminAccountingProducts />} />
              <Route path="accounting/invoices" element={<AdminAccountingInvoices />} />
              <Route path="accounting/payments" element={<AdminPayments />} />
              <Route path="accounting/reports" element={<AdminReports />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
