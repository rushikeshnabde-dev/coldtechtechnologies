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
import { useAuth } from './context/AuthContext';

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
              <Route path="/services/request" element={<ProtectedRoute><ServiceRequest /></ProtectedRoute>} />
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
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
