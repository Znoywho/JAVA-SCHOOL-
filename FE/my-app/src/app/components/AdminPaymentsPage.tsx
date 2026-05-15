import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  AlertCircle,
  Banknote,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  UserRound,
  XCircle,
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  confirmBankTransfer,
  fetchAdminOrders,
  formatPrice,
  type OrderResponse,
} from '../services/api';

type PaymentFilter = 'PENDING' | 'PAID' | 'ALL';

const FILTERS: Array<{ value: PaymentFilter; label: string }> = [
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'PAID', label: 'Đã xác nhận' },
  { value: 'ALL', label: 'Tất cả' },
];

const BANK_TRANSFER_INFO = {
  bankName: 'Vietcombank',
  accountNumber: '1023456789',
  accountName: 'REBIKE MARKET',
};

function getTransferContent(orderId: number): string {
  return `REBIKE-${orderId}`;
}

function canConfirm(order: OrderResponse): boolean {
  return order.billStatus === 'PENDING' && order.orderStatus !== 'CANCELLED';
}

export function AdminPaymentsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [activeFilter, setActiveFilter] = useState<PaymentFilter>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      setMessage({ type: 'error', text: 'Tài khoản này không có quyền xác nhận thanh toán.' });
      setLoading(false);
      return;
    }

    loadOrders();
  }, [user?.id]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders({ paymentMethod: 'BANK_TRANSFER' });
      setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      showMessage('error', err.message || 'Không tải được danh sách chuyển khoản');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4500);
  };

  const handleCopy = async (orderId: number) => {
    await navigator.clipboard.writeText(getTransferContent(orderId));
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleConfirm = async (order: OrderResponse) => {
    if (!canConfirm(order)) return;

    setConfirmingId(order.id);
    try {
      await confirmBankTransfer(order.id, user?.name);
      showMessage('success', `Đã xác nhận đơn #${order.id}. Đơn đã được chuyển sang cổng shipper.`);
      await loadOrders();
    } catch (err: any) {
      showMessage('error', err.message || 'Xác nhận chuyển khoản thất bại');
    } finally {
      setConfirmingId(null);
    }
  };

  const stats = useMemo(() => {
    const pending = orders.filter(order => order.billStatus === 'PENDING' && order.orderStatus !== 'CANCELLED');
    const paid = orders.filter(order => order.billStatus === 'PAID');
    const pendingAmount = pending.reduce((sum, order) => sum + order.totalPrice, 0);

    return {
      total: orders.length,
      pending: pending.length,
      paid: paid.length,
      pendingAmount,
    };
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders
      .filter(order => activeFilter === 'ALL' || order.billStatus === activeFilter)
      .filter(order => {
        if (!query) return true;
        return [
          String(order.id),
          order.buyerName,
          order.sellerName,
          getTransferContent(order.id),
          order.shipment?.trackingCode,
        ].some(value => value?.toLowerCase().includes(query));
      });
  }, [orders, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <ShieldCheck size={14} />
                Admin payment control
              </div>
              <h1 className="text-2xl font-bold text-gray-950">Xác nhận chuyển khoản ngân hàng</h1>
              <p className="mt-1 text-sm text-gray-500">
                Đối soát đơn BANK_TRANSFER, xác nhận thanh toán rồi chuyển đơn sang shipper.
              </p>
            </div>

            <button
              onClick={loadOrders}
              disabled={loading || user?.role !== 'ADMIN'}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1280px] px-4 py-6">
        {message && (
          <div className={`mb-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
              : 'border-red-100 bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
            <span>{message.text}</span>
          </div>
        )}

        <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">Tổng đơn chuyển khoản</p>
            <p className="mt-2 text-2xl font-bold text-gray-950">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-white p-4">
            <p className="text-xs text-gray-500">Chờ admin xác nhận</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white p-4">
            <p className="text-xs text-gray-500">Đã xác nhận</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.paid}</p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-white p-4">
            <p className="text-xs text-gray-500">Số tiền đang chờ</p>
            <p className="mt-2 text-lg font-bold text-blue-600">{formatPrice(stats.pendingAmount)}</p>
          </div>
        </section>

        <section className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
            <div className="relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Tìm mã đơn, buyer, seller, nội dung CK, mã vận đơn..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-800">
              <p className="font-semibold text-blue-900">Tài khoản nhận tiền</p>
              <p>{BANK_TRANSFER_INFO.bankName} · {BANK_TRANSFER_INFO.accountNumber} · {BANK_TRANSFER_INFO.accountName}</p>
            </div>
          </div>
        </section>

        <section className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map(filter => {
            const selected = activeFilter === filter.value;
            const count = filter.value === 'ALL'
              ? stats.total
              : orders.filter(order => order.billStatus === filter.value).length;

            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {filter.label} <span className={selected ? 'text-blue-100' : 'text-gray-400'}>({count})</span>
              </button>
            );
          })}
        </section>

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-16 text-center">
            <Loader2 size={32} className="mx-auto mb-3 animate-spin text-blue-500" />
            <p className="text-gray-500">Đang tải đơn chuyển khoản...</p>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-16 text-center">
            <ClipboardCheck size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-medium text-gray-700">Không có đơn phù hợp</p>
          </div>
        ) : (
          <section className="space-y-3">
            {visibleOrders.map(order => {
              const confirming = confirmingId === order.id;
              const confirmable = canConfirm(order);

              return (
                <article key={order.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_260px]">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Link to={`/orders/${order.id}`} className="text-base font-bold text-gray-950 hover:text-blue-600">
                          Đơn #{order.id}
                        </Link>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          order.billStatus === 'PAID'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : order.billStatus === 'CANCELLED'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}>
                          {order.billStatus === 'PAID' ? <CheckCircle2 size={13} /> : order.billStatus === 'CANCELLED' ? <XCircle size={13} /> : <Clock size={13} />}
                          {order.billStatus === 'PAID' ? 'Đã xác nhận' : order.billStatus === 'CANCELLED' ? 'Đã hủy' : 'Chờ xác nhận'}
                        </span>
                        {order.shipment && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            <Truck size={13} />
                            {order.shipment.status}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
                        <div className="flex items-start gap-2">
                          <UserRound size={16} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Buyer</p>
                            <p className="font-semibold text-gray-900">{order.buyerName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Package size={16} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Seller</p>
                            <p className="font-semibold text-gray-900">{order.sellerName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Banknote size={16} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Số tiền</p>
                            <p className="font-bold text-red-600">{formatPrice(order.totalPrice)}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tạo lúc</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-gray-500">Nội dung CK:</span>
                          <button
                            onClick={() => handleCopy(order.id)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 font-mono font-semibold text-blue-600 hover:text-blue-700"
                          >
                            {copiedId === order.id ? <Check size={12} /> : <Copy size={12} />}
                            {copiedId === order.id ? 'Đã copy' : getTransferContent(order.id)}
                          </button>
                        </div>
                        {order.items.length > 0 && (
                          <p className="mt-2 text-xs text-gray-500 line-clamp-1">
                            {order.items.map(item => `${item.productTitle} x${item.quantity}`).join(' · ')}
                          </p>
                        )}
                      </div>

                      {order.paymentConfirmedAt && (
                        <p className="mt-3 text-xs text-emerald-700">
                          Xác nhận bởi {order.paymentConfirmedBy || 'Admin'} lúc {new Date(order.paymentConfirmedAt).toLocaleString('vi-VN')}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {confirmable ? (
                        <button
                          onClick={() => handleConfirm(order)}
                          disabled={confirming}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {confirming ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                          {confirming ? 'Đang xác nhận...' : 'Xác nhận đã thanh toán'}
                        </button>
                      ) : (
                        <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                          {order.billStatus === 'PAID' ? 'Đơn đã qua shipper queue' : 'Không thể xác nhận'}
                        </div>
                      )}

                      {order.shipment && (
                        <div className="rounded-lg border border-gray-100 px-3 py-2 text-xs text-gray-500">
                          <p className="font-semibold text-gray-700">{order.shipment.shippingCompanyName}</p>
                          <p className="mt-1 font-mono">{order.shipment.trackingCode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
