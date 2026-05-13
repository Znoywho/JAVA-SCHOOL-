import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  ChevronRight, Heart, ShoppingCart, MessageCircle, Share2,
  Shield, Award, MapPin, Star, ChevronLeft, Minus, Plus, Check,
  Ruler, Weight, Palette, User as UserIcon, CircleGauge, ClipboardCheck
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  addToCart, addToWishlist, checkWishlist, fetchProductById,
  fetchLatestProductReport, formatPrice, getPlaceholderImage, removeFromWishlist,
  type InspectorReport, type Product
} from '../services/api';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [report, setReport] = useState<InspectorReport | null>(null);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'report' | 'seller'>('specs');

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductById(parseInt(id)).then(data => {
        setProduct(data);
        setReport(data.inspectorReport ?? null);
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchLatestProductReport(parseInt(id))
      .then(data => setReport(data))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    const loadWishlistState = async () => {
      const user = getCurrentUser();
      if (!id || !user || user.role !== 'BUYER') return;
      setIsFavorite(await checkWishlist(user.id, parseInt(id)));
    };

    loadWishlistState();
  }, [id]);

  const requireBuyer = () => {
    const user = getCurrentUser();
    if (!user) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này');
      return null;
    }
    if (user.role !== 'BUYER') {
      alert('Chỉ tài khoản buyer mới sử dụng được tính năng này');
      return null;
    }
    return user;
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const user = requireBuyer();
    if (!user) return;

    try {
      await addToCart(user.id, product.id, quantity);
      alert('Đã thêm vào giỏ hàng');
    } catch (err: any) {
      alert(err.message || 'Thêm vào giỏ hàng thất bại');
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    const user = requireBuyer();
    if (!user) return;

    try {
      if (isFavorite) {
        await removeFromWishlist(user.id, product.id);
      } else {
        await addToWishlist(user.id, product.id);
      }
      setIsFavorite(prev => !prev);
    } catch (err: any) {
      alert(err.message || 'Cập nhật wishlist thất bại');
    }
  };

  const productMedia = product?.media?.filter(media => media.mediaUrl) ?? [];
  const productImages = product
    ? productMedia.length > 0
      ? productMedia.map(media => media.mediaUrl)
      : [
          getPlaceholderImage(product.id),
          getPlaceholderImage(product.id + 100),
          getPlaceholderImage(product.id + 200),
          getPlaceholderImage(product.id + 300),
        ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/80">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl" />
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded w-1/3" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50/80 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sản phẩm không tồn tại</h2>
          <p className="text-gray-500 mb-6">Sản phẩm bạn tìm kiếm không có hoặc đã bị xóa.</p>
          <Link to="/products" className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const conditionColor = product.conditionPercent >= 90 ? 'text-emerald-600' :
    product.conditionPercent >= 70 ? 'text-blue-600' : 'text-orange-600';
  const conditionBg = product.conditionPercent >= 90 ? 'bg-emerald-500' :
    product.conditionPercent >= 70 ? 'bg-blue-500' : 'bg-orange-500';

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-blue-600 transition-colors">Danh sách xe</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium truncate max-w-[300px]">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
              {productMedia[selectedImage]?.mediaType === 'VIDEO' ? (
                <video
                  src={productImages[selectedImage]}
                  className="w-full h-full object-contain bg-black"
                  controls
                />
              ) : (
                <img
                  src={productImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain p-8 transition-transform group-hover:scale-105"
                />
              )}

              {/* Verified badge */}
              {product.isVerified && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-lg">
                  <Shield size={14} />
                  Đã kiểm định
                </div>
              )}

              {/* Favorite button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all"
              >
                <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
              </button>

              {/* Image nav arrows */}
              <button
                onClick={() => setSelectedImage(i => i > 0 ? i - 1 : productImages.length - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setSelectedImage(i => i < productImages.length - 1 ? i + 1 : 0)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all
                    ${index === selectedImage
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {productMedia[index]?.mediaType === 'VIDEO' ? (
                    <video src={img} className="w-full h-full object-cover" />
                  ) : (
                    <img src={img} alt="" className="w-full h-full object-contain p-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Brand & Category tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.brand && (
                <Link
                  to={`/products?brand=${product.brandId}`}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  {product.brand}
                </Link>
              )}
              {product.category && (
                <Link
                  to={`/products?category=${product.categoryId}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {product.category}
                </Link>
              )}
              {product.isVerified && (
                <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                  <Award size={14} />
                  Kiểm định
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating placeholder */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={18}
                    className={star <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">4.0 (12 đánh giá)</span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-red-600">
                  {formatPrice(product.price)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Đã bao gồm thuế VAT</p>
            </div>

            {/* Condition */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-800 flex items-center gap-2">
                  <CircleGauge size={18} />
                  Tình trạng xe
                </span>
                <span className={`text-lg font-bold ${conditionColor}`}>
                  {product.conditionPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${conditionBg} transition-all duration-700`}
                  style={{ width: `${product.conditionPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {product.conditionPercent >= 90 ? 'Tình trạng xuất sắc – Gần như mới' :
                 product.conditionPercent >= 70 ? 'Tình trạng tốt – Đã qua sử dụng nhẹ' :
                 'Tình trạng khá – Có dấu hiệu sử dụng'}
              </p>
            </div>

            {/* Inspector report summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-medium text-gray-800 flex items-center gap-2">
                    <ClipboardCheck size={18} />
                    Báo cáo kiểm định
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {report ? `Inspector: ${report.inspectorName || `#${report.inspectorId}`}` : 'Chưa có report từ inspector'}
                  </p>
                </div>
                {report && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    report.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    report.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {report.status === 'APPROVED' ? 'Đạt' : report.status === 'REJECTED' ? 'Không đạt' : 'Theo dõi'}
                  </span>
                )}
              </div>
              {report ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Điểm kiểm định</span>
                    <span className="text-lg font-bold text-gray-900">{Math.round(report.scoreRating)}/100</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${report.scoreRating >= 85 ? 'bg-emerald-500' : report.scoreRating >= 65 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, Math.max(0, report.scoreRating))}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{report.reportDetails}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-4">Bike này đang chờ inspector tạo báo cáo kiểm định.</p>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Số lượng:</span>
                <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2.5 hover:bg-gray-100 rounded-l-xl transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.total, q + 1))}
                    className="p-2.5 hover:bg-gray-100 rounded-r-xl transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Còn {product.total} sản phẩm
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5"
                >
                  <ShoppingCart size={20} />
                  Thêm vào giỏ
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5">
                  <MessageCircle size={20} />
                  Liên hệ
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3.5 rounded-xl border-2 transition-all hover:-translate-y-0.5
                    ${isFavorite
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                </button>
                <button className="p-3.5 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all hover:-translate-y-0.5">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Delivery & Safety Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-900">Bảo hành 30 ngày</p>
                  <p className="text-xs text-blue-600">Đổi trả miễn phí</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Check size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-900">Giao hàng toàn quốc</p>
                  <p className="text-xs text-emerald-600">Nhanh chóng, an toàn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Specs / Description / Seller */}
        <div className="mt-12">
          <div className="flex border-b border-gray-200">
            {(['specs', 'description', 'report', 'seller'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-colors
                  ${activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300'}`}
              >
                {tab === 'specs' ? 'Thông số kỹ thuật' :
                 tab === 'description' ? 'Mô tả' :
                 tab === 'report' ? 'Báo cáo kiểm định' : 'Người bán'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-t-0 border-gray-100 p-6 mt-0">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General specs */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-4">Thông tin chung</h3>
                  {[
                    { icon: <Award size={18} />, label: 'Thương hiệu', value: product.brand },
                    { icon: <CircleGauge size={18} />, label: 'Loại xe', value: product.category },
                    { icon: <Palette size={18} />, label: 'Màu sắc', value: product.color },
                    { icon: <CircleGauge size={18} />, label: 'Tình trạng', value: `${product.conditionPercent}%` },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                        {spec.icon}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-500">{spec.label}</span>
                        <p className="font-medium text-gray-900">{spec.value || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bike specs */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-4">Thông số xe</h3>
                  {[
                    { icon: <Ruler size={18} />, label: 'Khung (Frame)', value: product.frameSize },
                    { icon: <CircleGauge size={18} />, label: 'Bánh xe (Wheel)', value: product.wheelSize },
                    { icon: <UserIcon size={18} />, label: 'Chiều cao phù hợp', value: product.minRiderHeight && product.maxRiderHeight ? `${product.minRiderHeight}cm – ${product.maxRiderHeight}cm` : undefined },
                    { icon: <Weight size={18} />, label: 'Trọng lượng xe', value: product.weightKg ? `${product.weightKg.toFixed(1)} kg` : undefined },
                    { icon: <Weight size={18} />, label: 'Tải trọng tối đa', value: product.maxWeightCapacityKg ? `${product.maxWeightCapacityKg} kg` : undefined },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                        {spec.icon}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-500">{spec.label}</span>
                        <p className="font-medium text-gray-900">{spec.value || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.title} – Xe đạp {product.category?.toLowerCase()} chất lượng cao từ thương hiệu {product.brand}.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Xe trong tình trạng {product.conditionPercent}% với các thành phần chính nguyên bản.
                  {product.isVerified && ' Đã được kiểm định bởi đội ngũ chuyên gia REBIKE, đảm bảo chất lượng và an toàn khi sử dụng.'}
                </p>
                <h3 className="text-gray-900 mt-6">Đặc điểm nổi bật</h3>
                <ul className="text-gray-700">
                  <li>Khung {product.frameSize || 'chất lượng cao'} phù hợp nhiều dáng người</li>
                  <li>Bánh xe {product.wheelSize || 'tiêu chuẩn'} cho trải nghiệm lái êm ái</li>
                  <li>Màu {product.color || 'đẹp mắt'}, thiết kế hiện đại</li>
                  {product.isVerified && <li>Đã kiểm định – An toàn tuyệt đối</li>}
                </ul>
              </div>
            )}

            {activeTab === 'report' && (
              <div>
                {report ? (
                  <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                    <div className="rounded-xl border border-gray-100 p-5">
                      <p className="text-sm text-gray-500">Điểm kiểm định</p>
                      <p className="text-4xl font-extrabold text-gray-900 mt-2">{Math.round(report.scoreRating)}</p>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                        <div
                          className={`h-full ${report.scoreRating >= 85 ? 'bg-emerald-500' : report.scoreRating >= 65 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, Math.max(0, report.scoreRating))}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        {report.createdAt ? `Ngày kiểm định: ${new Date(report.createdAt).toLocaleDateString('vi-VN')}` : 'Ngày kiểm định mới nhất'}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          report.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                          report.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {report.status === 'APPROVED' ? 'Đạt kiểm định' : report.status === 'REJECTED' ? 'Không đạt kiểm định' : 'Cần theo dõi'}
                        </span>
                        <span className="text-sm text-gray-500">Inspector: {report.inspectorName || `#${report.inspectorId}`}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mt-4">Nhận xét kiểm định</h3>
                      <p className="text-gray-700 leading-relaxed mt-2 whitespace-pre-line">{report.reportDetails}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <ClipboardCheck size={36} className="mx-auto text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mt-3">Chưa có báo cáo kiểm định</h3>
                    <p className="text-gray-500 mt-1">Inspector sẽ tạo report để hiển thị điểm và nhận xét trực quan cho bike này.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {(product.sellerName || 'S')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{product.sellerName || `Seller #${product.sellerId}`}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      Việt Nam
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      4.8
                    </span>
                    <span>Đã tham gia 2024</span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                      <MessageCircle size={16} />
                      Nhắn tin
                    </button>
                    <Link
                      to={`/products?seller=${product.sellerId}`}
                      className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Xem shop
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
