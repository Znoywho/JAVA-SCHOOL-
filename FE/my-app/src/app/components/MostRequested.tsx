import { ProductCard } from './ProductCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const products = [
  {
    id: '1',
    image: '',
    brand: 'Pinarello',
    category: 'Road',
    name: 'Pinarello Dogma F 2025 Shimano Ultegra Di2 / Fulcrum Racing 718',
    price: '45,000,000 ₫',
    originalPrice: '55,000,000 ₫',
    conditionPercent: 92,
    isVerified: true,
  },
  {
    id: '2',
    image: '',
    brand: 'Specialized',
    category: 'Gravel',
    name: 'Specialized Diverge STR Expert SRAM Rival AXS / Roval Terra CLX',
    price: '38,500,000 ₫',
    conditionPercent: 85,
    isVerified: true,
  },
  {
    id: '3',
    image: '',
    brand: 'Trek',
    category: 'Road',
    name: 'Trek Madone SLR 7 eTap AXS size 54 / Bontrager Aeolus RSL 37',
    price: '52,000,000 ₫',
    conditionPercent: 88,
    isVerified: false,
  },
  {
    id: '4',
    image: '',
    brand: 'Colnago',
    category: 'Road',
    name: 'Colnago V4Rs Pogačar 2025 size 52s Shimano Dura-Ace Di2 / Fulcrum',
    price: '49,500,000 ₫',
    conditionPercent: 95,
    isVerified: true,
  },
  {
    id: '5',
    image: '',
    brand: 'Giant',
    category: 'Road',
    name: 'Giant Propel Advanced SL Disc Shimano Dura-Ace / Cadex 42 Disc',
    price: '42,000,000 ₫',
    conditionPercent: 78,
    isVerified: false,
  }
];

export function MostRequested() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Được yêu cầu nhiều nhất</h2>
          <p className="text-gray-500 mt-1">Những chiếc xe đạp được tìm kiếm nhiều nhất</p>
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
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
