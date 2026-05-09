import { ProductCard } from './ProductCard';
import { ChevronRight } from 'lucide-react';

const teamBikes = [
  {
    id: '1',
    image: 'figma:asset/team-bike1.png',
    badge: '30 ngày trả',
    brand: 'Lapierre',
    category: 'Road',
    name: 'Lapierre SR 2025 cực mới size 54.5 SRAM Red AXS XXL3T 350 Stage',
    price: 'VND 620,000',
    originalPrice: 'VND 720,000'
  },
  {
    id: '2',
    image: 'figma:asset/team-bike2.png',
    badge: '30 ngày trả',
    brand: 'Wilson',
    category: 'Road',
    name: 'Wilson Tour FAI 2025 Roadbike size 5 SRAM Red / Zipp Premier Disc ca',
    price: 'VND 590,000'
  },
  {
    id: '3',
    image: 'figma:asset/team-bike3.png',
    badge: '30 ngày trả',
    brand: 'Orbea',
    category: 'Road',
    name: 'Orbea Orca F 2023 size 51cm Super 350mm AXS / Zipp 303',
    price: 'VND 650,000'
  },
  {
    id: '4',
    image: 'figma:asset/team-bike4.png',
    badge: '30 ngày trả',
    brand: 'Lapierre',
    category: 'Road',
    name: 'Lapierre SR 2025 cực mới size XXL 2 SRAM Red AXS / Zipp 303 Disc',
    price: 'VND 680,000'
  },
  {
    id: '5',
    image: 'figma:asset/team-bike5.png',
    badge: '30 ngày trả',
    brand: 'Colnago',
    category: 'Road',
    name: 'Colnago V4Rs 2024 cực Suspension 2028 cực 25% Shimano Super AXS',
    price: 'VND 720,000'
  }
];

export function TeamBikes() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Team Bikes</h2>
        <a href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
          Shop Team Bikes
          <ChevronRight size={20} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {teamBikes.map((bike) => (
          <ProductCard key={bike.id} {...bike} />
        ))}
      </div>
    </section>
  );
}
