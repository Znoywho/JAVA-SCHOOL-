import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  UserCog,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  cancelAdminOrder,
  confirmBankTransfer,
  createAdminUser,
  deleteAdminUser,
  fetchAdminOrders,
  fetchAdminUsers,
  formatPrice,
  updateAdminOrderStatus,
  updateAdminUser,
  type AdminUser,
  type AdminUserPayload,
  type AdminUserRole,
  type OrderResponse,
} from '../services/api';

type AdminTab = 'users' | 'orders';

const ROLE_OPTIONS: Array<{ value: AdminUserRole | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Tất cả role' },
  { value: 'BUYER', label: 'Buyer' },
  { value: 'SELLER', label: 'Seller' },
  { value: 'INSPECTOR', label: 'Inspector' },
  { value: 'SHIPPER', label: 'Shipper' },
  { value: 'ADMIN', label: 'Admin' },
];

const ROLE_BADGE: Record<AdminUserRole, string> = {
  BUYER: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  SELLER: 'border-blue-200 bg-blue-50 text-blue-700',
  INSPECTOR: 'border-violet-200 bg-violet-50 text-violet-700',
  SHIPPER: 'border-orange-200 bg-orange-50 text-orange-700',
  ADMIN: 'border-gray-300 bg-gray-900 text-white',
};

const ORDER_STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const BILL_STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả thanh toán' },
  { value: 'PENDING', label: 'Chờ thanh toán' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const PAYMENT_OPTIONS = [
  { value: 'ALL', label: 'Tất cả phương thức' },
  { value: 'COD', label: 'COD' },
  { value: 'BANK_TRANSFER', label: 'Chuyển khoản' },
  { value: 'CARD', label: 'Thẻ' },
];

const ORDER_STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Chờ xác nhận', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  CONFIRMED: { label: 'Đã xác nhận', className: 'border-blue-200 bg-blue-50 text-blue-700' },
  SHIPPING: { label: 'Đang giao', className: 'border-indigo-200 bg-indigo-50 text-indigo-700' },
  DELIVERED: { label: 'Đã giao', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  CANCELLED: { label: 'Đã hủy', className: 'border-red-200 bg-red-50 text-red-700' },
};

const BILL_STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Chờ thanh toán', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  PAID: { label: 'Đã thanh toán', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  CANCELLED: { label: 'Đã hủy', className: 'border-red-200 bg-red-50 text-red-700' },
};

const emptyUserForm: AdminUserPayload = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'BUYER',
};

function getOrderStatusMeta(status: string) {
  return ORDER_STATUS_META[status] ?? ORDER_STATUS_META.PENDING;
}

function getBillStatusMeta(status: string) {
  return BILL_STATUS_META[status] ?? BILL_STATUS_META.PENDING;
}

function canCancelOrder(order: OrderResponse) {
  return order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED';
}

function canConfirmBankTransfer(order: OrderResponse) {
  return order.paymentMethod === 'BANK_TRANSFER'
    && order.billStatus === 'PENDING'
    && order.orderStatus !== 'CANCELLED';
}

export function AdminDashboardPage({ initialTab = 'users' }: { initialTab?: AdminTab }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | 'ALL'>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [billStatusFilter, setBillStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState<AdminUserPayload>(emptyUserForm);
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [actingOrderId, setActingOrderId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      setMessage({ type: 'error', text: 'Tài khoản này không có quyền vào trang quản trị.' });
      setUsersLoading(false);
      setOrdersLoading(false);
      return;
    }

    loadUsers();
    loadOrders();
  }, [user?.id]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4200);
  };

  const switchTab = (tab: AdminTab) => {
    setActiveTab(tab);
    navigate(tab === 'users' ? '/admin/users' : '/admin/orders');
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await fetchAdminUsers();
      setUsers(data.sort((a, b) => a.id - b.id));
    } catch (err: any) {
      showMessage('error', err.message || 'Không tải được danh sách user');
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await fetchAdminOrders();
      setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      showMessage('error', err.message || 'Không tải được danh sách đơn hàng');
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const startCreateUser = () => {
    setEditingUser(null);
    setUserForm(emptyUserForm);
  };

  const startEditUser = (target: AdminUser) => {
    setEditingUser(target);
    setUserForm({
      name: target.name,
      email: target.email,
      phone: target.phone ?? '',
      password: '',
      role: target.role,
    });
  };

  const handleSaveUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingUser(true);

    try {
      if (editingUser) {
        await updateAdminUser(editingUser.id, userForm);
        showMessage('success', `Đã cập nhật user #${editingUser.id}`);
      } else {
        await createAdminUser(userForm);
        showMessage('success', 'Đã tạo user mới');
      }

      startCreateUser();
      await loadUsers();
    } catch (err: any) {
      showMessage('error', err.message || 'Lưu user thất bại');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (target: AdminUser) => {
    if (target.id === user?.id) {
      showMessage('error', 'Không thể xóa chính tài khoản admin đang đăng nhập.');
      return;
    }

    if (!confirm(`Xóa user ${target.name}?`)) return;

    setDeletingUserId(target.id);
    try {
      await deleteAdminUser(target.id);
      showMessage('success', `Đã xóa user #${target.id}`);
      await loadUsers();
      if (editingUser?.id === target.id) startCreateUser();
    } catch (err: any) {
      showMessage('error', err.message || 'Xóa user thất bại');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleUpdateOrderStatus = async (order: OrderResponse, nextStatus: string) => {
    if (nextStatus === order.orderStatus) return;

    setActingOrderId(order.id);
    try {
      await updateAdminOrderStatus(order.id, nextStatus);
      showMessage('success', `Đã cập nhật trạng thái đơn #${order.id}`);
      await loadOrders();
    } catch (err: any) {
      showMessage('error', err.message || 'Cập nhật đơn hàng thất bại');
    } finally {
      setActingOrderId(null);
    }
  };

  const handleCancelOrder = async (order: OrderResponse) => {
    if (!canCancelOrder(order) || !confirm(`Hủy đơn #${order.id}?`)) return;

    setActingOrderId(order.id);
    try {
      await cancelAdminOrder(order.id);
      showMessage('success', `Đã hủy đơn #${order.id}`);
      await loadOrders();
    } catch (err: any) {
      showMessage('error', err.message || 'Hủy đơn thất bại');
    } finally {
      setActingOrderId(null);
    }
  };

  const handleConfirmBankTransfer = async (order: OrderResponse) => {
    if (!canConfirmBankTransfer(order)) return;

    setActingOrderId(order.id);
    try {
      await confirmBankTransfer(order.id, user?.name);
      showMessage('success', `Đã xác nhận chuyển khoản đơn #${order.id}`);
      await loadOrders();
    } catch (err: any) {
      showMessage('error', err.message || 'Xác nhận chuyển khoản thất bại');
    } finally {
      setActingOrderId(null);
    }
  };

  const userStats = useMemo(() => {
    return {
      total: users.length,
      buyers: users.filter(item => item.role === 'BUYER').length,
      sellers: users.filter(item => item.role === 'SELLER').length,
      admins: users.filter(item => item.role === 'ADMIN').length,
    };
  }, [users]);

  const orderStats = useMemo(() => {
    const pending = orders.filter(order => order.orderStatus === 'PENDING');
    const paid = orders.filter(order => order.billStatus === 'PAID');
    const cancelled = orders.filter(order => order.orderStatus === 'CANCELLED');

    return {
      total: orders.length,
      pending: pending.length,
      paid: paid.length,
      cancelled: cancelled.length,
      paidAmount: paid.reduce((sum, order) => sum + order.totalPrice, 0),
    };
  }, [orders]);

  const visibleUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();

    return users
      .filter(item => roleFilter === 'ALL' || item.role === roleFilter)
      .filter(item => {
        if (!query) return true;
        return [String(item.id), item.name, item.email, item.phone, item.role]
          .some(value => value?.toLowerCase().includes(query));
      });
  }, [users, roleFilter, userSearch]);

  const visibleOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase();

    return orders
      .filter(order => orderStatusFilter === 'ALL' || order.orderStatus === orderStatusFilter)
      .filter(order => billStatusFilter === 'ALL' || order.billStatus === billStatusFilter)
      .filter(order => paymentFilter === 'ALL' || order.paymentMethod === paymentFilter)
      .filter(order => {
        if (!query) return true;
        return [
          String(order.id),
          order.buyerName,
          order.sellerName,
          order.paymentMethod,
          order.shipment?.trackingCode,
          ...order.items.map(item => item.productTitle),
        ].some(value => value?.toLowerCase().includes(query));
      });
  }, [orders, orderStatusFilter, billStatusFilter, paymentFilter, orderSearch]);

  if (user && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-lg border border-red-100 bg-white p-8 text-center">
          <ShieldCheck size={36} className="mx-auto mb-3 text-red-400" />
          <h1 className="text-xl font-bold text-gray-950">Không có quyền truy cập</h1>
          <p className="mt-2 text-sm text-gray-500">Chỉ tài khoản ADMIN mới vào được trang quản trị.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-[1320px] px-4 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <ShieldCheck size={14} />
                Admin control
              </div>
              <h1 className="text-2xl font-bold text-gray-950">Quản trị REBIKE</h1>
              <p className="mt-1 text-sm text-gray-500">Quản lí user, đơn hàng và trạng thái thanh toán.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => switchTab('users')}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                  activeTab === 'users'
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users size={16} />
                User
              </button>
              <button
                onClick={() => switchTab('orders')}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                  activeTab === 'orders'
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ShoppingBag size={16} />
                Đơn hàng
              </button>
              <Link
                to="/admin/payments"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                <Banknote size={16} />
                Chuyển khoản
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1320px] px-4 py-6">
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

        {activeTab === 'users' ? (
          <>
            <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Tổng user</p>
                <p className="mt-2 text-2xl font-bold text-gray-950">{userStats.total}</p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-white p-4">
                <p className="text-xs text-gray-500">Buyer</p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">{userStats.buyers}</p>
              </div>
              <div className="rounded-lg border border-blue-100 bg-white p-4">
                <p className="text-xs text-gray-500">Seller</p>
                <p className="mt-2 text-2xl font-bold text-blue-600">{userStats.sellers}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Admin</p>
                <p className="mt-2 text-2xl font-bold text-gray-950">{userStats.admins}</p>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
              <div className="min-w-0">
                <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_120px]">
                    <div className="relative">
                      <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={userSearch}
                        onChange={event => setUserSearch(event.target.value)}
                        placeholder="Tìm theo tên, email, số điện thoại..."
                        className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={roleFilter}
                      onChange={event => setRoleFilter(event.target.value as AdminUserRole | 'ALL')}
                      className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      {ROLE_OPTIONS.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={loadUsers}
                      disabled={usersLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                      <RefreshCw size={15} className={usersLoading ? 'animate-spin' : ''} />
                      Tải lại
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <div className="grid grid-cols-[72px_1.4fr_1.5fr_150px_160px] gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    <span>ID</span>
                    <span>Tên</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span className="text-right">Thao tác</span>
                  </div>

                  {usersLoading ? (
                    <div className="p-12 text-center text-gray-500">
                      <Loader2 size={28} className="mx-auto mb-3 animate-spin text-blue-500" />
                      Đang tải user...
                    </div>
                  ) : visibleUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">Không có user phù hợp</div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {visibleUsers.map(item => (
                        <div key={item.id} className="grid grid-cols-1 gap-3 px-4 py-4 text-sm md:grid-cols-[72px_1.4fr_1.5fr_150px_160px] md:items-center">
                          <span className="font-mono text-gray-500">#{item.id}</span>
                          <div>
                            <p className="font-semibold text-gray-950">{item.name}</p>
                            <p className="mt-1 text-xs text-gray-500">{item.phone || 'Chưa có SĐT'}</p>
                          </div>
                          <span className="text-gray-700">{item.email}</span>
                          <span className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${ROLE_BADGE[item.role]}`}>
                            {item.role}
                          </span>
                          <div className="flex justify-start gap-2 md:justify-end">
                            <button
                              onClick={() => startEditUser(item)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                            >
                              <UserCog size={14} />
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteUser(item)}
                              disabled={deletingUserId === item.id || item.id === user?.id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingUserId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveUser} className="h-fit rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-950">{editingUser ? `Sửa user #${editingUser.id}` : 'Tạo user'}</h2>
                    <p className="mt-1 text-xs text-gray-500">{editingUser ? 'Để trống mật khẩu nếu không đổi.' : 'Mật khẩu bắt buộc khi tạo mới.'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={startCreateUser}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    <UserPlus size={14} />
                    Mới
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Tên</span>
                    <input
                      value={userForm.name}
                      onChange={event => setUserForm(prev => ({ ...prev, name: event.target.value }))}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={event => setUserForm(prev => ({ ...prev, email: event.target.value }))}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Số điện thoại</span>
                    <input
                      value={userForm.phone}
                      onChange={event => setUserForm(prev => ({ ...prev, phone: event.target.value }))}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Role</span>
                    <select
                      value={userForm.role}
                      onChange={event => setUserForm(prev => ({ ...prev, role: event.target.value as AdminUserRole }))}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      {ROLE_OPTIONS.filter(role => role.value !== 'ALL').map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Mật khẩu</span>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={event => setUserForm(prev => ({ ...prev, password: event.target.value }))}
                      required={!editingUser}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={savingUser}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingUser && <Loader2 size={16} className="animate-spin" />}
                  {editingUser ? 'Lưu thay đổi' : 'Tạo user'}
                </button>
              </form>
            </section>
          </>
        ) : (
          <>
            <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Tổng đơn</p>
                <p className="mt-2 text-2xl font-bold text-gray-950">{orderStats.total}</p>
              </div>
              <div className="rounded-lg border border-amber-100 bg-white p-4">
                <p className="text-xs text-gray-500">Chờ xử lý</p>
                <p className="mt-2 text-2xl font-bold text-amber-600">{orderStats.pending}</p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-white p-4">
                <p className="text-xs text-gray-500">Đã thanh toán</p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">{orderStats.paid}</p>
              </div>
              <div className="rounded-lg border border-blue-100 bg-white p-4">
                <p className="text-xs text-gray-500">Doanh thu đã thanh toán</p>
                <p className="mt-2 text-lg font-bold text-blue-600">{formatPrice(orderStats.paidAmount)}</p>
              </div>
            </section>

            <section className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_190px_190px_190px_120px]">
                <div className="relative">
                  <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={orderSearch}
                    onChange={event => setOrderSearch(event.target.value)}
                    placeholder="Tìm mã đơn, buyer, seller, mã vận đơn, sản phẩm..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={event => setOrderStatusFilter(event.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {ORDER_STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <select
                  value={billStatusFilter}
                  onChange={event => setBillStatusFilter(event.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {BILL_STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <select
                  value={paymentFilter}
                  onChange={event => setPaymentFilter(event.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {PAYMENT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <button
                  onClick={loadOrders}
                  disabled={ordersLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  <RefreshCw size={15} className={ordersLoading ? 'animate-spin' : ''} />
                  Tải lại
                </button>
              </div>
            </section>

            {ordersLoading ? (
              <div className="rounded-lg border border-gray-200 bg-white p-16 text-center text-gray-500">
                <Loader2 size={30} className="mx-auto mb-3 animate-spin text-blue-500" />
                Đang tải đơn hàng...
              </div>
            ) : visibleOrders.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-16 text-center text-gray-500">Không có đơn phù hợp</div>
            ) : (
              <section className="space-y-3">
                {visibleOrders.map(order => {
                  const orderMeta = getOrderStatusMeta(order.orderStatus);
                  const billMeta = getBillStatusMeta(order.billStatus);
                  const busy = actingOrderId === order.id;

                  return (
                    <article key={order.id} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
                        <div className="min-w-0">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Link to={`/orders/${order.id}`} className="text-base font-bold text-gray-950 hover:text-blue-600">
                              Đơn #{order.id}
                            </Link>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${orderMeta.className}`}>
                              {order.orderStatus === 'CANCELLED' ? <XCircle size={13} /> : order.orderStatus === 'DELIVERED' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                              {orderMeta.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${billMeta.className}`}>
                              <Banknote size={13} />
                              {billMeta.label}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600">
                              {order.paymentMethod}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
                            <div>
                              <p className="text-xs text-gray-500">Buyer</p>
                              <p className="font-semibold text-gray-900">{order.buyerName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Seller</p>
                              <p className="font-semibold text-gray-900">{order.sellerName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Tổng tiền</p>
                              <p className="font-bold text-red-600">{formatPrice(order.totalPrice)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Tạo lúc</p>
                              <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                          </div>

                          <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                              {order.items.map(item => (
                                <span key={item.id} className="rounded-md bg-white px-2 py-1">
                                  {item.productTitle} x{item.quantity}
                                </span>
                              ))}
                            </div>
                            {order.shipment && (
                              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                                <span>{order.shipment.shippingCompanyName}</span>
                                <span className="font-mono">{order.shipment.trackingCode}</span>
                                <span>{order.shipment.status}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="block">
                            <span className="mb-1 block text-xs font-medium text-gray-500">Trạng thái đơn</span>
                            <select
                              value={order.orderStatus}
                              disabled={busy}
                              onChange={event => handleUpdateOrderStatus(order, event.target.value)}
                              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:opacity-60"
                            >
                              {ORDER_STATUS_OPTIONS.filter(option => option.value !== 'ALL').map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </label>

                          {canConfirmBankTransfer(order) && (
                            <button
                              onClick={() => handleConfirmBankTransfer(order)}
                              disabled={busy}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              {busy ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                              Xác nhận chuyển khoản
                            </button>
                          )}

                          <button
                            onClick={() => handleCancelOrder(order)}
                            disabled={busy || !canCancelOrder(order)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {busy ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                            Hủy đơn
                          </button>

                          <Link
                            to={`/orders/${order.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            <Package size={16} />
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
