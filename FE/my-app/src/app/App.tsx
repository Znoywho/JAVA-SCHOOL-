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
      </Routes>
      <Footer />
    </div>
  );
}