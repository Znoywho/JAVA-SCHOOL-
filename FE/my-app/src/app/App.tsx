import { Routes, Route } from 'react-router';
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
import { SellerDashboard } from './components/SellerDashboard';
import { CartPage } from './components/CartPage';
import { WishlistPage } from './components/WishlistPage';
import { MyOrdersPage } from './components/MyOrdersPage';
import { OrderDetailPage } from './components/OrderDetailPage';
import { InspectorDashboard } from './components/InspectorDashboard';
import { ChatPage } from './components/ChatPage';

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
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/inspector/dashboard" element={<InspectorDashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}
