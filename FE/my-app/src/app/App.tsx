import { Navigate, Routes, Route, useLocation } from 'react-router';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { MostRequested } from './components/MostRequested';
import { TopBrands } from './components/TopBrands';
import { TeamBikes } from './components/TeamBikes';
import { Categories } from './components/Categories';
import { Services } from './components/Services';
import { Footer } from './components/Footer';
import { ProductListPage } from './components/ProductListPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { SellerDashboard } from './components/SellerDashboard';
import { CartPage } from './components/CartPage';
import { WishlistPage } from './components/WishlistPage';
import { MyOrdersPage } from './components/MyOrdersPage';
import { OrderDetailPage } from './components/OrderDetailPage';
import { InspectorDashboard } from './components/InspectorDashboard';
import { ShipperPortal } from './components/ShipperPortal';
import { ChatPage } from './components/ChatPage';
import { AdminPaymentsPage } from './components/AdminPaymentsPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';

function HomePage() {
  return (
    <>
      <HeroSection />
      <MostRequested />
      <TopBrands />
      <TeamBikes />
      <Categories />
      <Services />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const isShipperPortal = location.pathname.startsWith('/shipper');

  return (
    <div className="min-h-screen bg-white">
      {!isShipperPortal && <Navigation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/inspector/dashboard" element={<InspectorDashboard />} />
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route path="/admin/users" element={<AdminDashboardPage initialTab="users" />} />
        <Route path="/admin/orders" element={<AdminDashboardPage initialTab="orders" />} />
        <Route path="/admin/products" element={<AdminDashboardPage initialTab="products" />} />
        <Route path="/admin/reports" element={<AdminDashboardPage initialTab="reports" />} />
        <Route path="/admin/payments" element={<AdminPaymentsPage />} />
        <Route path="/shipping/dashboard" element={<Navigate to="/shipper" replace />} />
        <Route path="/shipper" element={<ShipperPortal />} />
        <Route path="/shipper/login" element={<ShipperPortal />} />
      </Routes>
      {!isShipperPortal && <Footer />}
    </div>
  );
}
