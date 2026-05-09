import { ChevronRight } from 'lucide-react';

const brands = [
  { id: '1', name: 'Brand 1', logo: 'figma:asset/brand1.png' },
  { id: '2', name: 'Brand 2', logo: 'figma:asset/brand2.png' },
  { id: '3', name: 'Brand 3', logo: 'figma:asset/brand3.png' },
  { id: '4', name: 'Brand 4', logo: 'figma:asset/brand4.png' },
  { id: '5', name: 'Brand 5', logo: 'figma:asset/brand5.png' },
  { id: '6', name: 'Brand 6', logo: 'figma:asset/brand6.png' }
];

export function TopBrands() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Top Brands</h2>
          <a href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
            Xem tất cả thương hiệu
            <ChevronRight size={20} />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="aspect-[3/2] bg-white rounded-lg overflow-hidden flex items-center justify-center p-6 hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' viewBox='0 0 120 80'%3E%3Crect fill='%23e0e0e0' width='120' height='80' rx='4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%23666'%3E${brand.name}%3C/text%3E%3C/svg%3E`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
