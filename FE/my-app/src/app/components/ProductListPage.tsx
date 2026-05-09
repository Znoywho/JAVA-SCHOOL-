import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router';
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  Grid3X3, LayoutGrid, X, ChevronDown, Filter
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import {
  fetchProducts, fetchBrands, fetchCategories,
  searchProducts, fetchProductsByCategory, fetchProductsByBrand,
  fetchProductsByPriceRange, formatPrice,
  type Product, type Brand, type Category, type PaginatedData
} from '../services/api';

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [gridCols, setGridCols] = useState(4);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    brand: true,
    price: true,
  });

  const pageSize = 16;

  // Load brands & categories
  useEffect(() => {
    Promise.all([fetchBrands(), fetchCategories()]).then(([b, c]) => {
      setBrands(b);
      setCategories(c);
    });
  }, []);

  // Read URL params
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    if (search) setSearchQuery(search);
    if (category) setSelectedCategories([parseInt(category)]);
    if (brand) setSelectedBrands([parseInt(brand)]);
  }, [searchParams]);

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      let data: PaginatedData;
      const search = searchParams.get('search');

      if (search) {
        data = await searchProducts(search, currentPage, pageSize);
      } else if (selectedCategories.length === 1) {
        data = await fetchProductsByCategory(selectedCategories[0], currentPage, pageSize);
      } else if (selectedBrands.length === 1) {
        data = await fetchProductsByBrand(selectedBrands[0], currentPage, pageSize);
      } else if (priceRange[0] > 0 || priceRange[1] < 50000000) {
        data = await fetchProductsByPriceRange(priceRange[0], priceRange[1], currentPage, pageSize);
      } else {
        data = await fetchProducts(currentPage, pageSize);
      }

      let sortedProducts = [...data.products];
      switch (sortBy) {
        case 'price-asc':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'condition':
          sortedProducts.sort((a, b) => b.conditionPercent - a.conditionPercent);
          break;
      }

      setProducts(sortedProducts);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, selectedCategories, selectedBrands, priceRange, searchParams]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    setCurrentPage(0);
  };

  const toggleBrand = (id: number) => {
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 50000000]);
    setSearchQuery('');
    setCurrentPage(0);
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 ||
    priceRange[0] > 0 || priceRange[1] < 50000000 || searchQuery;

  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Skeleton loader
  const SkeletonCard = () => (
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

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Danh sách xe đạp</span>
          </nav>
        </div>
      </div>

      {/* Header with search and sort */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm xe đạp..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSearchParams({}); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Filter size={16} />
                <span className="text-sm">Bộ lọc</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>

              {/* Sort */}
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full md:w-auto appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp → Cao</option>
                  <option value="price-desc">Giá: Cao → Thấp</option>
                  <option value="condition">Tình trạng tốt nhất</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              {/* Grid toggle (desktop) */}
              <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2.5 transition-colors ${gridCols === 3 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2.5 transition-colors ${gridCols === 4 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                >
                  <LayoutGrid size={16} />
                </button>
              </div>

              {/* Results count */}
              <span className="hidden md:inline text-sm text-gray-500 whitespace-nowrap">
                {totalItems} sản phẩm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <aside className={`
            ${mobileFilterOpen ? 'fixed inset-0 z-40 bg-black/50 md:relative md:bg-transparent' : 'hidden md:block'}
            md:w-[260px] md:flex-shrink-0
          `}>
            <div className={`
              ${mobileFilterOpen ? 'absolute right-0 top-0 h-full w-[300px] bg-white overflow-y-auto' : ''}
              md:sticky md:top-[85px] md:max-h-[calc(100vh-100px)] md:overflow-y-auto
              bg-white rounded-xl border border-gray-100 shadow-sm
            `}>
              {/* Filter header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-gray-600" />
                  <span className="font-semibold text-gray-900">Bộ lọc</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Xóa tất cả
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="md:hidden p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleFilterSection('category')}
                  className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 text-sm">Loại xe</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${expandedFilters.category ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFilters.category && (
                  <div className="px-4 pb-4 space-y-2">
                    {categories.map(cat => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                          ${selectedCategories.includes(cat.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 group-hover:border-blue-400'}`}
                        >
                          {selectedCategories.includes(cat.id) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand Filter */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleFilterSection('brand')}
                  className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 text-sm">Thương hiệu</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${expandedFilters.brand ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFilters.brand && (
                  <div className="px-4 pb-4 space-y-2">
                    {brands.map(brand => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                          ${selectedBrands.includes(brand.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 group-hover:border-blue-400'}`}
                        >
                          {selectedBrands.includes(brand.id) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div>
                <button
                  onClick={() => toggleFilterSection('price')}
                  className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 text-sm">Khoảng giá</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${expandedFilters.price ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFilters.price && (
                  <div className="px-4 pb-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Từ</label>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          placeholder="0"
                        />
                      </div>
                      <span className="text-gray-400 mt-5">–</span>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Đến</label>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000000])}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          placeholder="50,000,000"
                        />
                      </div>
                    </div>
                    {/* Quick price ranges */}
                    <div className="space-y-1.5">
                      {[
                        [0, 5000000, 'Dưới 5 triệu'],
                        [5000000, 15000000, '5 - 15 triệu'],
                        [15000000, 30000000, '15 - 30 triệu'],
                        [30000000, 50000000, 'Trên 30 triệu'],
                      ].map(([min, max, label]) => (
                        <button
                          key={`${min}-${max}`}
                          onClick={() => setPriceRange([min as number, max as number])}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                            ${priceRange[0] === min && priceRange[1] === max
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'hover:bg-gray-50 text-gray-600'}`}
                        >
                          {label as string}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {/* Active filters pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    Tìm: "{searchQuery}"
                    <button onClick={() => { setSearchQuery(''); setSearchParams({}); }}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCategories.map(id => {
                  const cat = categories.find(c => c.id === id);
                  return cat ? (
                    <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                      {cat.name}
                      <button onClick={() => toggleCategory(id)}><X size={12} /></button>
                    </span>
                  ) : null;
                })}
                {selectedBrands.map(id => {
                  const brand = brands.find(b => b.id === id);
                  return brand ? (
                    <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                      {brand.name}
                      <button onClick={() => toggleBrand(id)}><X size={12} /></button>
                    </span>
                  ) : null;
                })}
                {(priceRange[0] > 0 || priceRange[1] < 50000000) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                    {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                    <button onClick={() => setPriceRange([0, 50000000])}><X size={12} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridCols} gap-5`}>
                {Array.from({ length: pageSize }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search size={40} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-5`}>
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-3"
                    style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}
                  >
                    <ProductCard
                      id={String(product.id)}
                      image=""
                      brand={product.brand || 'Unknown'}
                      category={product.category || 'Bike'}
                      name={product.title}
                      price={formatPrice(product.price)}
                      conditionPercent={product.conditionPercent}
                      isVerified={product.isVerified}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium
                    hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  Trước
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all
                      ${i === currentPage
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                        : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium
                    hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
