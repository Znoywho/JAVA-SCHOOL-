import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Banknote,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Loader2,
  MapPin,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
  UserRound,
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  clearCart,
  createOrder,
  fetchCart,
  fetchShippingCompanies,
  fetchShippingQuote,
  formatPrice,
  payOrder,
  removeFromCart,
  updateCartItemQuantity,
  type CartData,
  type CartItem,
  type OrderResponse,
  type PaymentMethod,
  type ShippingCompany,
  type ShippingInfo,
  type ShippingQuote,
} from '../services/api';

const PAYMENT_OPTIONS: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Truck;
}> = [
  {
    value: 'COD',
    label: 'Thanh toán khi nhận xe',
    description: 'Đơn hàng chờ seller xác nhận, thanh toán lúc bàn giao.',
    icon: Truck,
  },
  {
    value: 'BANK_TRANSFER',
    label: 'Chuyển khoản ngân hàng',
    description: 'Mô phỏng thanh toán chuyển khoản và xác nhận ngay.',
    icon: Banknote,
  },
  {
    value: 'CARD',
    label: 'Thẻ nội địa / quốc tế',
    description: 'Mô phỏng thanh toán thẻ và xác nhận ngay.',
    icon: CreditCard,
  },
];

type SellerCartGroup = {
  sellerId: number;
  sellerName?: string;
  items: CartItem[];
  subtotal: number;
};

function groupCartItemsBySeller(items: CartItem[]): SellerCartGroup[] {
  const groups = items.reduce((map, item) => {
    const existing = map.get(item.sellerId) ?? {
      sellerId: item.sellerId,
      sellerName: item.sellerName,
      items: [] as CartItem[],
      subtotal: 0,
    };

    existing.items.push(item);
    existing.subtotal += item.totalPrice;
    map.set(item.sellerId, existing);
    return map;
  }, new Map<number, SellerCartGroup>());

  return Array.from(groups.values());
}

export function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [shippingCompanies, setShippingCompanies] = useState<ShippingCompany[]>([]);
  const [selectedShippingCompanyId, setSelectedShippingCompanyId] = useState<number | null>(null);
  const [shippingQuotes, setShippingQuotes] = useState<ShippingQuote[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    shippingCompanyId: 0,
    recipientName: '',
    recipientPhone: '',
    shippingAddress: '',
    shippingNote: '',
  });
  const [createdOrders, setCreatedOrders] = useState<OrderResponse[]>([]);

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

  useEffect(() => {
    if (!user) return;

    setShippingInfo(prev => ({
      ...prev,
      recipientName: prev.recipientName || user.name || '',
      recipientPhone: prev.recipientPhone || user.phone || '',
    }));
  }, [user?.id]);

  useEffect(() => {
    loadShippingCompanies();
  }, [paymentMethod]);

  useEffect(() => {
    loadShippingQuotes();
  }, [cart?.items, selectedShippingCompanyId, paymentMethod]);

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

  const loadShippingCompanies = async () => {
    try {
      const companies = await fetchShippingCompanies(paymentMethod);
      setShippingCompanies(companies);
      setSelectedShippingCompanyId(prev => {
        if (prev && companies.some(company => company.id === prev)) return prev;
        return companies[0]?.id ?? null;
      });
    } catch (err: any) {
      setMessage(err.message || 'Không tải được danh sách đơn vị vận chuyển');
      setShippingCompanies([]);
      setSelectedShippingCompanyId(null);
    }
  };

  const loadShippingQuotes = async () => {
    if (!cart || cart.items.length === 0 || !selectedShippingCompanyId) {
      setShippingQuotes([]);
      return;
    }

    setQuoteLoading(true);
    try {
      const groups = groupCartItemsBySeller(cart.items);
      const quotes = await Promise.all(
        groups.map(group => fetchShippingQuote(selectedShippingCompanyId, group.subtotal, paymentMethod))
      );
      setShippingQuotes(quotes);
    } catch (err: any) {
      setMessage(err.message || 'Không tính được phí vận chuyển');
      setShippingQuotes([]);
    } finally {
      setQuoteLoading(false);
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

  const handleCheckout = async () => {
    if (!user || !cart || cart.items.length === 0) return;

    const missingSeller = cart.items.find(item => !item.sellerId);
    if (missingSeller) {
      setMessage('Giỏ hàng thiếu thông tin seller. Vui lòng tải lại trang rồi thử lại.');
      return;
    }
    if (!selectedShippingCompanyId) {
      setMessage('Vui lòng chọn đơn vị vận chuyển.');
      return;
    }
    if (!shippingInfo.recipientPhone.trim()) {
      setMessage('Vui lòng nhập số điện thoại nhận hàng.');
      return;
    }
    if (!shippingInfo.shippingAddress.trim()) {
      setMessage('Vui lòng nhập địa chỉ nhận hàng.');
      return;
    }

    setProcessing(true);
    setMessage(null);
    setCreatedOrders([]);

    try {
      const groups = groupCartItemsBySeller(cart.items);
      const orders: OrderResponse[] = [];
      const shippingPayload: ShippingInfo = {
        ...shippingInfo,
        shippingCompanyId: selectedShippingCompanyId,
        recipientName: shippingInfo.recipientName.trim() || user.name,
        recipientPhone: shippingInfo.recipientPhone.trim(),
        shippingAddress: shippingInfo.shippingAddress.trim(),
        shippingNote: shippingInfo.shippingNote?.trim() || '',
      };

      for (const group of groups) {
        const order = await createOrder({
          buyerId: user.id,
          sellerId: group.sellerId,
          paymentMethod,
          shipping: shippingPayload,
          items: group.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.productPrice,
          })),
        });

        orders.push(paymentMethod === 'COD' ? order : await payOrder(order.id));
      }

      await clearCart(user.id);
      setCart({ ...cart, items: [], totalQuantity: 0, totalPrice: 0 });
      setCreatedOrders(orders);
    } catch (err: any) {
      setMessage(err.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  const sellerGroups = cart ? groupCartItemsBySeller(cart.items) : [];
  const shippingTotal = shippingQuotes.reduce((sum, quote) => sum + quote.shippingFee, 0);
  const grandTotal = (cart?.totalPrice ?? 0) + shippingTotal;
  const selectedShippingCompany = shippingCompanies.find(company => company.id === selectedShippingCompanyId);

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
        ) : createdOrders.length > 0 ? (
          <div className="bg-white rounded-lg border border-emerald-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">Thanh toán thành công</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Đã tạo {createdOrders.length} đơn hàng. Phương thức: {
                    PAYMENT_OPTIONS.find(option => option.value === paymentMethod)?.label
                  }.
                </p>
                <div className="mt-5 divide-y divide-gray-100 rounded-lg border border-gray-100">
                  {createdOrders.map(order => (
                    <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">Đơn #{order.id}</p>
                        <p className="text-sm text-gray-500">
                          Seller: {order.sellerName} · {order.items.length} sản phẩm
                        </p>
                        {order.shipment && (
                          <p className="text-xs text-gray-500 mt-1">
                            {order.shipment.shippingCompanyName} · Mã vận đơn {order.shipment.trackingCode}
                          </p>
                        )}
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-red-600">{formatPrice(order.totalPrice)}</p>
                        <p className="text-xs text-gray-500">
                          {order.billStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'} · {order.shipment?.status ?? 'PENDING'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/products"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Tiếp tục mua sắm
                  </Link>
                  <button
                    onClick={() => {
                      setCreatedOrders([]);
                      loadCart();
                    }}
                    className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Quay lại giỏ hàng
                  </button>
                </div>
              </div>
            </div>
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
                    {item.sellerName && (
                      <p className="text-xs text-gray-500 mt-1">Seller: {item.sellerName}</p>
                    )}
                    <p className="text-sm text-red-600 font-semibold mt-1">
                      {formatPrice(item.productPrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleQuantity(item.productId, item.quantity - 1)}
                        disabled={processing}
                        className="p-2 hover:bg-gray-50"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity(item.productId, item.quantity + 1)}
                        disabled={processing}
                        className="p-2 hover:bg-gray-50"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={processing}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
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
                  <span>Tạm tính sản phẩm</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{quoteLoading ? 'Đang tính...' : formatPrice(shippingTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Số vận đơn</span>
                  <span>{sellerGroups.length}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="font-semibold text-gray-900 mb-3">Thông tin nhận hàng</p>
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                      <UserRound size={14} />
                      Người nhận
                    </span>
                    <input
                      value={shippingInfo.recipientName}
                      onChange={(event) => setShippingInfo(prev => ({
                        ...prev,
                        recipientName: event.target.value,
                      }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                      <Phone size={14} />
                      Số điện thoại
                    </span>
                    <input
                      value={shippingInfo.recipientPhone}
                      onChange={(event) => setShippingInfo(prev => ({
                        ...prev,
                        recipientPhone: event.target.value,
                      }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                      <MapPin size={14} />
                      Địa chỉ nhận hàng
                    </span>
                    <textarea
                      value={shippingInfo.shippingAddress}
                      onChange={(event) => setShippingInfo(prev => ({
                        ...prev,
                        shippingAddress: event.target.value,
                      }))}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 text-xs font-medium text-gray-600">Ghi chú giao hàng</span>
                    <input
                      value={shippingInfo.shippingNote}
                      onChange={(event) => setShippingInfo(prev => ({
                        ...prev,
                        shippingNote: event.target.value,
                      }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="font-semibold text-gray-900 mb-3">Đơn vị vận chuyển</p>
                <div className="space-y-2">
                  {shippingCompanies.map(company => {
                    const selected = selectedShippingCompanyId === company.id;

                    return (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => setSelectedShippingCompanyId(company.id)}
                        disabled={processing}
                        className={`w-full rounded-lg border p-3 text-left transition-colors ${
                          selected
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-start gap-3">
                          <span className={`mt-0.5 ${selected ? 'text-emerald-600' : 'text-gray-400'}`}>
                            <PackageCheck size={18} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-gray-900">
                              {company.name}
                            </span>
                            <span className="block text-xs text-gray-500 mt-0.5 leading-5">
                              {company.estimatedDaysMin}-{company.estimatedDaysMax} ngày · {company.supportsCod ? 'Có COD' : 'Không COD'}
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedShippingCompany && (
                  <p className="mt-2 text-xs text-gray-500">
                    {selectedShippingCompany.name} sẽ tạo {sellerGroups.length} vận đơn theo từng seller.
                  </p>
                )}
              </div>

              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="font-semibold text-gray-900 mb-3">Phương thức thanh toán</p>
                <div className="space-y-2">
                  {PAYMENT_OPTIONS.map(option => {
                    const Icon = option.icon;
                    const selected = paymentMethod === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPaymentMethod(option.value)}
                        disabled={processing}
                        className={`w-full rounded-lg border p-3 text-left transition-colors ${
                          selected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-start gap-3">
                          <span className={`mt-0.5 ${selected ? 'text-blue-600' : 'text-gray-400'}`}>
                            <Icon size={18} />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-gray-900">
                              {option.label}
                            </span>
                            <span className="block text-xs text-gray-500 mt-0.5 leading-5">
                              {option.description}
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing || quoteLoading || !selectedShippingCompanyId}
                className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing && <Loader2 size={18} className="animate-spin" />}
                {processing ? 'Đang xử lý...' : 'Thanh toán'}
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
