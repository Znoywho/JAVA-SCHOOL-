import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ChevronRight,
  ClipboardList,
  Clock,
  Loader2,
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MapPin,
  Copy,
  Check,
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  cancelOrder,
  fetchBuyerOrders,
  formatPrice,
  type OrderResponse,
} from '../services/api';

/* ── Status helpers ─────────────────────────────────────── */

const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  PENDING:   { label: 'Chờ xác nhận', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận',  color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',     icon: Package },
  SHIPPING:  { label: 'Đang giao',    color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200', icon: Truck },
  DELIVERED: { label: 'Đã giao',      color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  CANCELLED: { label: 'Đã hủy',       color: 'text-red-700',     bg: 'bg-red-50 border-red-200',       icon: XCircle },
};

const SHIPPING_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:          { label: 'Chờ lấy hàng',      color: 'text-amber-600' },
  AWAITING_PICKUP:  { label: 'Chờ shipper',        color: 'text-orange-600' },
  PICKED_UP:        { label: 'Đã lấy hàng',       color: 'text-blue-600' },
  IN_TRANSIT:       { label: 'Đang vận chuyển',    color: 'text-indigo-600' },
  OUT_FOR_DELIVERY: { label: 'Đang giao',          color: 'text-violet-600' },
  DELIVERED:        { label: 'Đã giao thành công', color: 'text-emerald-600' },
  CANCELLED:        { label: 'Đã hủy',             color: 'text-red-600' },
  RETURNED:         { label: 'Hoàn trả',           color: 'text-gray-600' },
};

type FilterTab = 'ALL' | 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: 'ALL',       label: 'Tất cả' },
  { value: 'PENDING',   label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'SHIPPING',  label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

/* ── Component ──────────────────────────────────────────── */

export function MyOrdersPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user?.id]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBuyerOrders(user.id);
      setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      setError(err.message || 'Không tải được đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    setCancellingId(orderId);
    try {
      await cancelOrder(orderId);
      await loadOrders();
    } catch (err: any) {
      setError(err.message || 'Hủy đơn thất bại');
    } finally {
      setCancellingId(null);
    }
  };

  const handleCopyTracking = (orderId: number, trackingCode: string) => {
    navigator.clipboard.writeText(trackingCode);
    setCopiedTrackingId(orderId);
    setTimeout(() => setCopiedTrackingId(null), 2000);
  };

  const filteredOrders = activeTab === 'ALL'
    ? orders
    : orders.filter(o => o.orderStatus === activeTab);

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Đơn hàng của tôi</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="text-blue-600" size={26} />
            Đơn hàng của tôi
          </h1>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RotateCcw size={15} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {tab.label}
              {tab.value !== 'ALL' && (
                <span className="ml-1.5 opacity-70">
                  ({orders.filter(o => o.orderStatus === tab.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-gray-500">Đang tải đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={30} className="text-gray-300" />
            </div>
            <h2 className="font-semibold text-gray-800 mb-2">
              {activeTab === 'ALL' ? 'Chưa có đơn hàng nào' : `Không có đơn "${FILTER_TABS.find(t => t.value === activeTab)?.label}"`}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {activeTab === 'ALL' ? 'Hãy mua sắm để tạo đơn hàng đầu tiên!' : 'Thử chọn tab khác để xem đơn hàng.'}
            </p>
            {activeTab === 'ALL' && (
              <Link
                to="/products"
                className="inline-flex px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Xem sản phẩm
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const statusInfo = ORDER_STATUS_MAP[order.orderStatus] ?? ORDER_STATUS_MAP.PENDING;
              const StatusIcon = statusInfo.icon;
              const shippingStatusInfo = order.shipment
                ? SHIPPING_STATUS_MAP[order.shipment.status] ?? SHIPPING_STATUS_MAP.PENDING
                : null;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="px-5 py-3.5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">Đơn #{order.id}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.color}`}>
                        <StatusIcon size={13} />
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-5">
                    {/* Items summary */}
                    <div className="space-y-2 mb-4">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 truncate mr-3 flex-1">{item.productTitle}</span>
                          <span className="text-gray-500 whitespace-nowrap">
                            x{item.quantity} · {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-gray-400">+{order.items.length - 3} sản phẩm khác</p>
                      )}
                    </div>

                    {/* Shipping info */}
                    {order.shipment && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Truck size={15} className="text-gray-400" />
                            <span className="text-gray-600">{order.shipment.shippingCompanyName}</span>
                            {shippingStatusInfo && (
                              <>
                                <span className="text-gray-300">·</span>
                                <span className={`font-medium ${shippingStatusInfo.color}`}>{shippingStatusInfo.label}</span>
                              </>
                            )}
                          </div>
                          {order.shipment.trackingCode && (
                            <button
                              onClick={() => handleCopyTracking(order.id, order.shipment!.trackingCode)}
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-mono bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
                            >
                              {copiedTrackingId === order.id ? (
                                <>
                                  <Check size={12} />
                                  Đã copy
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  {order.shipment.trackingCode}
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        {order.shipment.shippingAddress && (
                          <div className="flex items-start gap-1.5 mt-2 text-xs text-gray-500">
                            <MapPin size={12} className="mt-0.5 shrink-0" />
                            <span>{order.shipment.shippingAddress}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Seller: <span className="font-medium text-gray-700">{order.sellerName}</span>
                        {order.shippingFee > 0 && (
                          <span className="ml-3">
                            Ship: <span className="text-gray-700">{formatPrice(order.shippingFee)}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-red-600">{formatPrice(order.totalPrice)}</span>
                        <div className="flex gap-2">
                          {order.orderStatus === 'PENDING' && (
                            <button
                              onClick={() => handleCancel(order.id)}
                              disabled={cancellingId === order.id}
                              className="px-3.5 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                            >
                              {cancellingId === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                            </button>
                          )}
                          <Link
                            to={`/orders/${order.id}`}
                            className="px-3.5 py-2 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
