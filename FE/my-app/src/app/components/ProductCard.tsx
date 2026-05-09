import { Heart } from 'lucide-react';

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
}

export function ProductCard({
  image,
  badge,
  brand,
  category,
  name,
  price,
  originalPrice,
  returnPolicy = "30 ngày trả"
}: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition">
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
          {badge}
        </span>
      )}

      {/* Wishlist */}
      <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10">
        <Heart size={18} />
      </button>

      {/* Image */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-6">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%23999'%3EBike%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
          <span>{brand}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{category}</span>
        </div>

        {/* Name */}
        <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-red-600">{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
          )}
        </div>

        {/* Return Policy */}
        <p className="text-xs text-gray-500">{returnPolicy}</p>
      </div>
    </div>
  );
}
