import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="font-bold mb-4">Về chúng tôi</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-white">Liên hệ</a></li>
              <li><a href="#" className="hover:text-white">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-white">Tin tức</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-white">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-white">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Bikesupport</a></li>
              <li><a href="#" className="hover:text-white">Giao hàng</a></li>
              <li><a href="#" className="hover:text-white">Build And Rent</a></li>
              <li><a href="#" className="hover:text-white">Test Ride</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@bikestore.vn</li>
              <li>Hotline: 1900 xxxx</li>
              <li>Địa chỉ: Vietnam</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-blue-400"><Facebook size={20} /></a>
              <a href="#" className="hover:text-pink-400"><Instagram size={20} /></a>
              <a href="#" className="hover:text-red-400"><Youtube size={20} /></a>
              <a href="#" className="hover:text-blue-300"><Twitter size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 Bike Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
