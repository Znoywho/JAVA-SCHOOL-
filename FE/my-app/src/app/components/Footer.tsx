import { Link } from 'react-router';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 mt-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3 11.5V14l-3-3 4-3 2 3h2" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold">RE</span>
                <span className="text-xl font-extrabold text-blue-400">BIKE</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Nền tảng mua bán xe đạp thể thao cũ uy tín nhất Việt Nam. Kết nối người mua và người bán một cách an toàn, minh bạch.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <Youtube size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Khám phá</h4>
            <ul className="space-y-2.5">
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link to="/products?category=1" className="text-gray-400 hover:text-white text-sm transition-colors">Xe Road</Link></li>
              <li><Link to="/products?category=2" className="text-gray-400 hover:text-white text-sm transition-colors">Xe MTB</Link></li>
              <li><Link to="/products?category=3" className="text-gray-400 hover:text-white text-sm transition-colors">Xe Gravel</Link></li>
              <li><Link to="/products?category=4" className="text-gray-400 hover:text-white text-sm transition-colors">E-Bikes</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Hỗ trợ</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Chính sách bảo hành</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Chính sách đổi trả 30 ngày</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Quy trình kiểm định xe</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} className="text-blue-400 flex-shrink-0" />
                info@rebike.vn
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={16} className="text-blue-400 flex-shrink-0" />
                1900 xxxx
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                TP. Hồ Chí Minh, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 REBIKE. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
