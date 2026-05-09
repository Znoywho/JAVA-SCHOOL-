import { Search, Heart, ShoppingCart, User, Menu } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="figma:asset/bike-logo.png" alt="Bike Store" className="h-8" onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='32' viewBox='0 0 40 32'%3E%3Ctext x='0' y='24' font-size='20' font-weight='bold'%3EBIKE%3C/text%3E%3C/svg%3E";
            }} />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Heart size={24} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <ShoppingCart size={24} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <User size={24} />
            </button>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              Đăng nhập
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center gap-6 py-3 border-t border-gray-100">
          <a href="#" className="hover:text-blue-600">Trang chủ</a>
          <a href="#" className="hover:text-blue-600 flex items-center gap-1">
            Digital Bikes Boro
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">ONLINE</span>
          </a>
          <a href="#" className="hover:text-blue-600">Used Bikes</a>
          <a href="#" className="hover:text-blue-600">Road</a>
          <a href="#" className="hover:text-blue-600">MTB</a>
          <a href="#" className="hover:text-blue-600">Gravel</a>
          <a href="#" className="hover:text-blue-600">E-Bikes</a>
          <a href="#" className="hover:text-blue-600">Framesets</a>
          <a href="#" className="hover:text-blue-600">Brands</a>
          <a href="#" className="hover:text-blue-600">Build And Rent</a>
        </div>
      </div>
    </nav>
  );
}
