import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { fetchProducts, formatPrice, type Product } from '../services/api';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

function getProductImage(product: Product): string {
  const thumbnail = product.media?.find(m => m.thumbnail && m.mediaType !== 'VIDEO');
  const firstImage = product.media?.find(m => m.mediaType !== 'VIDEO');
  return thumbnail?.mediaUrl || firstImage?.mediaUrl || '';
}

export function MostRequested() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts(0, 5)
      .then(data => setProducts(data.products.slice(0, 5)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Được yêu cầu nhiều nhất</h2>
          <p className="text-gray-500 mt-1">Những chiếc xe đạp được tìm kiếm nhiều nhất</p>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
        >
          Xem tất cả
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map(product => (
              <ProductCard
                key={product.id}
                id={String(product.id)}
                image={getProductImage(product)}
                brand={product.brand || 'Unknown'}
                category={product.category || 'Bike'}
                name={product.title}
                price={formatPrice(product.price)}
                conditionPercent={product.conditionPercent}
                isVerified={product.isVerified}
              />
            ))}
      </div>
    </section>
  );
}
