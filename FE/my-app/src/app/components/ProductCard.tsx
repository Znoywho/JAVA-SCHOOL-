import { Heart, Shield } from 'lucide-react';
import { Link } from 'react-router';
import { getPlaceholderImage } from '../services/api';

interface ProductCardProps {
  id: string;
  image: string;
  badge?: string;
  brand: string;
  category: string;
  name: string;
  price: string;
  originalPrice?: string;
  returnPolicy?: string;
  conditionPercent?: number;
  isVerified?: boolean;
}

export function ProductCard({
  id,
  image,
  badge,
  brand,
  category,
  name,
  price,
  originalPrice,
  returnPolicy = "30 ngày đổi trả",
  conditionPercent,
  isVerified,
}: ProductCardProps) {
  const displayImage = image || getPlaceholderImage(parseInt(id) || 1);

  const conditionColor = conditionPercent
    ? conditionPercent >= 90 ? 'bg-emerald-500'
      : conditionPercent >= 70 ? 'bg-blue-500'
      : 'bg-orange-500'
    : 'bg-gray-300';

  return (
    <Link
      to={`/products/${id}`}
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 block"
    >
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg z-10 shadow-sm">
          {badge}
        </span>
      )}

      {/* Verified badge */}
      {isVerified && (
        <span className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg z-10 shadow-sm">
          <Shield size={12} />
          Kiểm định
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 z-10 shadow-sm"
      >
        <Heart size={16} className="text-gray-600" />
      </button>

      {/* Image */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = getPlaceholderImage(parseInt(id) || 1);
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center gap-2 text-xs mb-1.5">
          <span className="text-blue-600 font-semibold">{brand}</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500">{category}</span>
        </div>

        {/* Name */}
        <h3 className="text-sm text-gray-800 mb-2.5 line-clamp-2 min-h-[40px] leading-snug group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        {/* Condition bar */}
        {conditionPercent !== undefined && (
          <div className="mb-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-500">Tình trạng</span>
              <span className="text-[11px] font-semibold text-gray-700">{conditionPercent}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-full rounded-full ${conditionColor} transition-all`}
                style={{ width: `${conditionPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base font-bold text-red-600">{price}</span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
          )}
        </div>

        {/* Return Policy */}
        <p className="text-[11px] text-gray-400 flex items-center gap-1">
          <Shield size={11} />
          {returnPolicy}
        </p>
      </div>
    </Link>
  );
}
