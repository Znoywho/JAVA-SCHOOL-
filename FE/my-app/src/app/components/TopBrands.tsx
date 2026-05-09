import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const brands = [
  { id: '1', name: 'Pinarello', brandId: 1 },
  { id: '2', name: 'Specialized', brandId: 2 },
  { id: '3', name: 'Trek', brandId: 3 },
  { id: '4', name: 'Giant', brandId: 4 },
  { id: '5', name: 'Colnago', brandId: 5 },
  { id: '6', name: 'Orbea', brandId: 6 },
];

function BrandLogo({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-lg font-bold text-gray-400 group-hover:text-gray-700 transition-colors tracking-wide">
        {name}
      </span>
    </div>
  );
}

export function TopBrands() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Thương hiệu hàng đầu</h2>
            <p className="text-gray-500 mt-1">Các thương hiệu xe đạp uy tín toàn cầu</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
          >
            Xem tất cả thương hiệu
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/products?brand=${brand.brandId}`}
              className="group aspect-[3/2] bg-white rounded-xl overflow-hidden flex items-center justify-center p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 hover:-translate-y-0.5"
            >
              <BrandLogo name={brand.name} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
