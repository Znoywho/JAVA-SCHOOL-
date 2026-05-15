import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Plus, Package, Eye, EyeOff, Trash2, ChevronRight,
  AlertCircle, CheckCircle, X, Bike, Pencil, ImagePlus,
  ClipboardList, Truck, Clock, MapPin, Copy, Check,
  CheckCircle2, XCircle, Loader2, MessageCircle,
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  fetchBrands, fetchCategories, createBike, fetchSellerProducts,
  updateProductStatus, deleteProduct, updateProduct, addProductMedia,
  deleteProductMedia, formatPrice, fetchSellerOrders, updateShippingStatus,
  type Brand, type Category, type Product, type BikeCreateDTO,
  type ProductUpdateDTO, type OrderResponse,
} from '../services/api';

const PRODUCT_STATUSES = [
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'PUBLISHED', label: 'Đang bán' },
  { value: 'HIDDEN', label: 'Ẩn' },
  { value: 'DELETED', label: 'Đã xóa' },
];

export function SellerDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Redirect if not seller
  useEffect(() => {
    if (!user || user.role !== 'SELLER') {
      navigate('/login');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState<'products' | 'create' | 'orders'>('products');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductUpdateDTO>>({});
  const [mediaForm, setMediaForm] = useState({
    mediaUrl: '',
    mediaType: 'IMAGE',
    thumbnail: false,
  });
  const [sellerOrders, setSellerOrders] = useState<OrderResponse[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [updatingShipmentId, setUpdatingShipmentId] = useState<number | null>(null);
  const [copiedTrackingOrderId, setCopiedTrackingOrderId] = useState<number | null>(null);

  // Form state
  const [form, setForm] = useState<Partial<BikeCreateDTO>>({
    title: '',
    price: 0,
    total: 1,
    brandId: 0,
    categoryId: 0,
    conditionPercent: 85,
    status: 'DRAFT',
    frameSize: 'M (54cm)',
    wheelSize: '700c',
    verified: false,
    minRiderHeight: 165,
    maxRiderHeight: 180,
    maxWeightCapacityKg: 110,
    weightKg: 7.5,
    color: '',
  });

  // Load data
  useEffect(() => {
    Promise.all([fetchBrands(), fetchCategories()]).then(([b, c]) => {
      setBrands(b);
      setCategories(c);
      if (b.length > 0) setForm(prev => ({ ...prev, brandId: b[0].id }));
      if (c.length > 0) setForm(prev => ({ ...prev, categoryId: c[0].id }));
    });
  }, []);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadSellerOrders();
    }
  }, [user?.id]);

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchSellerProducts(user.id);
      setProducts(data.products);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadSellerOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const data = await fetchSellerOrders(user.id);
      setSellerOrders(data.sort((a: OrderResponse, b: OrderResponse) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      // fallback
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateShippingStatus = async (shipmentId: number, newStatus: string) => {
    setUpdatingShipmentId(shipmentId);
    try {
      await updateShippingStatus(shipmentId, newStatus);
      showMessage('success', 'Cập nhật trạng thái giao hàng thành công');
      await loadSellerOrders();
    } catch (err: any) {
      showMessage('error', err.message || 'Cập nhật thất bại');
    } finally {
      setUpdatingShipmentId(null);
    }
  };

  const handleCopyTrackingCode = (orderId: number, trackingCode: string) => {
    navigator.clipboard.writeText(trackingCode);
    setCopiedTrackingOrderId(orderId);
    setTimeout(() => setCopiedTrackingOrderId(null), 2000);
  };

  const getNextShippingAction = (status: string): { label: string; nextStatus: string; color: string } | null => {
    switch (status) {
      case 'PENDING':          return { label: 'Xác nhận & chuẩn bị',  nextStatus: 'AWAITING_PICKUP',  color: 'bg-amber-500 hover:bg-amber-600' };
      case 'AWAITING_PICKUP':  return { label: 'Đã lấy hàng',          nextStatus: 'PICKED_UP',        color: 'bg-blue-500 hover:bg-blue-600' };
      case 'PICKED_UP':        return { label: 'Đang vận chuyển',      nextStatus: 'IN_TRANSIT',       color: 'bg-indigo-500 hover:bg-indigo-600' };
      case 'IN_TRANSIT':       return { label: 'Đang giao',            nextStatus: 'OUT_FOR_DELIVERY', color: 'bg-violet-500 hover:bg-violet-600' };
      case 'OUT_FOR_DELIVERY': return { label: 'Xác nhận đã giao',     nextStatus: 'DELIVERED',        color: 'bg-emerald-500 hover:bg-emerald-600' };
      default: return null;
    }
  };

  const SELLER_ORDER_FILTERS = [
    { value: 'ALL',       label: 'Tất cả' },
    { value: 'PENDING',   label: 'Chờ xác nhận' },
    { value: 'SHIPPING',  label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  const SHIPPING_STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING:          { label: 'Chờ xử lý',          color: 'text-amber-600' },
    AWAITING_PICKUP:  { label: 'Chờ shipper lấy',    color: 'text-orange-600' },
    PICKED_UP:        { label: 'Đã lấy hàng',       color: 'text-blue-600' },
    IN_TRANSIT:       { label: 'Đang vận chuyển',    color: 'text-indigo-600' },
    OUT_FOR_DELIVERY: { label: 'Đang giao',          color: 'text-violet-600' },
    DELIVERED:        { label: 'Đã giao thành công', color: 'text-emerald-600' },
    CANCELLED:        { label: 'Đã hủy',             color: 'text-red-600' },
    RETURNED:         { label: 'Hoàn trả',           color: 'text-gray-600' },
  };

  const filteredSellerOrders = orderFilter === 'ALL'
    ? sellerOrders
    : sellerOrders.filter(o => o.orderStatus === orderFilter);

  // Form handlers
  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateEditForm = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      sellerId: user?.id ?? 0,
      title: product.title,
      price: product.price,
      total: product.total,
      brandId: product.brandId ?? brands[0]?.id ?? 0,
      categoryId: product.categoryId ?? categories[0]?.id ?? 0,
      conditionPercent: product.conditionPercent,
      status: product.status,
    });
    setMediaForm({ mediaUrl: '', mediaType: 'IMAGE', thumbnail: false });
    window.scrollTo({ top: 240, behavior: 'smooth' });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.title?.trim()) {
      showMessage('error', 'Vui lòng nhập tiêu đề sản phẩm');
      return;
    }
    if (!form.price || form.price <= 0) {
      showMessage('error', 'Vui lòng nhập giá hợp lệ');
      return;
    }

    setLoading(true);
    try {
      await createBike({
        sellerId: user.id,
        title: form.title!,
        price: form.price!,
        total: form.total ?? 1,
        brandId: form.brandId!,
        categoryId: form.categoryId!,
        conditionPercent: form.conditionPercent ?? 85,
        status: form.status ?? 'DRAFT',
        frameSize: form.frameSize ?? 'M',
        wheelSize: form.wheelSize ?? '700c',
        verified: form.verified ?? false,
        minRiderHeight: form.minRiderHeight ?? 165,
        maxRiderHeight: form.maxRiderHeight ?? 180,
        maxWeightCapacityKg: form.maxWeightCapacityKg ?? 110,
        weightKg: form.weightKg ?? 7.5,
        color: form.color ?? '',
      });

      showMessage('success', 'Đăng tin xe đạp thành công! 🎉');
      setForm(prev => ({ ...prev, title: '', price: 0, color: '' }));
      setActiveTab('products');
      loadProducts();
    } catch (err: any) {
      showMessage('error', err.message || 'Đăng tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId: number, newStatus: string) => {
    if (!user) return;
    try {
      await updateProductStatus(productId, user.id, newStatus);
      showMessage('success', `Đã ${newStatus === 'PUBLISHED' ? 'đăng' : 'ẩn'} sản phẩm`);
      loadProducts();
    } catch (err: any) {
      showMessage('error', err.message);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingProduct) return;

    if (!editForm.title?.trim()) {
      showMessage('error', 'Vui lòng nhập tiêu đề sản phẩm');
      return;
    }
    if (!editForm.price || editForm.price <= 0) {
      showMessage('error', 'Vui lòng nhập giá hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const updated = await updateProduct(editingProduct.id, {
        sellerId: user.id,
        title: editForm.title!,
        price: editForm.price!,
        total: editForm.total ?? 1,
        brandId: editForm.brandId!,
        categoryId: editForm.categoryId!,
        conditionPercent: editForm.conditionPercent ?? 85,
        status: editForm.status ?? editingProduct.status,
      });
      showMessage('success', 'Cập nhật sản phẩm thành công');
      setEditingProduct(updated);
      await loadProducts();
    } catch (err: any) {
      showMessage('error', err.message || 'Cập nhật sản phẩm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingProduct) return;
    if (!mediaForm.mediaUrl.trim()) {
      showMessage('error', 'Vui lòng nhập đường dẫn media');
      return;
    }

    try {
      const media = await addProductMedia(editingProduct.id, {
        sellerId: user.id,
        mediaUrl: mediaForm.mediaUrl.trim(),
        mediaType: mediaForm.mediaType,
        thumbnail: mediaForm.thumbnail,
      });
      const nextProduct = {
        ...editingProduct,
        media: [...(editingProduct.media ?? []), media],
      };
      setEditingProduct(nextProduct);
      setProducts(prev => prev.map(p => p.id === nextProduct.id ? nextProduct : p));
      setMediaForm({ mediaUrl: '', mediaType: 'IMAGE', thumbnail: false });
      showMessage('success', 'Đã thêm media cho sản phẩm');
    } catch (err: any) {
      showMessage('error', err.message || 'Thêm media thất bại');
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!user || !editingProduct) return;
    try {
      await deleteProductMedia(editingProduct.id, mediaId, user.id);
      const nextProduct = {
        ...editingProduct,
        media: (editingProduct.media ?? []).filter(media => media.id !== mediaId),
      };
      setEditingProduct(nextProduct);
      setProducts(prev => prev.map(p => p.id === nextProduct.id ? nextProduct : p));
      showMessage('success', 'Đã xóa media');
    } catch (err: any) {
      showMessage('error', err.message || 'Xóa media thất bại');
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await deleteProduct(productId);
      showMessage('success', 'Đã xóa sản phẩm');
      loadProducts();
    } catch (err: any) {
      showMessage('error', err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Seller Dashboard</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Toast Message */}
        {message && (
          <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium animate-in slide-in-from-right ${
            message.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
            <button onClick={() => setMessage(null)}><X size={16} /></button>
          </div>
        )}

        {/* User Info */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Package size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-blue-200 text-sm">{user.email} • {user.role}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-3xl font-bold">{products.length}</p>
              <p className="text-blue-200 text-sm">Sản phẩm</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Package size={18} />
            Sản phẩm của tôi
          </button>
          <button
            onClick={() => { setActiveTab('orders'); loadSellerOrders(); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ClipboardList size={18} />
            Đơn hàng
            {sellerOrders.filter(o => o.orderStatus === 'PENDING').length > 0 && (
              <span className="ml-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {sellerOrders.filter(o => o.orderStatus === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Plus size={18} />
            Đăng tin mới
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' ? (
          /* ===== MY PRODUCTS ===== */
          <div className="space-y-6">
          {editingProduct && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Pencil size={20} className="text-blue-600" />
                    Chỉnh sửa sản phẩm
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{editingProduct.title}</p>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Đóng"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-12">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề</label>
                  <input
                    type="text"
                    value={editForm.title ?? ''}
                    onChange={e => updateEditForm('title', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá bán</label>
                  <input
                    type="number"
                    value={editForm.price ?? ''}
                    onChange={e => updateEditForm('price', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số lượng</label>
                  <input
                    type="number"
                    value={editForm.total ?? 1}
                    onChange={e => updateEditForm('total', parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                    min="1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tình trạng</label>
                  <input
                    type="number"
                    value={editForm.conditionPercent ?? 85}
                    onChange={e => updateEditForm('conditionPercent', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Thương hiệu</label>
                  <select
                    value={editForm.brandId ?? 0}
                    onChange={e => updateEditForm('brandId', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  >
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại xe</label>
                  <select
                    value={editForm.categoryId ?? 0}
                    onChange={e => updateEditForm('categoryId', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
                  <select
                    value={editForm.status ?? 'DRAFT'}
                    onChange={e => updateEditForm('status', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  >
                    {PRODUCT_STATUSES.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-11" />
                <div className="md:col-span-1 flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    Lưu
                  </button>
                </div>
              </form>

              <div className="border-t border-gray-100 mt-6 pt-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ImagePlus size={18} className="text-blue-600" />
                  Media sản phẩm
                </h3>
                <form onSubmit={handleAddMedia} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
                  <input
                    type="url"
                    value={mediaForm.mediaUrl}
                    onChange={e => setMediaForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                    placeholder="https://.../anh-xe.jpg"
                    className="md:col-span-6 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  />
                  <select
                    value={mediaForm.mediaType}
                    onChange={e => setMediaForm(prev => ({ ...prev, mediaType: e.target.value }))}
                    className="md:col-span-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  >
                    <option value="IMAGE">IMAGE</option>
                    <option value="VIDEO">VIDEO</option>
                  </select>
                  <label className="md:col-span-2 flex items-center gap-2 px-3 py-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={mediaForm.thumbnail}
                      onChange={e => setMediaForm(prev => ({ ...prev, thumbnail: e.target.checked }))}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                    Thumbnail
                  </label>
                  <button
                    type="submit"
                    className="md:col-span-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors text-sm"
                  >
                    Thêm media
                  </button>
                </form>

                {(editingProduct.media ?? []).length === 0 ? (
                  <p className="text-sm text-gray-400">Sản phẩm này chưa có media.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(editingProduct.media ?? []).map(media => (
                      <div key={media.id} className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                        {media.mediaType === 'VIDEO' ? (
                          <video src={media.mediaUrl} className="w-full aspect-video object-cover" controls />
                        ) : (
                          <img src={media.mediaUrl} alt="" className="w-full aspect-video object-cover" />
                        )}
                        <div className="flex items-center justify-between gap-2 px-3 py-2">
                          <span className="text-xs text-gray-500 truncate">
                            {media.thumbnail ? 'Thumbnail' : media.mediaType}
                          </span>
                          <button
                            onClick={() => handleDeleteMedia(media.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                            title="Xóa media"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                Đang tải...
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bike size={36} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có sản phẩm nào</h3>
                <p className="text-gray-500 text-sm mb-4">Bắt đầu đăng tin xe đạp của bạn</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Đăng tin ngay
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Sản phẩm</div>
                  <div className="col-span-2">Giá</div>
                  <div className="col-span-2">Trạng thái</div>
                  <div className="col-span-1">SL</div>
                  <div className="col-span-2 text-right">Thao tác</div>
                </div>

                {products.map(product => (
                  <div key={product.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors">
                    {/* Product info */}
                    <div className="col-span-5">
                      <Link to={`/products/${product.id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm line-clamp-1">
                        {product.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {product.brand} • {product.category} • {product.conditionPercent}%
                      </p>
                    </div>

                    {/* Price */}
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.status === 'PUBLISHED'
                          ? 'bg-green-50 text-green-700'
                          : product.status === 'DRAFT'
                          ? 'bg-yellow-50 text-yellow-700'
                          : product.status === 'HIDDEN'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {product.status === 'PUBLISHED' ? '🟢 Đang bán' :
                         product.status === 'DRAFT' ? '🟡 Nháp' :
                         product.status === 'HIDDEN' ? '⚪ Ẩn' : '🔴 Đã xóa'}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="col-span-1 text-sm text-gray-600">
                      {product.total}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      {product.status === 'DRAFT' && (
                        <button
                          onClick={() => handleStatusChange(product.id, 'PUBLISHED')}
                          title="Đăng bán"
                          className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      {product.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleStatusChange(product.id, 'HIDDEN')}
                          title="Ẩn sản phẩm"
                          className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors"
                        >
                          <EyeOff size={16} />
                        </button>
                      )}
                      {product.status === 'HIDDEN' && (
                        <button
                          onClick={() => handleStatusChange(product.id, 'PUBLISHED')}
                          title="Đăng lại"
                          className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => startEdit(product)}
                        title="Sửa sản phẩm"
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        title="Xóa"
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        ) : activeTab === 'orders' ? (
          /* ===== SELLER ORDERS ===== */
          <div className="space-y-4">
            {/* Order Filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {SELLER_ORDER_FILTERS.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setOrderFilter(filter.value)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    orderFilter === filter.value
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {filter.label}
                  {filter.value !== 'ALL' && (
                    <span className="ml-1.5 opacity-70">
                      ({sellerOrders.filter(o => o.orderStatus === filter.value).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                <Loader2 size={32} className="animate-spin text-indigo-500 mx-auto mb-3" />
                <p className="text-gray-500">Đang tải đơn hàng...</p>
              </div>
            ) : filteredSellerOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                <ClipboardList size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">
                  {orderFilter === 'ALL' ? 'Chưa có đơn hàng nào' : `Không có đơn "${SELLER_ORDER_FILTERS.find(f => f.value === orderFilter)?.label}"`}
                </p>
              </div>
            ) : (
              filteredSellerOrders.map(order => {
                const shipment = order.shipment;
                const shippingStatus = shipment ? SHIPPING_STATUS_LABELS[shipment.status] : null;
                const nextAction = shipment ? getNextShippingAction(shipment.status) : null;
                const isUpdating = shipment && updatingShipmentId === shipment.id;
                const waitingCodConfirmation = order.paymentMethod === 'COD'
                  && order.billStatus !== 'PAID'
                  && shipment?.status === 'DELIVERED';

                return (
                  <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Order header */}
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
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          order.orderStatus === 'PENDING'   ? 'bg-amber-50 border-amber-200 text-amber-700' :
                          order.orderStatus === 'CONFIRMED' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                          order.orderStatus === 'SHIPPING'  ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                          order.orderStatus === 'DELIVERED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          'bg-red-50 border-red-200 text-red-700'
                        }`}>
                          {order.orderStatus === 'PENDING' ? 'Chờ xác nhận' :
                           order.orderStatus === 'CONFIRMED' ? 'Đã xác nhận' :
                           order.orderStatus === 'SHIPPING' ? 'Đang giao' :
                           order.orderStatus === 'DELIVERED' ? 'Đã giao' : 'Đã hủy'}
                        </span>
                        <span className={`text-xs font-medium ${
                          order.billStatus === 'PAID' ? 'text-emerald-600' :
                          order.billStatus === 'CANCELLED' ? 'text-red-500' : 'text-amber-600'
                        }`}>
                          {order.billStatus === 'PAID' ? '✓ Đã thanh toán' :
                           order.billStatus === 'CANCELLED' ? 'Đã hủy' :
                           waitingCodConfirmation ? 'Chờ vận chuyển xác nhận COD' : 'Chờ thanh toán'}
                        </span>
                      </div>
                    </div>

                    {/* Order body */}
                    <div className="p-5">
                      {/* Buyer info */}
                      <div className="text-sm text-gray-600 mb-3">
                        Buyer: <span className="font-semibold text-gray-900">{order.buyerName}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        Thanh toán: <span className="font-medium">{order.paymentMethod}</span>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 mb-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 truncate mr-3 flex-1">{item.productTitle}</span>
                            <span className="text-gray-500 whitespace-nowrap">x{item.quantity} · {formatPrice(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Shipping info */}
                      {shipment && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Truck size={15} className="text-gray-400" />
                              <span className="text-gray-600">{shipment.shippingCompanyName}</span>
                              {shippingStatus && (
                                <>
                                  <span className="text-gray-300">·</span>
                                  <span className={`font-semibold ${shippingStatus.color}`}>{shippingStatus.label}</span>
                                </>
                              )}
                            </div>
                            {shipment.trackingCode && (
                              <button
                                onClick={() => handleCopyTrackingCode(order.id, shipment.trackingCode)}
                                className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md hover:text-blue-700"
                              >
                                {copiedTrackingOrderId === order.id ? (
                                  <><Check size={12} /> Đã copy</>
                                ) : (
                                  <><Copy size={12} /> {shipment.trackingCode}</>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Recipient info */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-gray-700">{shipment.recipientName}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span>{shipment.recipientPhone}</span>
                            </div>
                            <div className="flex items-start gap-1.5 sm:col-span-1">
                              <MapPin size={12} className="mt-0.5 shrink-0" />
                              <span className="line-clamp-2">{shipment.shippingAddress}</span>
                            </div>
                            {order.paymentMethod === 'COD' && shipment.codAmount > 0 && (
                              <div className="sm:col-span-3 pt-1 text-gray-600">
                                COD: <span className="font-semibold text-red-600">{formatPrice(shipment.codAmount)}</span>
                                <span className="mx-2 text-gray-300">|</span>
                                {shipment.codPaymentConfirmed ? 'Đơn vị vận chuyển đã thu tiền' : 'Chờ đơn vị vận chuyển thu tiền'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer with total and action button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        <div className="text-sm">
                          <span className="text-gray-500">Ship: {formatPrice(order.shippingFee)}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-lg font-bold text-red-600">{formatPrice(order.totalPrice)}</span>
                        </div>
                        <div className="flex gap-2">
                          {order.buyerId && (
                            <Link
                              to={`/chat?with=${order.buyerId}`}
                              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50"
                            >
                              <MessageCircle size={13} />
                              Chat buyer
                            </Link>
                          )}
                          {nextAction && shipment && (
                            <button
                              onClick={() => handleUpdateShippingStatus(shipment.id, nextAction.nextStatus)}
                              disabled={!!isUpdating}
                              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 ${nextAction.color}`}
                            >
                              {isUpdating ? (
                                <><Loader2 size={13} className="animate-spin" /> Đang cập nhật...</>
                              ) : (
                                <><Truck size={13} /> {nextAction.label}</>
                              )}
                            </button>
                          )}
                          {shipment && shipment.status !== 'CANCELLED' && shipment.status !== 'DELIVERED' && (
                            <button
                              onClick={() => handleUpdateShippingStatus(shipment.id, 'CANCELLED')}
                              disabled={!!isUpdating}
                              className="px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                            >
                              Hủy giao
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* ===== CREATE FORM ===== */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bike size={22} className="text-blue-600" />
              Đăng tin xe đạp mới
            </h2>

            <form onSubmit={handleCreate} className="space-y-6">
              {/* Row 1: Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tiêu đề tin đăng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => updateForm('title', e.target.value)}
                  placeholder="VD: Pinarello Dogma F 2025 Shimano Dura-Ace Di2"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm"
                  required
                />
              </div>

              {/* Row 2: Price, Quantity, Condition */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={e => updateForm('price', parseFloat(e.target.value) || 0)}
                    placeholder="35000000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số lượng</label>
                  <input
                    type="number"
                    value={form.total}
                    onChange={e => updateForm('total', parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tình trạng ({form.conditionPercent}%)
                  </label>
                  <input
                    type="range"
                    value={form.conditionPercent}
                    onChange={e => updateForm('conditionPercent', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-3"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Row 3: Brand, Category, Color */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Thương hiệu</label>
                  <select
                    value={form.brandId}
                    onChange={e => updateForm('brandId', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại xe</label>
                  <select
                    value={form.categoryId}
                    onChange={e => updateForm('categoryId', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Màu sắc</label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={e => updateForm('color', e.target.value)}
                    placeholder="VD: Đen/Đỏ"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={e => updateForm('status', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  >
                    {PRODUCT_STATUSES.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Bike Specs */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Thông số kỹ thuật</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Frame Size</label>
                    <select
                      value={form.frameSize}
                      onChange={e => updateForm('frameSize', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      {['XS (48cm)', 'S (51cm)', 'M (54cm)', 'L (56cm)', 'XL (58cm)'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Wheel Size</label>
                    <select
                      value={form.wheelSize}
                      onChange={e => updateForm('wheelSize', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      {['700c', '650b', '29"', '27.5"'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Trọng lượng (kg)</label>
                    <input
                      type="number"
                      value={form.weightKg}
                      onChange={e => updateForm('weightKg', parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tải trọng max (kg)</label>
                    <input
                      type="number"
                      value={form.maxWeightCapacityKg}
                      onChange={e => updateForm('maxWeightCapacityKg', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Chiều cao tối thiểu (cm)</label>
                    <input
                      type="number"
                      value={form.minRiderHeight}
                      onChange={e => updateForm('minRiderHeight', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Chiều cao tối đa (cm)</label>
                    <input
                      type="number"
                      value={form.maxRiderHeight}
                      onChange={e => updateForm('maxRiderHeight', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer p-2.5">
                      <input
                        type="checkbox"
                        checked={form.verified}
                        onChange={e => updateForm('verified', e.target.checked)}
                        className="w-4 h-4 rounded accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">Đã kiểm định</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang đăng...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Đăng tin xe đạp
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
