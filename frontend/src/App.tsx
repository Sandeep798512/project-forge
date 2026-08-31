import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { AuthProvider, useAuth } from './context/AuthContext';

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

// Auth Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

// Legal Pages
import { Terms } from './pages/Terms';
import { Privacy, RefundPolicy, License } from './pages/LegalPages';

// Customer Dashboard
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { MyPurchases } from './pages/dashboard/MyPurchases';
import { Downloads } from './pages/dashboard/Downloads';
import { Profile } from './pages/dashboard/Profile';
import { Security } from './pages/dashboard/Security';
import { SupportTickets } from './pages/dashboard/SupportTickets';

// Admin Layout & Pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

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
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/projects/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
          <Route path="/go/:slug" element={<PublicLayout><CampaignPage /></PublicLayout>} />
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
          <Route path="/refund-policy" element={<PublicLayout><RefundPolicy /></PublicLayout>} />
          <Route path="/license" element={<PublicLayout><License /></PublicLayout>} />

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

          {/* Admin Protected Routes */}
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
            <Route path="orders" element={<AdminOrders />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
