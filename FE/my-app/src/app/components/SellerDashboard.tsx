import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Plus, Package, Eye, EyeOff, Trash2, ChevronRight,
  AlertCircle, CheckCircle, X, Bike
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  fetchBrands, fetchCategories, createBike, fetchSellerProducts,
  updateProductStatus, deleteProduct, formatPrice,
  type Brand, type Category, type Product, type BikeCreateDTO,
} from '../services/api';

export function SellerDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Redirect if not seller
  useEffect(() => {
    if (!user || user.role !== 'SELLER') {
      navigate('/login');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState<'products' | 'create'>('products');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [form, setForm] = useState<Partial<BikeCreateDTO>>({
    title: '',
    price: 0,
    total: 1,
    brandId: 0,
    categoryId: 0,
    conditionPercent: 85,
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
    if (user) loadProducts();
  }, [user]);

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

  // Form handlers
  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
    try {
      await updateProductStatus(productId, newStatus);
      showMessage('success', `Đã ${newStatus === 'PUBLISHED' ? 'đăng' : 'ẩn'} sản phẩm`);
      loadProducts();
    } catch (err: any) {
      showMessage('error', err.message);
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
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'products'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Package size={18} />
            Sản phẩm của tôi
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
