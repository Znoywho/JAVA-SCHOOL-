import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Heart, ShoppingCart, ChevronDown, Package, LogOut, ClipboardList, MessageCircle, Truck, Banknote, Users, ShoppingBag } from 'lucide-react';
import { getCurrentUser, logout, type AuthUser } from '../services/auth';
import { fetchCartCount, fetchWishlistCount } from '../services/api';

function AuthSection() {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => setUser(getCurrentUser());
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  if (!user) {
    return (
      <div className="ml-1 flex items-center gap-2">
        <Link to="/register" className="hidden sm:inline-flex px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors">
          Đăng ký
        </Link>
        <Link to="/login" className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold">
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="relative ml-2">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
              {user.role}
            </span>
          </div>
          
          <div className="p-2">
            {user.role === 'SELLER' && (
              <Link 
                to="/seller/dashboard" 
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <Package size={16} />
                Quản lý gian hàng
              </Link>
            )}
            {user.role === 'BUYER' && (
              <Link 
                to="/orders" 
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <ClipboardList size={16} />
                Đơn hàng của tôi
              </Link>
            )}
            {user.role === 'INSPECTOR' && (
              <Link
                to="/inspector/dashboard"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <ClipboardList size={16} />
                Bao cao kiem dinh
              </Link>
            )}
            {user.role === 'ADMIN' && (
              <>
                <Link
                  to="/admin/users"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  <Users size={16} />
                  Quản lý user
                </Link>
                <Link
                  to="/admin/orders"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  <ShoppingBag size={16} />
                  Quản lý đơn hàng
                </Link>
                <Link
                  to="/admin/products"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  <Package size={16} />
                  Quản lý sản phẩm
                </Link>
                <Link
                  to="/admin/reports"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  <ClipboardList size={16} />
                  Báo cáo kiểm định
                </Link>
                <Link
                  to="/admin/payments"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  <Banknote size={16} />
                  Xác nhận chuyển khoản
                </Link>
              </>
            )}
            {(user.role === 'SHIPPER' || user.role === 'ADMIN') && (
              <Link
                to="/shipper"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <Truck size={16} />
                Vận đơn shipper
              </Link>
            )}
            <Link
              to="/chat"
              onClick={() => setShowDropdown(false)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
            >
              <MessageCircle size={16} />
              Tin nhan
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600 transition-colors"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCounts = async () => {
      const user = getCurrentUser();
      if (!user) {
        setCartCount(0);
        setWishlistCount(0);
        return;
      }

      const [cart, wishlist] = await Promise.all([
        fetchCartCount(user.id),
        fetchWishlistCount(user.id),
      ]);
      setCartCount(cart);
      setWishlistCount(wishlist);
    };

    loadCounts();
    window.addEventListener('auth-change', loadCounts);
    window.addEventListener('cart-change', loadCounts);
    window.addEventListener('wishlist-change', loadCounts);
    return () => {
      window.removeEventListener('auth-change', loadCounts);
      window.removeEventListener('cart-change', loadCounts);
      window.removeEventListener('wishlist-change', loadCounts);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Used Bikes', path: '/products' },
    { name: 'Road', path: '/products?category=1' },
    { name: 'MTB', path: '/products?category=2' },
    { name: 'Gravel', path: '/products?category=3' },
    { name: 'E-Bikes', path: '/products?category=4' },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-shadow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3 11.5V14l-3-3 4-3 2 3h2" />
                </svg>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-extrabold tracking-tight text-gray-900">RE</span>
              <span className="text-xl font-extrabold tracking-tight text-blue-600">BIKE</span>
              <p className="text-[10px] text-gray-400 leading-none -mt-0.5">Xe đạp thể thao cũ</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm xe đạp, thương hiệu, loại xe..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white transition-all text-sm"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Tìm
                </button>
              )}
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <Link to="/chat" className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative group" title="Tin nhan">
              <MessageCircle size={22} className="text-gray-700" />
            </Link>
            <Link to="/wishlist" className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative group">
              <Heart size={22} className="text-gray-700" />
              <span className={`absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 px-1 flex items-center justify-center ${wishlistCount === 0 ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity`}>
                {wishlistCount}
              </span>
            </Link>
            <Link to="/cart" className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative">
              <ShoppingCart size={22} className="text-gray-700" />
              <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            
            <AuthSection />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center gap-1 py-2 border-t border-gray-100 overflow-x-auto scrollbar-hide">
          <Link
            to="/"
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
          >
            Trang chủ
          </Link>

          {categories.map(cat => (
            <Link
              key={cat.name}
              to={cat.path}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}

          <Link
            to="/products"
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
          >
            Thương hiệu
            <ChevronDown size={14} />
          </Link>

          <div className="ml-auto">
            <Link
              to="/products"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Tất cả sản phẩm
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
