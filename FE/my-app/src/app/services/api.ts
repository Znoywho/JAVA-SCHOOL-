const BASE_URL = 'http://localhost:8080/api';

// ==================== Types ====================

export interface Product {
  id: number;
  title: string;
  price: number;
  total: number;
  conditionPercent: number;
  status: string;
  sellerId: number;
  sellerName?: string;
  brand: string | null;
  brandId?: number;
  category: string | null;
  categoryId?: number;
  createdAt: string;
  updatedAt?: string;
  media?: ProductMedia[];
  // Bike-specific fields
  frameSize?: string;
  wheelSize?: string;
  isVerified?: boolean;
  minRiderHeight?: number;
  maxRiderHeight?: number;
  maxWeightCapacityKg?: number;
  weightKg?: number;
  color?: string;
}

export interface ProductMedia {
  id: number;
  productId: number;
  mediaUrl: string;
  mediaType: string;
  thumbnail: boolean;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface PaginatedData {
  products: Product[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  size: number;
}

// ==================== Response Normalization ====================

/**
 * Normalize a raw product object from the API.
 * BE returns JPA entities directly in list endpoints (PascalCase fields like Title, Price)
 * and a hand-built Map in the detail endpoint (camelCase).
 * This function handles both formats.
 */
function normalizeProduct(raw: any): Product {
  return {
    id: raw.id ?? raw.Id ?? 0,
    title: raw.title ?? raw.Title ?? '',
    price: raw.price ?? raw.Price ?? 0,
    total: raw.total ?? raw.Total ?? 1,
    conditionPercent: raw.conditionPercent ?? raw.ConditionPercent ?? 80,
    status: raw.status ?? raw.Status ?? 'PUBLISHED',
    sellerId: raw.sellerId ?? raw.SellerId?.id ?? raw.SellerId ?? 0,
    sellerName: raw.sellerName ?? raw.SellerId?.name ?? undefined,
    brand: raw.brand?.name ?? raw.brandName ?? raw.brand ?? null,
    brandId: raw.brand?.id ?? raw.brandId ?? undefined,
    category: raw.category?.name ?? raw.categoryName ?? raw.category ?? null,
    categoryId: raw.category?.id ?? raw.categoryId ?? undefined,
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? raw.updated_at ?? undefined,
    media: Array.isArray(raw.media) ? raw.media.map(normalizeProductMedia) : [],
    // Bike fields (from joined Bike entity)
    frameSize: raw.frameSize ?? raw.FrameSize ?? undefined,
    wheelSize: raw.wheelSize ?? raw.WheelSize ?? undefined,
    isVerified: raw.isVerified ?? raw.verified ?? false,
    minRiderHeight: raw.minRiderHeight ?? raw.MinRiderHeight ?? undefined,
    maxRiderHeight: raw.maxRiderHeight ?? raw.MaxRiderHeight ?? undefined,
    maxWeightCapacityKg: raw.maxWeightCapacityKg ?? undefined,
    weightKg: raw.weightKg ?? undefined,
    color: raw.color ?? raw.Color ?? undefined,
  };
}

function normalizeProductMedia(raw: any): ProductMedia {
  const thumbnailValue = raw.thumbnail ?? raw.isThumbnail ?? false;

  return {
    id: raw.id ?? raw.Id ?? 0,
    productId: raw.productId ?? raw.ProductId?.id ?? raw.ProductId?.Id ?? 0,
    mediaUrl: raw.mediaUrl ?? raw.media_url ?? '',
    mediaType: raw.mediaType ?? raw.media_type ?? 'IMAGE',
    thumbnail: thumbnailValue === true || thumbnailValue === 'true',
  };
}

function normalizePaginatedResponse(data: any): PaginatedData {
  const rawProducts = data.products ?? data.content ?? [];
  return {
    products: rawProducts.map(normalizeProduct),
    currentPage: data.currentPage ?? data.number ?? 0,
    totalItems: data.totalItems ?? data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
    size: data.size ?? 20,
  };
}

// ==================== Mock Data ====================

const MOCK_BRANDS: Brand[] = [
  { id: 1, name: 'Pinarello' },
  { id: 2, name: 'Specialized' },
  { id: 3, name: 'Trek' },
  { id: 4, name: 'Giant' },
  { id: 5, name: 'Colnago' },
  { id: 6, name: 'Orbea' },
  { id: 7, name: 'Cannondale' },
  { id: 8, name: 'Bianchi' },
];

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Road' },
  { id: 2, name: 'MTB' },
  { id: 3, name: 'Gravel' },
  { id: 4, name: 'E-Bike' },
  { id: 5, name: 'Race Pro' },
];

const BIKE_NAMES = [
  'Pinarello Dogma F 2025 Shimano Ultegra Di2 / Fulcrum Racing 600',
  'Specialized S-Works Tarmac SL8 SRAM Red AXS / Roval Rapide CLX',
  'Trek Madone SLR 9 eTap AXS / Bontrager Aeolus RSL 51',
  'Giant Propel Advanced SL Disc Shimano Dura-Ace / Cadex 42',
  'Colnago V4Rs Pogačar Edition Shimano Dura-Ace Di2',
  'Orbea Orca M21eLTD Shimano Ultegra Di2 / Vision Metron 45',
  'Cannondale SuperSix EVO Hi-MOD Disc SRAM Force AXS',
  'Bianchi Oltre RC Dura-Ace Di2 / Fulcrum Speed 40',
  'Pinarello Paris Disc 105 Di2 / Fulcrum Racing 900',
  'Trek Émonda SLR 7 eTap / Bontrager Aeolus Pro 37',
  'Specialized Roubaix Expert Ultegra Di2 / DT Swiss R470',
  'Giant Defy Advanced Pro 0 Dura-Ace / Cadex 36',
  'Colnago C68 Disc Campagnolo Super Record EPS',
  'Orbea Terra M20iLTD SRAM Rival AXS / Zipp 303 Firecrest',
  'Cannondale Topstone Carbon Lefty Oliver SRAM AXS',
  'Trek Fuel EXe 9.9 XX AXS / Bontrager Kovee Pro 30',
  'Giant Reign Advanced Pro 29 Fox Factory / Shimano XT',
  'Specialized Turbo Levo Expert Carbon Shimano EP8',
  'Pinarello Nytro E-Road Shimano Ultegra / Fulcrum Racing 500',
  'Bianchi Impulso Pro Gravel GRX 820 / DT Swiss G1800',
];

const COLORS = ['Đen', 'Trắng', 'Đỏ', 'Xanh Dương', 'Xanh Lá', 'Bạc', 'Vàng', 'Carbon'];
const FRAME_SIZES = ['XS (48cm)', 'S (51cm)', 'M (54cm)', 'L (56cm)', 'XL (58cm)'];
const WHEEL_SIZES = ['700c', '650b', '29"', '27.5"'];

function generateMockProducts(count: number = 20, page: number = 0): Product[] {
  const products: Product[] = [];
  const startId = page * count + 1;

  for (let i = 0; i < count; i++) {
    const id = startId + i;
    const brandIdx = id % MOCK_BRANDS.length;
    const catIdx = id % MOCK_CATEGORIES.length;
    const price = Math.floor(Math.random() * 45000000) + 5000000;
    const condition = Math.floor(Math.random() * 40) + 60;

    products.push({
      id,
      title: BIKE_NAMES[id % BIKE_NAMES.length],
      price,
      total: Math.floor(Math.random() * 3) + 1,
      conditionPercent: condition,
      status: 'PUBLISHED',
      sellerId: Math.floor(Math.random() * 10) + 1,
      sellerName: `Seller ${Math.floor(Math.random() * 10) + 1}`,
      brand: MOCK_BRANDS[brandIdx].name,
      brandId: MOCK_BRANDS[brandIdx].id,
      category: MOCK_CATEGORIES[catIdx].name,
      categoryId: MOCK_CATEGORIES[catIdx].id,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      frameSize: FRAME_SIZES[id % FRAME_SIZES.length],
      wheelSize: WHEEL_SIZES[id % WHEEL_SIZES.length],
      isVerified: Math.random() > 0.3,
      minRiderHeight: 155 + (id % 4) * 5,
      maxRiderHeight: 175 + (id % 4) * 5,
      maxWeightCapacityKg: 100 + (id % 3) * 10,
      weightKg: 6.5 + Math.random() * 5,
      color: COLORS[id % COLORS.length],
    });
  }
  return products;
}

// ==================== API Functions ====================

/**
 * Fetch from API with automatic fallback to mock data.
 * If the BE is running, it uses real data; otherwise mock data.
 */
async function fetchWithFallback<T>(
  url: string,
  mockFn: () => T,
  transform?: (data: any) => T
): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();

    // Handle BE ApiResponse wrapper: { success, message, data }
    const rawData = json?.data ?? json;

    if (transform) {
      return transform(rawData);
    }
    return rawData as T;
  } catch {
    console.warn(`⚡ API unavailable (${url}), using mock data`);
    return mockFn();
  }
}

// --- Product List ---
export async function fetchProducts(page: number = 0, size: number = 20): Promise<PaginatedData> {
  return fetchWithFallback(
    `${BASE_URL}/products/all?page=${page}&size=${size}`,
    () => {
      const products = generateMockProducts(size, page);
      return { products, currentPage: page, totalItems: 60, totalPages: 3, size };
    },
    normalizePaginatedResponse
  );
}

// --- Product Detail ---
export async function fetchProductById(id: number): Promise<Product> {
  return fetchWithFallback(
    `${BASE_URL}/products/${id}`,
    () => {
      const brandIdx = id % MOCK_BRANDS.length;
      const catIdx = id % MOCK_CATEGORIES.length;
      return {
        id,
        title: BIKE_NAMES[id % BIKE_NAMES.length],
        price: Math.floor(Math.random() * 45000000) + 5000000,
        total: Math.floor(Math.random() * 3) + 1,
        conditionPercent: Math.floor(Math.random() * 30) + 70,
        status: 'PUBLISHED',
        sellerId: 1,
        sellerName: 'Pro Bike Shop',
        brand: MOCK_BRANDS[brandIdx].name,
        brandId: MOCK_BRANDS[brandIdx].id,
        category: MOCK_CATEGORIES[catIdx].name,
        categoryId: MOCK_CATEGORIES[catIdx].id,
        createdAt: new Date().toISOString(),
        frameSize: FRAME_SIZES[id % FRAME_SIZES.length],
        wheelSize: WHEEL_SIZES[id % WHEEL_SIZES.length],
        isVerified: Math.random() > 0.3,
        minRiderHeight: 160,
        maxRiderHeight: 180,
        maxWeightCapacityKg: 110,
        weightKg: 7.2,
        color: COLORS[id % COLORS.length],
      };
    },
    normalizeProduct
  );
}

// --- Search ---
export async function searchProducts(query: string, page: number = 0, size: number = 20): Promise<PaginatedData> {
  return fetchWithFallback(
    `${BASE_URL}/products/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`,
    () => {
      const products = generateMockProducts(size, page).filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
      return {
        products: products.length > 0 ? products : generateMockProducts(Math.min(size, 4), 0),
        currentPage: page,
        totalItems: products.length > 0 ? products.length : 4,
        totalPages: 1,
        size,
      };
    },
    normalizePaginatedResponse
  );
}

// --- Filter by Category ---
export async function fetchProductsByCategory(categoryId: number, page: number = 0, size: number = 20): Promise<PaginatedData> {
  return fetchWithFallback(
    `${BASE_URL}/products/category/${categoryId}?page=${page}&size=${size}`,
    () => {
      const products = generateMockProducts(size, page).map(p => ({
        ...p,
        category: MOCK_CATEGORIES.find(c => c.id === categoryId)?.name ?? 'Road',
        categoryId,
      }));
      return { products, currentPage: page, totalItems: 20, totalPages: 1, size };
    },
    normalizePaginatedResponse
  );
}

// --- Filter by Brand ---
export async function fetchProductsByBrand(brandId: number, page: number = 0, size: number = 20): Promise<PaginatedData> {
  return fetchWithFallback(
    `${BASE_URL}/products/brand/${brandId}?page=${page}&size=${size}`,
    () => {
      const brand = MOCK_BRANDS.find(b => b.id === brandId);
      const products = generateMockProducts(size, page).map(p => ({
        ...p,
        brand: brand?.name ?? 'Pinarello',
        brandId,
      }));
      return { products, currentPage: page, totalItems: 15, totalPages: 1, size };
    },
    normalizePaginatedResponse
  );
}

// --- Filter by Price ---
export async function fetchProductsByPriceRange(
  minPrice: number,
  maxPrice: number,
  page: number = 0,
  size: number = 20
): Promise<PaginatedData> {
  return fetchWithFallback(
    `${BASE_URL}/products/price?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&size=${size}`,
    () => {
      const products = generateMockProducts(size, page).map(p => ({
        ...p,
        price: minPrice + Math.random() * (maxPrice - minPrice),
      }));
      return { products, currentPage: page, totalItems: 12, totalPages: 1, size };
    },
    normalizePaginatedResponse
  );
}

// --- Brands & Categories ---
export async function fetchBrands(): Promise<Brand[]> {
  return fetchWithFallback(`${BASE_URL}/brands`, () => MOCK_BRANDS);
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchWithFallback(`${BASE_URL}/categories`, () => MOCK_CATEGORIES);
}

// ==================== Seller API ====================

export interface BikeCreateDTO {
  sellerId: number;
  title: string;
  price: number;
  total: number;
  brandId: number;
  categoryId: number;
  conditionPercent: number;
  status: string;
  frameSize: string;
  wheelSize: string;
  verified: boolean;
  minRiderHeight: number;
  maxRiderHeight: number;
  maxWeightCapacityKg: number;
  weightKg: number;
  color: string;
}

export interface ProductUpdateDTO {
  sellerId: number;
  title: string;
  price: number;
  total: number;
  brandId: number;
  categoryId: number;
  conditionPercent: number;
  status: string;
}

export interface ProductMediaCreateDTO {
  sellerId: number;
  mediaUrl: string;
  mediaType: string;
  thumbnail: boolean;
}

export async function createBike(dto: BikeCreateDTO): Promise<any> {
  const response = await fetch(`${BASE_URL}/seller/bikes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Đăng tin thất bại');
  }
  return json.data;
}

export async function fetchSellerProducts(sellerId: number, page: number = 0, size: number = 20): Promise<PaginatedData> {
  return fetchWithFallback(
    `${BASE_URL}/seller/${sellerId}/products?page=${page}&size=${size}`,
    () => ({ products: [], currentPage: 0, totalItems: 0, totalPages: 0, size }),
    (data) => {
      const rawProducts = data.products ?? [];
      return {
        products: rawProducts.map(normalizeProduct),
        currentPage: data.currentPage ?? 0,
        totalItems: data.totalItems ?? 0,
        totalPages: data.totalPages ?? 0,
        size: data.size ?? size,
      };
    }
  );
}

export async function updateProduct(productId: number, dto: ProductUpdateDTO): Promise<Product> {
  const response = await fetch(`${BASE_URL}/seller/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Cập nhật sản phẩm thất bại');
  }
  return normalizeProduct(json.data);
}

export async function addProductMedia(productId: number, dto: ProductMediaCreateDTO): Promise<ProductMedia> {
  const response = await fetch(`${BASE_URL}/seller/products/${productId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Thêm media thất bại');
  }
  return normalizeProductMedia(json.data);
}

export async function deleteProductMedia(productId: number, mediaId: number, sellerId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/seller/products/${productId}/media/${mediaId}?sellerId=${sellerId}`, {
    method: 'DELETE',
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Xóa media thất bại');
  }
}

export async function updateProductStatus(productId: number, sellerId: number, status: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/seller/products/${productId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sellerId, status }),
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Cập nhật trạng thái thất bại');
  }
  return json.data;
}

export async function deleteProduct(productId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/seller/products/${productId}`, {
    method: 'DELETE',
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Xóa sản phẩm thất bại');
  }
}

// ==================== Utilities ====================

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

export function getPlaceholderImage(seed: number = 1): string {
  const hue = (seed * 137) % 360;
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='hsl(${hue},70%25,95%25)'/%3E%3Cstop offset='100%25' stop-color='hsl(${hue},50%25,85%25)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='400' height='400' rx='8'/%3E%3Cg transform='translate(200,180)' fill='hsl(${hue},30%25,50%25)' opacity='0.5'%3E%3Ccircle cx='-60' cy='30' r='45' fill='none' stroke='hsl(${hue},30%25,50%25)' stroke-width='4'/%3E%3Ccircle cx='60' cy='30' r='45' fill='none' stroke='hsl(${hue},30%25,50%25)' stroke-width='4'/%3E%3Cline x1='-30' y1='0' x2='30' y2='0' stroke='hsl(${hue},30%25,50%25)' stroke-width='3'/%3E%3Cline x1='-15' y1='30' x2='0' y2='-20' stroke='hsl(${hue},30%25,50%25)' stroke-width='3'/%3E%3Cline x1='0' y1='-20' x2='15' y2='30' stroke='hsl(${hue},30%25,50%25)' stroke-width='3'/%3E%3C/g%3E%3Ctext x='200' y='280' text-anchor='middle' font-family='system-ui' font-size='14' fill='hsl(${hue},30%25,45%25)'%3EREBIKE%3C/text%3E%3C/svg%3E`;
}
