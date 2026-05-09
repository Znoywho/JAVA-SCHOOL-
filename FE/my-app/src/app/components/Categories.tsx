import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const categories = [
  {
    id: '1',
    name: 'Road',
    description: 'Xe đua đường trường',
    bgGradient: 'from-rose-400 to-pink-500',
    emoji: '🏎️',
    categoryId: 1,
  },
  {
    id: '2',
    name: 'Gravel',
    description: 'Xe đa địa hình',
    bgGradient: 'from-amber-500 to-orange-600',
    emoji: '🏔️',
    categoryId: 3,
  },
  {
    id: '3',
    name: 'MTB',
    description: 'Xe leo núi',
    bgGradient: 'from-blue-400 to-blue-600',
    emoji: '⛰️',
    categoryId: 2,
  },
  {
    id: '4',
    name: 'E-Bike',
    description: 'Xe đạp điện',
    bgGradient: 'from-emerald-400 to-teal-600',
    emoji: '⚡',
    categoryId: 4,
  }
];

export function Categories() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Danh mục xe</h2>
          <p className="text-gray-500 mt-1">Chọn loại xe phù hợp với bạn</p>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
        >
          Xem tất cả
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.categoryId}`}
            className={`bg-gradient-to-br ${category.bgGradient} rounded-2xl overflow-hidden aspect-[4/5] relative group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '30px 30px'
              }} />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <span className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">{category.emoji}</span>
              <h3 className="text-white text-3xl font-bold mb-1">{category.name}</h3>
              <p className="text-white/80 text-sm">{category.description}</p>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
          </Link>
        ))}
      </div>
    </section>
  );
}
