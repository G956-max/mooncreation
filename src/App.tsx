/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { LanguageProvider } from './context/LanguageContext';
import WelcomePopup from './components/WelcomePopup';
import Home from './pages/Home';
import Login from './pages/Login';
import Categories from './pages/Categories';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminCategories from './pages/AdminCategories';
import AdminContact from './pages/AdminContact';
import AdminProducts from './pages/AdminProducts';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import AdminDiscounts from './pages/AdminDiscounts';
import AdminSettings from './pages/AdminSettings';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import AdminBanners from './pages/AdminBanners';
import AdminSubcategories from './pages/AdminSubcategories';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import AdminLayout from './components/AdminLayout';
import CategoryProducts from './pages/CategoryProducts';

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">Loading...</div>;
  if (!user || role !== 'admin') return <Navigate to="/login" replace />;
  
  return <AdminLayout>{children}</AdminLayout>;
};

const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return <PublicLayout>{children}</PublicLayout>;
};

import BottomNav from './components/BottomNav';

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-auto flex flex-col font-sans bg-[#FAF9F6] text-[#2C2C2C] m-0 p-0 pb-16 md:pb-0">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
    <BottomNav />
  </div>
);

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-auto flex flex-col font-sans bg-[#FAF9F6] text-[#2C2C2C] m-0 p-0">
    <main className="flex-grow">{children}</main>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <StoreProvider>
            <WelcomePopup />
            <HashRouter>
              <Routes>
              {/* Public Routes - MOONCREATION UI with Navbar & Footer */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
              
              {/* Protected Store Routes */}
              <Route path="/categories" element={<ProtectedUserRoute><Categories /></ProtectedUserRoute>} />
              <Route path="/category/:categoryName" element={<ProtectedUserRoute><CategoryProducts /></ProtectedUserRoute>} />
              <Route path="/contact" element={<ProtectedUserRoute><Contact /></ProtectedUserRoute>} />
              <Route path="/profile" element={<ProtectedUserRoute><Profile /></ProtectedUserRoute>} />
              <Route path="/dashboard" element={<ProtectedUserRoute><UserDashboard /></ProtectedUserRoute>} />
              <Route path="/product/:id" element={<ProtectedUserRoute><ProductDetail /></ProtectedUserRoute>} />
              <Route path="/checkout" element={<ProtectedUserRoute><CheckoutLayout><Checkout /></CheckoutLayout></ProtectedUserRoute>} />
              <Route path="/cart" element={<ProtectedUserRoute><Cart /></ProtectedUserRoute>} />
              <Route path="/wishlist" element={<ProtectedUserRoute><Wishlist /></ProtectedUserRoute>} />

              {/* Admin Routes - Modern Dashboard UI with Sidebar & Topbar (NO Footer) */}
              <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
              <Route path="/admin/analytics" element={<ProtectedAdminRoute><AdminAnalytics /></ProtectedAdminRoute>} />
              <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>} />
              <Route path="/admin/products/add" element={<ProtectedAdminRoute><AdminAddProduct /></ProtectedAdminRoute>} />
              <Route path="/admin/products/edit/:id" element={<ProtectedAdminRoute><AdminAddProduct /></ProtectedAdminRoute>} />
              <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
              <Route path="/admin/customers" element={<ProtectedAdminRoute><AdminCustomers /></ProtectedAdminRoute>} />
              <Route path="/admin/discounts" element={<ProtectedAdminRoute><AdminDiscounts /></ProtectedAdminRoute>} />
              <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminCategories /></ProtectedAdminRoute>} />
              <Route path="/admin/subcategories" element={<ProtectedAdminRoute><AdminSubcategories /></ProtectedAdminRoute>} />
              <Route path="/admin/banners" element={<ProtectedAdminRoute><AdminBanners /></ProtectedAdminRoute>} />
              <Route path="/admin/contact" element={<ProtectedAdminRoute><AdminContact /></ProtectedAdminRoute>} />
              <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </HashRouter>
          </StoreProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
