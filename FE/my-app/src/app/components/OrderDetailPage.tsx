import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Banknote,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Loader2,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Truck,
  UserRound,
  XCircle,
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  cancelOrder,
  fetchOrderById,
  formatPrice,
  type OrderResponse,
} from '../services/api';

/* ── Shipping timeline steps ────────────────────────────── */

const SHIPPING_STEPS = [
  { key: 'PENDING',          label: 'Chờ xử lý',       icon: Clock },
  { key: 'AWAITING_PICKUP',  label: 'Chờ shipper',      icon: Package },
  { key: 'PICKED_UP',        label: 'Đã lấy hàng',     icon: Package },
  { key: 'IN_TRANSIT',       label: 'Đang vận chuyển',  icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'Đang giao',        icon: Truck },
  { key: 'DELIVERED',        label: 'Đã giao',          icon: CheckCircle2 },
] as const;

const CANCELLED_STEPS = [
  { key: 'CANCELLED', label: 'Đã hủy',  icon: XCircle },
  { key: 'RETURNED',  label: 'Hoàn trả', icon: Package },
] as const;

function getStepIndex(status: string): number {
  return SHIPPING_STEPS.findIndex(s => s.key === status);
}

const PAYMENT_LABELS: Record<string, { label: string; icon: typeof Truck }> = {
  COD:           { label: 'Thanh toán khi nhận xe', icon: Truck },
  BANK_TRANSFER: { label: 'Chuyển khoản ngân hàng', icon: Banknote },
  CARD:          { label: 'Thẻ nội địa / quốc tế',  icon: CreditCard },
};

const ORDER_STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'Chờ xác nhận', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  CONFIRMED: { label: 'Đã xác nhận',  color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  SHIPPING:  { label: 'Đang giao',    color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200' },
  DELIVERED: { label: 'Đã giao',      color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  CANCELLED: { label: 'Đã hủy',       color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
};

const BILL_STATUS_LABELS: Record<string, string> = {
  PENDING:   'Chờ thanh toán',
  PAID:      'Đã thanh toán',
  CANCELLED: 'Đã hủy',
};

/* ── Component ──────────────────────────────────────────── */

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (id) loadOrder(Number(id));
  }, [id, user?.id]);

  const loadOrder = async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      setOrder(await fetchOrderById(orderId));
    } catch (err: any) {
      setError(err.message || 'Không tải được đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order || !confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    setCancelling(true);
    try {
      await cancelOrder(order.id);
      await loadOrder(order.id);
    } catch (err: any) {
      setError(err.message || 'Hủy đơn thất bại');
    } finally {
      setCancelling(false);
    }
  };

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const shipment = order?.shipment;
  const currentStepIdx = shipment ? getStepIndex(shipment.status) : -1;
  const isCancelledOrReturned = shipment?.status === 'CANCELLED' || shipment?.status === 'RETURNED';
  const waitingCodConfirmation = order?.paymentMethod === 'COD'
    && order?.billStatus !== 'PAID'
    && shipment?.status === 'DELIVERED';

  const orderStatusStyle = ORDER_STATUS_STYLE[order?.orderStatus ?? 'PENDING'] ?? ORDER_STATUS_STYLE.PENDING;
  const paymentInfo = PAYMENT_LABELS[order?.paymentMethod ?? ''] ?? PAYMENT_LABELS.COD;
  const PaymentIcon = paymentInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link to="/orders" className="hover:text-blue-600 transition-colors">Đơn hàng</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">#{id}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-5 transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-gray-500">Đang tải đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-red-100 p-10 text-center">
            <XCircle size={32} className="text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => id && loadOrder(Number(id))}
              className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* ── Header Card ── */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Đơn hàng #{order.id}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Đặt lúc{' '}
                    {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${orderStatusStyle.bg} ${orderStatusStyle.color}`}>
                    {orderStatusStyle.label}
                  </span>
                  {order.orderStatus === 'PENDING' && (
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="px-4 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-full hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {cancelling ? 'Đang hủy...' : 'Hủy đơn'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Shipping Timeline ── */}
            {shipment && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Truck size={18} className="text-blue-600" />
                  Trạng thái giao hàng
                </h2>

                {isCancelledOrReturned ? (
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
                    <XCircle size={22} className="text-red-500" />
                    <div>
                      <p className="font-semibold text-red-700">
                        {shipment.status === 'CANCELLED' ? 'Đơn hàng đã bị hủy' : 'Đơn hàng đã hoàn trả'}
                      </p>
                      <p className="text-sm text-red-600 mt-0.5">
                        Cập nhật lúc {shipment.updatedAt
                          ? new Date(shipment.updatedAt).toLocaleString('vi-VN')
                          : '—'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline track */}
                    <div className="flex items-start justify-between relative">
                      {/* Background line */}
                      <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200" />
                      {/* Active line */}
                      {currentStepIdx > 0 && (
                        <div
                          className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
                          style={{ width: `calc(${(currentStepIdx / (SHIPPING_STEPS.length - 1)) * 100}% - 40px)` }}
                        />
                      )}

                      {SHIPPING_STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isActive = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step.key} className="flex flex-col items-center z-10" style={{ width: `${100 / SHIPPING_STEPS.length}%` }}>
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                isCurrent
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                                  : isActive
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {isActive && !isCurrent ? <Check size={16} /> : <StepIcon size={16} />}
                            </div>
                            <p className={`mt-2 text-xs text-center font-medium leading-tight ${
                              isCurrent ? 'text-blue-700' : isActive ? 'text-emerald-700' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tracking & Company */}
                <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Đơn vị vận chuyển</p>
                    <p className="text-sm font-semibold text-gray-900">{shipment.shippingCompanyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Mã vận đơn</p>
                    <button
                      onClick={() => handleCopyTracking(shipment.trackingCode)}
                      className="inline-flex items-center gap-1.5 text-sm font-mono text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-md transition-colors"
                    >
                      {copiedTracking ? (
                        <>
                          <Check size={13} /> Đã copy!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> {shipment.trackingCode}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Shipping Address ── */}
            {shipment && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  Thông tin nhận hàng
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2.5">
                    <UserRound size={15} className="mt-0.5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Người nhận</p>
                      <p className="font-medium text-gray-900">{shipment.recipientName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone size={15} className="mt-0.5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-900">{shipment.recipientPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 sm:col-span-2">
                    <MapPin size={15} className="mt-0.5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Địa chỉ</p>
                      <p className="font-medium text-gray-900">{shipment.shippingAddress}</p>
                    </div>
                  </div>
                  {shipment.shippingNote && (
                    <div className="flex items-start gap-2.5 sm:col-span-2">
                      <Package size={15} className="mt-0.5 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Ghi chú</p>
                        <p className="font-medium text-gray-900">{shipment.shippingNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Products ── */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={18} className="text-blue-600" />
                Sản phẩm ({order.items.length})
              </h2>
              <div className="divide-y divide-gray-100">
                {order.items.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <Link
                        to={`/products/${item.productId}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {item.productTitle}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Payment Summary ── */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Banknote size={18} className="text-blue-600" />
                Thanh toán
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính sản phẩm</span>
                  <span>{formatPrice(order.productTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(order.shippingFee)}</span>
                </div>
                {shipment && shipment.codAmount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Thu hộ COD</span>
                    <span>{formatPrice(shipment.codAmount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-base">
                  <span className="text-gray-900">Tổng cộng</span>
                  <span className="text-red-600">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <PaymentIcon size={16} />
                  <span>{paymentInfo.label}</span>
                </div>
                <span className={`font-semibold ${
                  order.billStatus === 'PAID' ? 'text-emerald-600' : order.billStatus === 'CANCELLED' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {waitingCodConfirmation ? 'Chờ đơn vị vận chuyển xác nhận COD' : BILL_STATUS_LABELS[order.billStatus] ?? order.billStatus}
                </span>
              </div>
            </div>

            {/* ── Seller info ── */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Seller: <span className="font-semibold text-gray-900">{order.sellerName}</span>
                </div>
                {order.sellerId && (
                  <Link
                    to={`/chat?with=${order.sellerId}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <MessageCircle size={15} />
                    Chat seller
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
