import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import api from './services/api';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { AuthProvider, useAuth } from './context/AuthContext';

// Scroll To Top Component on Route Change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
  }, [pathname]);

  return null;
};

// Public Pages
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { CampaignPage } from './pages/CampaignPage';
import { About } from './pages/About';
import { Pricing } from './pages/Pricing';
import { FAQPage } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Support } from './pages/Support';
import { Checkout } from './pages/Checkout';
import { StudyMaterials } from './pages/StudyMaterials';

// Auth Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

// Legal Pages
import { Terms } from './pages/Terms';
import { Privacy, RefundPolicy, License, Disclaimer, ShippingPolicy } from './pages/LegalPages';
import { IPComplaint } from './pages/IPComplaint';

// Customer Dashboard
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { MyPurchases } from './pages/dashboard/MyPurchases';
import { Downloads } from './pages/dashboard/Downloads';
import { Profile } from './pages/dashboard/Profile';
import { Security } from './pages/dashboard/Security';
import { SupportTickets } from './pages/dashboard/SupportTickets';

// Admin Layout & 17 Business Suite Pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductVersions } from './pages/admin/AdminProductVersions';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminEntitlements } from './pages/admin/AdminEntitlements';
import { AdminDownloads } from './pages/admin/AdminDownloads';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminSupport } from './pages/admin/AdminSupport';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminStudyMaterials } from './pages/admin/AdminStudyMaterials';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gray-400 text-xs">Loading session...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Layout Wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton variant="floating" />
    </div>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    // Background server warmup ping
    api.get('/health').catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/projects/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
          <Route path="/go/:slug" element={<PublicLayout><CampaignPage /></PublicLayout>} />
          <Route path="/study-materials" element={<PublicLayout><StudyMaterials /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/support" element={<PublicLayout><Support /></PublicLayout>} />
          
          {/* Protected Checkout */}
          <Route path="/checkout/:productId" element={<PublicLayout><ProtectedRoute><Checkout /></ProtectedRoute></PublicLayout>} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Legal Routes */}
          <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
          <Route path="/disclaimer" element={<PublicLayout><Disclaimer /></PublicLayout>} />
          <Route path="/refund-policy" element={<PublicLayout><RefundPolicy /></PublicLayout>} />
          <Route path="/shipping-policy" element={<PublicLayout><ShippingPolicy /></PublicLayout>} />
          <Route path="/license" element={<PublicLayout><License /></PublicLayout>} />
          <Route path="/ip-complaint" element={<PublicLayout><IPComplaint /></PublicLayout>} />

          {/* Customer Dashboard Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="purchases" element={<MyPurchases />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="support" element={<SupportTickets />} />
            <Route path="profile" element={<Profile />} />
            <Route path="security" element={<Security />} />
          </Route>

          {/* Admin Protected Routes (17 Modules) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="product-versions" element={<AdminProductVersions />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="entitlements" element={<AdminEntitlements />} />
            <Route path="downloads" element={<AdminDownloads />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="study-materials" element={<AdminStudyMaterials />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
