import { ProductCard } from './ProductCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const teamBikes = [
  {
    id: '6',
    image: '',
    brand: 'Lapierre',
    category: 'Road',
    name: 'Lapierre Xelius SL 2025 size 54 SRAM Red AXS / 3T Discus C45',
    price: '62,000,000 ₫',
    originalPrice: '72,000,000 ₫',
    conditionPercent: 96,
    isVerified: true,
  },
  {
    id: '7',
    image: '',
    brand: 'Orbea',
    category: 'Road',
    name: 'Orbea Orca M20iLTD 2024 size 53 Shimano Ultegra Di2 / Vision Metron',
    price: '55,000,000 ₫',
    conditionPercent: 89,
    isVerified: true,
  },
  {
    id: '8',
    image: '',
    brand: 'Cannondale',
    category: 'Road',
    name: 'Cannondale SuperSix EVO Hi-MOD Disc SRAM Force AXS / HollowGram',
    price: '48,000,000 ₫',
    conditionPercent: 82,
    isVerified: false,
  },
  {
    id: '9',
    image: '',
    brand: 'Bianchi',
    category: 'Road',
    name: 'Bianchi Oltre RC Campagnolo Super Record EPS / Fulcrum Speed 40',
    price: '58,000,000 ₫',
    conditionPercent: 91,
    isVerified: true,
  },
  {
    id: '10',
    image: '',
    brand: 'Colnago',
    category: 'Road',
    name: 'Colnago C68 Disc 2024 Campagnolo Super Record / Bora Ultra WTO 45',
    price: '72,000,000 ₫',
    conditionPercent: 97,
    isVerified: true,
  }
];

export function TeamBikes() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Xe đua chuyên nghiệp</h2>
          <p className="text-gray-500 mt-1">Xe đạp từ các đội đua hàng đầu thế giới</p>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
        >
          Xem tất cả
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {teamBikes.map((bike) => (
          <ProductCard key={bike.id} {...bike} />
        ))}
      </div>
    </section>
  );
}
