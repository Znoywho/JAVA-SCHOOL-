import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { MostRequested } from './components/MostRequested';
import { TopBrands } from './components/TopBrands';
import { TeamBikes } from './components/TeamBikes';
import { Categories } from './components/Categories';
import { Services } from './components/Services';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <MostRequested />
      <TopBrands />
      <TeamBikes />
      <Categories />
      <Services />
      <Footer />
    </div>
  );
}