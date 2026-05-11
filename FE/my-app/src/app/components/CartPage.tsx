import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  fetchCart,
  formatPrice,
  removeFromCart,
  updateCartItemQuantity,
  type CartData,
} from '../services/api';

export function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'BUYER') {
      setMessage('Chỉ tài khoản buyer mới xem được giỏ hàng.');
      setLoading(false);
      return;
    }

    loadCart();
  }, [user?.id]);

  const loadCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      setCart(await fetchCart(user.id));
    } catch (err: any) {
      setMessage(err.message || 'Không tải được giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantity = async (productId: number, quantity: number) => {
    if (!user) return;
    try {
      setCart(await updateCartItemQuantity(user.id, productId, quantity));
    } catch (err: any) {
      setMessage(err.message || 'Cập nhật số lượng thất bại');
    }
  };

  const handleRemove = async (productId: number) => {
    if (!user) return;
    try {
      await removeFromCart(user.id, productId);
      await loadCart();
    } catch (err: any) {
      setMessage(err.message || 'Xóa sản phẩm thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Giỏ hàng</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShoppingCart className="text-blue-600" size={26} />
          Giỏ hàng của bạn
        </h1>

        {message && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
            Đang tải giỏ hàng...
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={30} className="text-gray-300" />
            </div>
            <h2 className="font-semibold text-gray-800 mb-2">Giỏ hàng đang trống</h2>
            <Link
              to="/products"
              className="inline-flex mt-3 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
              {cart.items.map(item => (
                <div key={item.itemId} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
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

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleQuantity(item.productId, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity(item.productId, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-white rounded-xl border border-gray-100 p-5 h-fit">
              <h2 className="font-bold text-gray-900 mb-4">Tổng đơn hàng</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Số lượng</span>
                  <span>{cart.totalQuantity}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{formatPrice(cart.totalPrice)}</span>
                </div>
              </div>
              <button className="w-full mt-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
                Thanh toán
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
