import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export function HeroSection() {
  return (
    <div className="relative w-full h-[520px] bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      {/* Content */}
      <div className="relative max-w-[1400px] mx-auto px-4 h-full flex items-center">
        <div className="text-white max-w-lg z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Mới cập nhật 2026
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            Tìm chiếc xe đạp
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              hoàn hảo
            </span>
            <br />
            cho bạn
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Nền tảng mua bán xe đạp thể thao cũ uy tín. Đã kiểm định, bảo hành, giao hàng toàn quốc.
          </p>
          <div className="flex gap-3">
            <Link
              to="/products"
              className="px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5"
            >
              Khám phá ngay
            </Link>
            <Link
              to="/products"
              className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold"
            >
              Xem tất cả xe
            </Link>
          </div>
        </div>

        {/* Decorative bike illustration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 hidden lg:flex items-center justify-center">
          <div className="relative">
            <svg viewBox="0 0 400 300" width="450" height="340" className="opacity-20">
              <circle cx="110" cy="210" r="60" fill="none" stroke="white" strokeWidth="3" />
              <circle cx="290" cy="210" r="60" fill="none" stroke="white" strokeWidth="3" />
              <circle cx="110" cy="210" r="8" fill="white" opacity="0.5" />
              <circle cx="290" cy="210" r="8" fill="white" opacity="0.5" />
              <path d="M110 210 L170 120 L250 120 L290 210" fill="none" stroke="white" strokeWidth="3" />
              <path d="M170 120 L200 210" fill="none" stroke="white" strokeWidth="3" />
              <path d="M200 210 L250 120" fill="none" stroke="white" strokeWidth="3" />
              <path d="M250 120 L270 100" fill="none" stroke="white" strokeWidth="3" />
              <path d="M256 100 L284 100" fill="none" stroke="white" strokeWidth="3" />
              <path d="M160 110 L180 130" fill="none" stroke="white" strokeWidth="3" />
              <circle cx="180" cy="210" r="4" fill="white" opacity="0.3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition border border-white/10">
        <ChevronLeft className="text-white" size={24} />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition border border-white/10">
        <ChevronRight className="text-white" size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-8 h-2 bg-white rounded-full" />
        <div className="w-2 h-2 bg-white/40 rounded-full" />
        <div className="w-2 h-2 bg-white/40 rounded-full" />
      </div>
    </div>
  );
}
