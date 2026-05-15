import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Copy,
  Loader2,
  LogOut,
  MapPin,
  PackageCheck,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  UserRound,
  XCircle,
} from 'lucide-react';
import { getCurrentUser, login, logout, type AuthUser } from '../services/auth';
import {
  confirmCodPayment,
  fetchShippingCompanies,
  fetchShipments,
  formatPrice,
  updateShippingStatus,
  type ShipmentResponse,
  type ShippingCompany,
} from '../services/api';

type QueueTab = 'collect' | 'onroad' | 'done' | 'all';

const QUEUE_TABS: Array<{ value: QueueTab; label: string }> = [
  { value: 'collect', label: 'Cần thu COD' },
  { value: 'onroad', label: 'Đang giao' },
  { value: 'done', label: 'Đã thu tiền' },
  { value: 'all', label: 'Tất cả' },
];

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'AWAITING_PICKUP', label: 'Chờ lấy hàng' },
  { value: 'PICKED_UP', label: 'Đã lấy hàng' },
  { value: 'IN_TRANSIT', label: 'Đang vận chuyển' },
  { value: 'OUT_FOR_DELIVERY', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
];

const STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Chờ xử lý', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  AWAITING_PICKUP: { label: 'Chờ lấy hàng', className: 'border-orange-200 bg-orange-50 text-orange-700' },
  PICKED_UP: { label: 'Đã lấy hàng', className: 'border-blue-200 bg-blue-50 text-blue-700' },
  IN_TRANSIT: { label: 'Đang vận chuyển', className: 'border-indigo-200 bg-indigo-50 text-indigo-700' },
  OUT_FOR_DELIVERY: { label: 'Đang giao', className: 'border-violet-200 bg-violet-50 text-violet-700' },
  DELIVERED: { label: 'Đã giao', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  CANCELLED: { label: 'Đã hủy', className: 'border-red-200 bg-red-50 text-red-700' },
  RETURNED: { label: 'Hoàn trả', className: 'border-gray-200 bg-gray-50 text-gray-700' },
};

function isClosedShipment(status: string): boolean {
  return status === 'CANCELLED' || status === 'RETURNED';
}

function getNextAction(status: string): { label: string; nextStatus: string } | null {
  switch (status) {
    case 'PENDING':
      return { label: 'Nhận xử lý', nextStatus: 'AWAITING_PICKUP' };
    case 'AWAITING_PICKUP':
      return { label: 'Đã lấy hàng', nextStatus: 'PICKED_UP' };
    case 'PICKED_UP':
      return { label: 'Đang vận chuyển', nextStatus: 'IN_TRANSIT' };
    case 'IN_TRANSIT':
      return { label: 'Bắt đầu giao', nextStatus: 'OUT_FOR_DELIVERY' };
    default:
      return null;
  }
}

function canConfirmCod(shipment: ShipmentResponse): boolean {
  return shipment.paymentMethod === 'COD'
    && !shipment.codPaymentConfirmed
    && !isClosedShipment(shipment.status);
}

function ShipperLogin({ onLoggedIn }: { onLoggedIn: (user: AuthUser) => void }) {
  const [email, setEmail] = useState('ghtk@rebike.vn');
  const [password, setPassword] = useState('shipper123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role !== 'SHIPPER' && user.role !== 'ADMIN') {
        logout();
        setError('Tài khoản này không có quyền vào cổng shipper.');
        return;
      }
      onLoggedIn(user);
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto grid min-h-screen max-w-[1180px] grid-cols-1 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:flex flex-col justify-between px-10 py-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-950">REBIKE Logistics</p>
              <p className="text-sm text-gray-500">COD operation portal</p>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <ShieldCheck size={16} />
              Shipper Portal
            </div>
            <h1 className="text-4xl font-bold leading-tight text-gray-950">
              Theo dõi vận đơn, thu COD, xác nhận thanh toán.
            </h1>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: ClipboardList, label: 'Vận đơn' },
                { icon: Banknote, label: 'Thu hộ' },
                { icon: CheckCircle2, label: 'Đối soát' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-4">
                    <Icon size={22} className="text-blue-600" />
                    <p className="mt-3 text-sm font-semibold text-gray-900">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-gray-400">Demo: ghtk@rebike.vn / shipper123</p>
        </section>

        <section className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-[420px] rounded-lg border border-gray-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Truck size={22} />
              </div>
              <div>
                <p className="font-bold text-gray-950">REBIKE Logistics</p>
                <p className="text-xs text-gray-500">Shipper Portal</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-950">Đăng nhập shipper</h2>
            <p className="mt-1 text-sm text-gray-500">Dành cho đơn vị vận chuyển và đối soát COD.</p>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Mật khẩu</span>
                <input
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading && <Loader2 size={17} className="animate-spin" />}
                Vào cổng shipper
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ShipperPortal() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const current = getCurrentUser();
    return current && (current.role === 'SHIPPER' || current.role === 'ADMIN') ? current : null;
  });
  const [companies, setCompanies] = useState<ShippingCompany[]>([]);
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [activeTab, setActiveTab] = useState<QueueTab>('collect');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    loadCompanies();
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    loadShipments();
  }, [user?.id, selectedCompanyId, statusFilter]);

  const loadCompanies = async () => {
    try {
      setCompanies(await fetchShippingCompanies('COD'));
    } catch (err: any) {
      showMessage('error', err.message || 'Không tải được đơn vị vận chuyển');
    }
  };

  const loadShipments = async () => {
    setLoading(true);
    try {
      setShipments(await fetchShipments({
        shippingCompanyId: selectedCompanyId === 'ALL' ? undefined : selectedCompanyId,
        status: statusFilter,
        onlyCod: true,
      }));
    } catch (err: any) {
      showMessage('error', err.message || 'Không tải được vận đơn');
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4200);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleCopy = (shipment: ShipmentResponse) => {
    navigator.clipboard.writeText(shipment.trackingCode);
    setCopiedId(shipment.id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleAdvanceStatus = async (shipment: ShipmentResponse, nextStatus: string) => {
    setActionId(shipment.id);
    try {
      await updateShippingStatus(shipment.id, nextStatus);
      showMessage('success', `Đã cập nhật vận đơn ${shipment.trackingCode}`);
      await loadShipments();
    } catch (err: any) {
      showMessage('error', err.message || 'Cập nhật vận đơn thất bại');
    } finally {
      setActionId(null);
    }
  };

  const handleConfirmCod = async (shipment: ShipmentResponse) => {
    setActionId(shipment.id);
    try {
      await confirmCodPayment(shipment.id, user?.name);
      showMessage('success', `Đã xác nhận thu COD cho ${shipment.trackingCode}`);
      await loadShipments();
    } catch (err: any) {
      showMessage('error', err.message || 'Xác nhận COD thất bại');
    } finally {
      setActionId(null);
    }
  };

  const stats = useMemo(() => {
    const needCollect = shipments.filter(item => canConfirmCod(item));
    const onRoad = shipments.filter(item =>
      ['AWAITING_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(item.status)
    );
    const done = shipments.filter(item => item.codPaymentConfirmed);

    return {
      total: shipments.length,
      needCollect: needCollect.length,
      onRoad: onRoad.length,
      done: done.length,
      needCollectAmount: needCollect.reduce((sum, item) => sum + item.codAmount, 0),
    };
  }, [shipments]);

  const visibleShipments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return shipments
      .filter(item => {
        if (activeTab === 'collect') return canConfirmCod(item);
        if (activeTab === 'onroad') return ['AWAITING_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(item.status);
        if (activeTab === 'done') return item.codPaymentConfirmed;
        return true;
      })
      .filter(item => {
        if (!query) return true;
        return [
          item.trackingCode,
          item.recipientName,
          item.recipientPhone,
          item.shippingAddress,
          item.buyerName,
          item.sellerName,
        ].some(value => value?.toLowerCase().includes(query));
      });
  }, [shipments, activeTab, searchQuery]);

  if (!user) {
    return <ShipperLogin onLoggedIn={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-900">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Truck size={22} />
            </div>
            <div>
              <p className="font-bold leading-tight text-gray-950">REBIKE Logistics</p>
              <p className="text-xs text-gray-500">Shipper Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
              <UserRound size={16} className="text-gray-400" />
              <div>
                <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                <p className="text-[11px] uppercase text-gray-400">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6">
        <section className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-950">Bàn làm việc shipper</h1>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý lộ trình giao hàng và xác nhận thanh toán COD.
            </p>
          </div>

          <button
            onClick={loadShipments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </section>

        {message && (
          <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
              : 'border-red-100 bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">Tổng vận đơn COD</p>
            <p className="mt-2 text-2xl font-bold text-gray-950">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-white p-4">
            <p className="text-xs text-gray-500">Cần thu COD</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">{stats.needCollect}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white p-4">
            <p className="text-xs text-gray-500">Đang giao</p>
            <p className="mt-2 text-2xl font-bold text-indigo-600">{stats.onRoad}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white p-4">
            <p className="text-xs text-gray-500">Đã thu tiền</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.done}</p>
          </div>
          <div className="rounded-lg border border-red-100 bg-white p-4">
            <p className="text-xs text-gray-500">Tiền cần thu</p>
            <p className="mt-2 text-lg font-bold text-red-600">{formatPrice(stats.needCollectAmount)}</p>
          </div>
        </section>

        <section className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Tìm mã vận đơn, người nhận, số điện thoại, địa chỉ..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={selectedCompanyId}
              onChange={event => {
                const value = event.target.value;
                setSelectedCompanyId(value === 'ALL' ? 'ALL' : Number(value));
              }}
              className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">Tất cả đơn vị</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {QUEUE_TABS.map(tab => {
            const selected = activeTab === tab.value;
            const count = tab.value === 'collect'
              ? stats.needCollect
              : tab.value === 'onroad'
              ? stats.onRoad
              : tab.value === 'done'
              ? stats.done
              : stats.total;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {tab.label} <span className={selected ? 'text-blue-100' : 'text-gray-400'}>({count})</span>
              </button>
            );
          })}
        </section>

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-16 text-center">
            <Loader2 size={32} className="mx-auto mb-3 animate-spin text-blue-500" />
            <p className="text-gray-500">Đang tải vận đơn...</p>
          </div>
        ) : visibleShipments.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-16 text-center">
            <PackageCheck size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-medium text-gray-700">Không có vận đơn phù hợp</p>
          </div>
        ) : (
          <section className="space-y-3">
            {visibleShipments.map(shipment => {
              const statusMeta = STATUS_META[shipment.status] ?? STATUS_META.PENDING;
              const nextAction = getNextAction(shipment.status);
              const working = actionId === shipment.id;

              return (
                <article key={shipment.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_260px]">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-gray-950">Đơn #{shipment.orderId}</span>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusMeta.className}`}>
                          {statusMeta.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          shipment.codPaymentConfirmed
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}>
                          {shipment.codPaymentConfirmed ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                          {shipment.codPaymentConfirmed ? 'Đã thu COD' : 'Chờ thu COD'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
                        <div className="flex items-start gap-2">
                          <Building2 size={16} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Đơn vị</p>
                            <p className="font-semibold text-gray-900">{shipment.shippingCompanyName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <UserRound size={16} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Người nhận</p>
                            <p className="font-semibold text-gray-900">{shipment.recipientName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone size={16} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Điện thoại</p>
                            <p className="font-semibold text-gray-900">{shipment.recipientPhone}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Banknote size={16} className="mt-0.5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Tiền COD</p>
                            <p className="font-bold text-red-600">{formatPrice(shipment.codAmount)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                        <span>{shipment.shippingAddress}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <button
                          onClick={() => handleCopy(shipment)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 font-mono text-blue-600 hover:text-blue-700"
                        >
                          {copiedId === shipment.id ? <Check size={12} /> : <Copy size={12} />}
                          {copiedId === shipment.id ? 'Đã copy' : shipment.trackingCode}
                        </button>
                        {shipment.buyerName && <span>Buyer: {shipment.buyerName}</span>}
                        {shipment.sellerName && <span>Seller: {shipment.sellerName}</span>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {nextAction && (
                        <button
                          onClick={() => handleAdvanceStatus(shipment, nextAction.nextStatus)}
                          disabled={working}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                        >
                          {working ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
                          {working ? 'Đang cập nhật...' : nextAction.label}
                        </button>
                      )}

                      {shipment.codPaymentConfirmed ? (
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                          <p className="font-semibold">Đã thanh toán COD</p>
                          <p className="mt-0.5 text-xs">
                            {shipment.codPaymentConfirmedAt
                              ? new Date(shipment.codPaymentConfirmedAt).toLocaleString('vi-VN')
                              : 'Đã xác nhận'}
                          </p>
                        </div>
                      ) : canConfirmCod(shipment) ? (
                        <button
                          onClick={() => handleConfirmCod(shipment)}
                          disabled={working}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {working ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                          {working ? 'Đang xác nhận...' : 'Đã giao & thu COD'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                          <XCircle size={15} />
                          Không thể xác nhận COD
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
