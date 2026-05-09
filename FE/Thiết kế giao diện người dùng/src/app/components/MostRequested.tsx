import { ProductCard } from './ProductCard';
import { ChevronRight } from 'lucide-react';

const products = [
  {
    id: '1',
    image: 'figma:asset/bike1.png',
    badge: '30 ngày trả',
    brand: 'Pinarello',
    category: 'Road',
    name: 'Pinarello Nytro Sport E 2025 cực kỳ Shimano Ultegra DI 2 / Fulcrum Racing 718',
    price: 'VND 450,000',
    originalPrice: 'VND 550,000'
  },
  {
    id: '2',
    image: 'figma:asset/bike2.png',
    badge: '30 ngày trả',
    brand: 'Wilson',
    category: 'Gravel',
    name: 'Wilson Turbine 520 size 56.5 2L Shimano Ultegra 11 / Fulcrum Racing',
    price: 'VND 480,000'
  },
  {
    id: '3',
    image: 'figma:asset/bike3.png',
    badge: '30 ngày trả',
    brand: 'Pinarello',
    category: 'Road',
    name: 'Pinarello Nea Dogma F 2025 size 540 Shimano Ultegra Di2 / Fulcrum Racing',
    price: 'VND 520,000'
  },
  {
    id: '4',
    image: 'figma:asset/bike4.png',
    badge: '30 ngày trả',
    brand: 'Pinarello',
    category: 'Road',
    name: 'Pinarello Nea Dogma F 2025 size 540 Shimano Ultegra Di2 / Fulcrum',
    price: 'VND 495,000'
  },
  {
    id: '5',
    image: 'figma:asset/bike5.png',
    badge: '30 ngày trả',
    brand: 'Specialized',
    category: 'Road',
    name: 'Specialized S-Works Aethos 2025 size 540 Shimano Ultegra Pro',
    price: 'VND 580,000'
  }
];

export function MostRequested() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Most Requested</h2>
        <a href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
          Shop More Requested Bikes
          <ChevronRight size={20} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
