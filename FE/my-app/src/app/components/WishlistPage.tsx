import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronRight, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  addToCart,
  fetchWishlist,
  formatPrice,
  removeFromWishlist,
  type WishlistItem,
} from '../services/api';

export function WishlistPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'BUYER') {
      setMessage('Chỉ tài khoản buyer mới xem được wishlist.');
      setLoading(false);
      return;
    }

    loadWishlist();
  }, [user?.id]);

  const loadWishlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      setItems(await fetchWishlist(user.id));
    } catch (err: any) {
      setMessage(err.message || 'Không tải được wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    if (!user) return;
    try {
      await removeFromWishlist(user.id, productId);
      setItems(prev => prev.filter(item => item.productId !== productId));
    } catch (err: any) {
      setMessage(err.message || 'Gỡ khỏi wishlist thất bại');
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!user) return;
    try {
      await addToCart(user.id, productId, 1);
      setMessage('Đã thêm vào giỏ hàng');
    } catch (err: any) {
      setMessage(err.message || 'Thêm vào giỏ hàng thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Heart className="text-red-500 fill-red-500" size={26} />
          Wishlist của bạn
        </h1>

        {message && (
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
            Đang tải wishlist...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={30} className="text-red-300" />
            </div>
            <h2 className="font-semibold text-gray-800 mb-2">Wishlist đang trống</h2>
            <Link
              to="/products"
              className="inline-flex mt-3 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {items.map(item => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                  >
                    {item.productTitle}
                  </Link>
                  <p className="text-sm text-red-600 font-semibold mt-1">
                    {formatPrice(item.productPrice)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCart(item.productId)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                  >
                    <ShoppingCart size={16} />
                    Thêm vào giỏ
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Gỡ khỏi wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
