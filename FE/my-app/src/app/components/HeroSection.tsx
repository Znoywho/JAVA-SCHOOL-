import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-r from-gray-800 to-gray-600 overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative max-w-[1400px] mx-auto px-4 h-full flex items-center">
        <div className="text-white max-w-md z-10">
          <p className="text-sm mb-2">24 Tháng Năm 2025 được công bố</p>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Colnago V4Rs<br />
            Tadej Pogačar<br />
            2025 Ardennes<br />
            Classics
          </h1>
          <button className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Xem ngay bây giờ
          </button>
        </div>

        {/* Bike Image - Placeholder */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2">
          <img
            src="figma:asset/hero-bike.png"
            alt="Featured Bike"
            className="w-full h-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition">
        <ChevronLeft className="text-white" size={24} />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition">
        <ChevronRight className="text-white" size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
      </div>
    </div>
  );
}
