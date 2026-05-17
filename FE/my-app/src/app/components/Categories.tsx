import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { fetchCategories, type Category } from '../services/api';

const CATEGORY_STYLES: Record<string, { bgGradient: string; emoji: string; description: string }> = {
  Road: { bgGradient: 'from-rose-400 to-pink-500', emoji: '🏎️', description: 'Xe đua đường trường' },
  MTB: { bgGradient: 'from-blue-400 to-blue-600', emoji: '⛰️', description: 'Xe leo núi' },
  Gravel: { bgGradient: 'from-amber-500 to-orange-600', emoji: '🏔️', description: 'Xe đa địa hình' },
  'E-Bike': { bgGradient: 'from-emerald-400 to-teal-600', emoji: '⚡', description: 'Xe đạp điện' },
  'Race Pro': { bgGradient: 'from-violet-500 to-purple-600', emoji: '🏆', description: 'Xe đua chuyên nghiệp' },
};

const DEFAULT_STYLE = { bgGradient: 'from-gray-500 to-gray-700', emoji: '🚲', description: 'Xe đạp' };

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

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
        {categories.map(category => {
          const style = CATEGORY_STYLES[category.name] || DEFAULT_STYLE;
          return (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className={`bg-gradient-to-br ${style.bgGradient} rounded-2xl overflow-hidden aspect-[4/5] relative group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
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
                <span className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">{style.emoji}</span>
                <h3 className="text-white text-3xl font-bold mb-1">{category.name}</h3>
                <p className="text-white/80 text-sm">{style.description}</p>
              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
