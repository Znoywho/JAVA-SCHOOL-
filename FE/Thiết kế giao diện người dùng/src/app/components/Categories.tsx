import { ChevronRight } from 'lucide-react';

const categories = [
  {
    id: '1',
    name: 'Road',
    image: 'figma:asset/cat-road.png',
    bgColor: 'bg-pink-400',
    link: '/road'
  },
  {
    id: '2',
    name: 'Gravel',
    image: 'figma:asset/cat-gravel.png',
    bgColor: 'bg-yellow-600',
    link: '/gravel'
  },
  {
    id: '3',
    name: 'Race Pro',
    image: 'figma:asset/cat-race.png',
    bgColor: 'bg-orange-300',
    link: '/race-pro'
  },
  {
    id: '4',
    name: 'MTB',
    image: 'figma:asset/cat-mtb.png',
    bgColor: 'bg-blue-400',
    link: '/mtb'
  }
];

export function Categories() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Categories</h2>
        <a href="#" className="flex items-center gap-1 text-blue-600 hover:underline">
          Xem tất cả
          <ChevronRight size={20} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <a
            key={category.id}
            href={category.link}
            className={`${category.bgColor} rounded-lg overflow-hidden aspect-[4/5] relative group cursor-pointer hover:shadow-xl transition`}
          >
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='250' viewBox='0 0 200 250'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='white'%3EBike%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
              <h3 className="text-white text-2xl font-bold">{category.name}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
