import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// User Pages
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import AboutPage from './pages/AboutPage';
import UserProfilePage from "./pages/UserProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import VNPayReturnPage from './pages/VNPayReturnPage';
import VNPayMockPage from './pages/VNPayMockPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminCategoryManagement from './pages/AdminCategoryManagement';
import AdminBrandManagement from './pages/AdminBrandManagement';
import AdminProductManagement from './pages/AdminProductManagement';
import AdminShipmentManagement from './pages/AdminShipmentManagement';
import AdminVoucherManagement from './pages/AdminVoucherManagement';
import AdminOrderManagement from './pages/AdminOrderManagement';

// Admin Layout Component
import AdminMainLayout from './components/AdminMainLayout';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* User Routes with Header & Footer */}
            <Route path="/*" element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ProductListPage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />

                    {/* VNPay Return Route - THÊM VÀO ĐÂY */}
                    <Route path="/payment/vnpay-mock" element={<VNPayMockPage />} />
                    <Route path="/payment/vnpay-return" element={<VNPayReturnPage />} />

                    {/* Protected User Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/user/profile" element={<UserProfilePage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/my-orders" element={<MyOrdersPage />} />
                    </Route>
                  </Routes>
                </main>
                <Footer />
              </div>
            } />

            {/* Admin Routes - Completely separate layout */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMainLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/users" element={<AdminUserManagement />} />
                    <Route path="/categories" element={<AdminCategoryManagement />} />
                    <Route path="/brands" element={<AdminBrandManagement />} />
                    <Route path="/products" element={<AdminProductManagement />} />
                    <Route path="/shipments" element={<AdminShipmentManagement />} />
                    <Route path="/vouchers" element={<AdminVoucherManagement />} />
                    <Route path="/orders" element={<AdminOrderManagement />} />
                    <Route path="/reports" element={<AdminDashboard />} />
                  </Routes>
                </AdminMainLayout>
              </ProtectedRoute>
            } />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;