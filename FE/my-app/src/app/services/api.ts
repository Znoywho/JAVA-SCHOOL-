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
  inspectorReport?: InspectorReport | null;
}

export type InspectorReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface InspectorReport {
  id: number;
  productId: number;
  productTitle?: string;
  inspectorId: number;
  inspectorName?: string;
  createdAt?: string;
  status: InspectorReportStatus;
  scoreRating: number;
  reportDetails: string;
}

export interface InspectorReportPayload {
  productId: number;
  inspectorId: number;
  scoreRating: number;
  reportDetails: string;
  status: InspectorReportStatus;
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

export interface CartItem {
  itemId: number;
  productId: number;
  sellerId: number;
  sellerName?: string;
  productTitle: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CartData {
  cartId: number;
  buyerId: number;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface WishlistItem {
  id: number;
  buyerId: number;
  buyerName?: string;
  productId: number;
  productTitle: string;
  productPrice: number;
  addedAt?: string;
}

export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'CARD';

export interface OrderDetailInput {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  buyerId: number;
  sellerId: number;
  paymentMethod: PaymentMethod;
  shipping: ShippingInfo;
  items: OrderDetailInput[];
}

export interface ShippingInfo {
  shippingCompanyId: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingNote?: string;
}

export interface ShippingCompany {
  id: number;
  code: string;
  name: string;
  hotline?: string;
  baseFee: number;
  insurancePercent: number;
  codFee: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  supportsCod: boolean;
}

export interface ShippingQuote {
  shippingCompanyId: number;
  shippingCompanyName: string;
  orderSubtotal: number;
  shippingFee: number;
  codAmount: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
}

export interface ShipmentResponse {
  id: number;
  orderId: number;
  shippingCompanyId: number;
  shippingCompanyName: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingNote?: string;
  shippingFee: number;
  codAmount: number;
  trackingCode: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderDetailResponse {
  id: number;
  productId: number;
  productTitle: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  sellerName: string;
  totalPrice: number;
  orderStatus: string;
  billStatus: string;
  paymentMethod: PaymentMethod | string;
  productTotal: number;
  shippingFee: number;
  shipment?: ShipmentResponse;
  createdAt: string;
  items: OrderDetailResponse[];
}

export type ChatRole = 'BUYER' | 'SELLER' | 'INSPECTOR' | 'ADMIN';

export interface ChatContact {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  role: ChatRole;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface ChatConversation {
  id: number;
  userId1: number;
  user1Name: string;
  user1Role?: ChatRole;
  userId2: number;
  user2Name: string;
  user2Role?: ChatRole;
  messageCount: number;
  lastMessageTime?: string;
  lastMessage?: string | null;
  lastMessageSenderId?: number | null;
  messages?: ChatMessage[];
}

export type ReviewRating = 'ONE_STAR' | 'TWO_STAR' | 'THREE_STAR' | 'FOUR_STAR' | 'FIVE_STAR';

export interface ProductReview {
  id: number;
  buyerId: number;
  buyerName: string;
  productId: number;
  productTitle: string;
  orderId?: number | null;
  rating: ReviewRating;
  ratingValue: number;
  comment?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductRatingStats {
  productId: number;
  productTitle?: string;
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface ProductReviewPayload {
  rating: ReviewRating;
  comment: string;
  orderId?: number | null;
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
    inspectorReport: raw.inspectorReport ? normalizeInspectorReport(raw.inspectorReport) : null,
  };
}

function normalizeInspectorReport(raw: any): InspectorReport {
  return {
    id: raw.id ?? raw.Id ?? 0,
    productId: raw.productId ?? raw.product?.id ?? raw.product?.Id ?? 0,
    productTitle: raw.productTitle ?? raw.product?.title ?? raw.product?.Title ?? undefined,
    inspectorId: raw.inspectorId ?? raw.InspectorId?.id ?? raw.InspectorId?.Id ?? 0,
    inspectorName: raw.inspectorName ?? raw.InspectorId?.name ?? undefined,
    createdAt: raw.createdAt ?? raw.created_at ?? undefined,
    status: raw.status ?? 'PENDING',
    scoreRating: raw.scoreRating ?? raw.score_rating ?? 0,
    reportDetails: raw.reportDetails ?? raw.report_details ?? '',
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

function ratingToValue(rating: ReviewRating | string | undefined): number {
  switch (rating) {
    case 'FIVE_STAR':
      return 5;
    case 'FOUR_STAR':
      return 4;
    case 'THREE_STAR':
      return 3;
    case 'TWO_STAR':
      return 2;
    case 'ONE_STAR':
      return 1;
    default:
      return 0;
  }
}

export function valueToReviewRating(value: number): ReviewRating {
  if (value >= 5) return 'FIVE_STAR';
  if (value === 4) return 'FOUR_STAR';
  if (value === 3) return 'THREE_STAR';
  if (value === 2) return 'TWO_STAR';
  return 'ONE_STAR';
}

function normalizeProductReview(raw: any): ProductReview {
  const rating = (raw.rating ?? 'ONE_STAR') as ReviewRating;

  return {
    id: raw.id ?? raw.Id ?? 0,
    buyerId: raw.buyerId ?? raw.buyer?.id ?? raw.buyer?.Id ?? 0,
    buyerName: raw.buyerName ?? raw.buyer?.name ?? 'Buyer',
    productId: raw.productId ?? raw.product?.id ?? raw.product?.Id ?? 0,
    productTitle: raw.productTitle ?? raw.product?.title ?? raw.product?.Title ?? '',
    orderId: raw.orderId ?? raw.order?.id ?? raw.order?.Id ?? null,
    rating,
    ratingValue: raw.ratingValue ?? ratingToValue(rating),
    comment: raw.comment ?? '',
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? raw.updated_at ?? undefined,
  };
}

function normalizeProductRatingStats(raw: any): ProductRatingStats {
  return {
    productId: raw.productId ?? 0,
    productTitle: raw.productTitle ?? undefined,
    averageRating: Number(raw.averageRating ?? 0),
    totalReviews: Number(raw.totalReviews ?? 0),
    fiveStarCount: Number(raw.fiveStarCount ?? 0),
    fourStarCount: Number(raw.fourStarCount ?? 0),
    threeStarCount: Number(raw.threeStarCount ?? 0),
    twoStarCount: Number(raw.twoStarCount ?? 0),
    oneStarCount: Number(raw.oneStarCount ?? 0),
  };
}

function normalizeChatContact(raw: any): ChatContact {
  return {
    id: raw.id ?? raw.Id ?? 0,
    name: raw.name ?? raw.Name ?? 'User',
    email: raw.email ?? raw.Email ?? undefined,
    phone: raw.phone ?? raw.Phone ?? undefined,
    role: (raw.role ?? raw.Role ?? 'BUYER') as ChatRole,
  };
}

function normalizeChatMessage(raw: any): ChatMessage {
  return {
    id: raw.id ?? raw.Id ?? 0,
    conversationId: raw.conversationId ?? raw.ConversationId ?? 0,
    senderId: raw.senderId ?? raw.SenderId ?? 0,
    senderName: raw.senderName ?? raw.sender?.name ?? raw.SenderId?.name ?? 'User',
    content: raw.content ?? '',
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
  };
}

function normalizeChatConversation(raw: any): ChatConversation {
  return {
    id: raw.id ?? raw.Id ?? 0,
    userId1: raw.userId1 ?? raw.UserId1 ?? 0,
    user1Name: raw.user1Name ?? raw.user?.name ?? raw.UserId1?.name ?? 'User',
    user1Role: raw.user1Role ?? raw.user?.role ?? raw.UserId1?.role ?? undefined,
    userId2: raw.userId2 ?? raw.UserId2 ?? 0,
    user2Name: raw.user2Name ?? raw.user2?.name ?? raw.UserId2?.name ?? 'User',
    user2Role: raw.user2Role ?? raw.user2?.role ?? raw.UserId2?.role ?? undefined,
    messageCount: Number(raw.messageCount ?? 0),
    lastMessageTime: raw.lastMessageTime ?? raw.updatedAt ?? raw.createdAt ?? undefined,
    lastMessage: raw.lastMessage ?? null,
    lastMessageSenderId: raw.lastMessageSenderId ?? null,
    messages: Array.isArray(raw.messages) ? raw.messages.map(normalizeChatMessage) : undefined,
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

const MOCK_SHIPPING_COMPANIES: ShippingCompany[] = [
  {
    id: 1,
    code: 'DIRECT_HANDOFF',
    name: 'Seller tự giao / hẹn nhận trực tiếp',
    hotline: '',
    baseFee: 0,
    insurancePercent: 0,
    codFee: 0,
    estimatedDaysMin: 0,
    estimatedDaysMax: 1,
    supportsCod: true,
  },
  {
    id: 2,
    code: 'GHTK',
    name: 'Giao Hàng Tiết Kiệm',
    hotline: '1900 6092',
    baseFee: 30000,
    insurancePercent: 0.0025,
    codFee: 10000,
    estimatedDaysMin: 2,
    estimatedDaysMax: 4,
    supportsCod: true,
  },
  {
    id: 3,
    code: 'GHN',
    name: 'Giao Hàng Nhanh',
    hotline: '1900 636677',
    baseFee: 35000,
    insurancePercent: 0.003,
    codFee: 12000,
    estimatedDaysMin: 1,
    estimatedDaysMax: 3,
    supportsCod: true,
  },
  {
    id: 4,
    code: 'VIETTEL_POST',
    name: 'Viettel Post',
    hotline: '1900 8095',
    baseFee: 42000,
    insurancePercent: 0.0035,
    codFee: 15000,
    estimatedDaysMin: 2,
    estimatedDaysMax: 5,
    supportsCod: true,
  },
];

const MOCK_PRODUCT_REVIEWS: ProductReview[] = [
  {
    id: 1,
    buyerId: 6,
    buyerName: 'Nguyễn Thị Hoa',
    productId: 1,
    productTitle: 'Pinarello Dogma F 2025 Shimano Ultegra Di2 / Fulcrum Racing 600',
    rating: 'FIVE_STAR',
    ratingValue: 5,
    comment: 'Xe đúng mô tả, khung rất đẹp và sang số mượt.',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    buyerId: 7,
    buyerName: 'Trần Văn Nam',
    productId: 1,
    productTitle: 'Pinarello Dogma F 2025 Shimano Ultegra Di2 / Fulcrum Racing 600',
    rating: 'FOUR_STAR',
    ratingValue: 4,
    comment: 'Sản phẩm ổn, shop tư vấn nhanh. Có vài vết xước nhỏ.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function calculateMockReviewStats(productId: number): ProductRatingStats {
  const reviews = MOCK_PRODUCT_REVIEWS.filter(review => review.productId === productId);
  const totalReviews = reviews.length;
  const averageRating = totalReviews === 0
    ? 0
    : reviews.reduce((sum, review) => sum + review.ratingValue, 0) / totalReviews;

  return {
    productId,
    averageRating,
    totalReviews,
    fiveStarCount: reviews.filter(review => review.ratingValue === 5).length,
    fourStarCount: reviews.filter(review => review.ratingValue === 4).length,
    threeStarCount: reviews.filter(review => review.ratingValue === 3).length,
    twoStarCount: reviews.filter(review => review.ratingValue === 2).length,
    oneStarCount: reviews.filter(review => review.ratingValue === 1).length,
  };
}

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

function calculateMockShippingQuote(
  company: ShippingCompany,
  orderSubtotal: number,
  paymentMethod: PaymentMethod | string
): ShippingQuote {
  const isCod = paymentMethod === 'COD';
  const rawFee = company.baseFee + (orderSubtotal * company.insurancePercent) + (isCod ? company.codFee : 0);
  const shippingFee = Math.ceil(rawFee / 1000) * 1000;

  return {
    shippingCompanyId: company.id,
    shippingCompanyName: company.name,
    orderSubtotal,
    shippingFee,
    codAmount: isCod ? orderSubtotal + shippingFee : 0,
    estimatedDaysMin: company.estimatedDaysMin,
    estimatedDaysMax: company.estimatedDaysMax,
  };
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

async function parseApiResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const json = await response.json().catch(() => null);
  const rawData = json?.data ?? json;

  if (!response.ok || json?.success === false) {
    throw new Error(json?.error || json?.message || fallbackMessage);
  }

  return rawData as T;
}

// --- Chat ---
export async function fetchChatContacts(userId: number): Promise<ChatContact[]> {
  const response = await fetch(`${BASE_URL}/chat/contacts/${userId}`);
  const data = await parseApiResponse<any[]>(response, 'Khong tai duoc danh ba chat');
  return Array.isArray(data) ? data.map(normalizeChatContact) : [];
}

export async function fetchChatConversations(userId: number): Promise<ChatConversation[]> {
  const response = await fetch(`${BASE_URL}/chat/conversations/${userId}`);
  const data = await parseApiResponse<any[]>(response, 'Khong tai duoc hoi thoai');
  return Array.isArray(data) ? data.map(normalizeChatConversation) : [];
}

export async function createChatConversation(userId1: number, userId2: number): Promise<ChatConversation> {
  const response = await fetch(`${BASE_URL}/chat/conversation/${userId1}/${userId2}`, {
    method: 'POST',
  });
  const data = await parseApiResponse<any>(response, 'Khong tao duoc hoi thoai');
  return normalizeChatConversation(data);
}

export async function fetchChatMessages(conversationId: number): Promise<ChatMessage[]> {
  const response = await fetch(`${BASE_URL}/chat/${conversationId}/messages`);
  const data = await parseApiResponse<any[]>(response, 'Khong tai duoc tin nhan');
  return Array.isArray(data) ? data.map(normalizeChatMessage) : [];
}

export async function sendChatMessage(
  conversationId: number,
  senderId: number,
  content: string
): Promise<ChatMessage> {
  const response = await fetch(`${BASE_URL}/chat/${conversationId}/send/${senderId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  const data = await parseApiResponse<any>(response, 'Khong gui duoc tin nhan');
  return normalizeChatMessage(data);
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

// --- Product Reviews ---
export async function fetchProductReviews(productId: number): Promise<ProductReview[]> {
  return fetchWithFallback(
    `${BASE_URL}/product-reviews/product/${productId}`,
    () => MOCK_PRODUCT_REVIEWS.filter(review => review.productId === productId),
    (data) => Array.isArray(data) ? data.map(normalizeProductReview) : []
  );
}

export async function fetchProductRatingStats(productId: number): Promise<ProductRatingStats> {
  return fetchWithFallback(
    `${BASE_URL}/product-reviews/product/${productId}/stats`,
    () => calculateMockReviewStats(productId),
    normalizeProductRatingStats
  );
}

export async function createProductReview(
  buyerId: number,
  productId: number,
  payload: ProductReviewPayload
): Promise<ProductReview> {
  const response = await fetch(`${BASE_URL}/product-reviews/${buyerId}/${productId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseApiResponse<any>(response, 'Tạo đánh giá sản phẩm thất bại');
  return normalizeProductReview(data);
}

export async function updateProductReview(
  reviewId: number,
  payload: ProductReviewPayload
): Promise<ProductReview> {
  const response = await fetch(`${BASE_URL}/product-reviews/${reviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseApiResponse<any>(response, 'Cập nhật đánh giá sản phẩm thất bại');
  return normalizeProductReview(data);
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

// ==================== Cart & Wishlist API ====================

export async function addToCart(buyerId: number, productId: number, quantity: number = 1): Promise<CartData> {
  const response = await fetch(`${BASE_URL}/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ buyerId, productId, quantity }),
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Thêm vào giỏ hàng thất bại');
  }
  window.dispatchEvent(new Event('cart-change'));
  return json.data;
}

export async function fetchCartCount(buyerId: number): Promise<number> {
  return fetchWithFallback(
    `${BASE_URL}/cart/${buyerId}/count`,
    () => Number(localStorage.getItem(`rebike_cart_count_${buyerId}`) ?? 0),
    (data) => Number(data ?? 0)
  );
}

export async function fetchCart(buyerId: number): Promise<CartData> {
  return fetchWithFallback(
    `${BASE_URL}/cart/${buyerId}`,
    () => ({
      cartId: 0,
      buyerId,
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    }),
    (data) => data as CartData
  );
}

export async function updateCartItemQuantity(
  buyerId: number,
  productId: number,
  quantity: number
): Promise<CartData> {
  const response = await fetch(`${BASE_URL}/cart/${buyerId}/items/${productId}?quantity=${quantity}`, {
    method: 'PATCH',
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Cập nhật giỏ hàng thất bại');
  }
  window.dispatchEvent(new Event('cart-change'));
  return json.data;
}

export async function removeFromCart(buyerId: number, productId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/cart/${buyerId}/items/${productId}`, {
    method: 'DELETE',
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Xóa sản phẩm khỏi giỏ hàng thất bại');
  }
  window.dispatchEvent(new Event('cart-change'));
}

export async function clearCart(buyerId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/cart/${buyerId}/clear`, {
    method: 'DELETE',
  });
  await parseApiResponse<void>(response, 'Xóa giỏ hàng thất bại');
  window.dispatchEvent(new Event('cart-change'));
}

// ==================== Shipping API ====================

export async function fetchShippingCompanies(paymentMethod: PaymentMethod): Promise<ShippingCompany[]> {
  return fetchWithFallback(
    `${BASE_URL}/shipping/companies?paymentMethod=${encodeURIComponent(paymentMethod)}`,
    () => MOCK_SHIPPING_COMPANIES.filter(company => paymentMethod !== 'COD' || company.supportsCod),
    (data) => Array.isArray(data) ? data as ShippingCompany[] : []
  );
}

export async function fetchShippingQuote(
  shippingCompanyId: number,
  orderSubtotal: number,
  paymentMethod: PaymentMethod
): Promise<ShippingQuote> {
  return fetchWithFallback(
    `${BASE_URL}/shipping/quote?shippingCompanyId=${shippingCompanyId}&orderSubtotal=${orderSubtotal}&paymentMethod=${encodeURIComponent(paymentMethod)}`,
    () => {
      const company = MOCK_SHIPPING_COMPANIES.find(item => item.id === shippingCompanyId) ?? MOCK_SHIPPING_COMPANIES[0];
      return calculateMockShippingQuote(company, orderSubtotal, paymentMethod);
    },
    (data) => data as ShippingQuote
  );
}

// ==================== Order & Payment API ====================

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<OrderResponse>(response, 'Tạo đơn hàng thất bại');
}

export async function payOrder(orderId: number): Promise<OrderResponse> {
  const response = await fetch(`${BASE_URL}/orders/${orderId}/pay`, {
    method: 'PUT',
  });
  return parseApiResponse<OrderResponse>(response, 'Thanh toán đơn hàng thất bại');
}

export async function fetchBuyerOrders(buyerId: number): Promise<OrderResponse[]> {
  const response = await fetch(`${BASE_URL}/orders/buyer/${buyerId}`);
  return parseApiResponse<OrderResponse[]>(response, 'Không tải được đơn hàng');
}

export async function addToWishlist(buyerId: number, productId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/wishlist/${buyerId}/${productId}`, {
    method: 'POST',
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Thêm vào wishlist thất bại');
  }
  window.dispatchEvent(new Event('wishlist-change'));
}

export async function fetchWishlist(buyerId: number): Promise<WishlistItem[]> {
  return fetchWithFallback(
    `${BASE_URL}/wishlist/${buyerId}`,
    () => [],
    (data) => Array.isArray(data) ? data as WishlistItem[] : []
  );
}

export async function removeFromWishlist(buyerId: number, productId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/wishlist/${buyerId}/${productId}`, {
    method: 'DELETE',
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Xóa khỏi wishlist thất bại');
  }
  window.dispatchEvent(new Event('wishlist-change'));
}

export async function checkWishlist(buyerId: number, productId: number): Promise<boolean> {
  return fetchWithFallback(
    `${BASE_URL}/wishlist/${buyerId}/${productId}/check`,
    () => false,
    (data) => Boolean(data)
  );
}

export async function fetchWishlistCount(buyerId: number): Promise<number> {
  return fetchWithFallback(
    `${BASE_URL}/wishlist/${buyerId}/count`,
    () => Number(localStorage.getItem(`rebike_wishlist_count_${buyerId}`) ?? 0),
    (data) => Number(data ?? 0)
  );
}

// ==================== Order Management API ====================

export async function fetchOrderById(orderId: number): Promise<OrderResponse> {
  const response = await fetch(`${BASE_URL}/orders/${orderId}`);
  return parseApiResponse<OrderResponse>(response, 'Không tải được đơn hàng');
}

export async function fetchSellerOrders(sellerId: number): Promise<OrderResponse[]> {
  const response = await fetch(`${BASE_URL}/orders/seller/${sellerId}`);
  return parseApiResponse<OrderResponse[]>(response, 'Không tải được đơn hàng');
}

export async function cancelOrder(orderId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
    method: 'PUT',
  });
  await parseApiResponse<void>(response, 'Hủy đơn hàng thất bại');
}

export async function updateOrderStatus(orderId: number, status: string): Promise<OrderResponse> {
  const response = await fetch(`${BASE_URL}/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
  });
  return parseApiResponse<OrderResponse>(response, 'Cập nhật trạng thái đơn hàng thất bại');
}

export async function updateShippingStatus(shipmentId: number, status: string): Promise<ShipmentResponse> {
  const response = await fetch(`${BASE_URL}/shipping/${shipmentId}/status?status=${encodeURIComponent(status)}`, {
    method: 'PATCH',
  });
  return parseApiResponse<ShipmentResponse>(response, 'Cập nhật trạng thái giao hàng thất bại');
}

// ==================== Inspector Reports API ====================

const MOCK_REPORTS: InspectorReport[] = [
  {
    id: 1,
    productId: 1,
    productTitle: BIKE_NAMES[1],
    inspectorId: 9,
    inspectorName: 'Inspector REBIKE',
    createdAt: new Date().toISOString(),
    status: 'APPROVED',
    scoreRating: 91,
    reportDetails: 'Khung va phuoc on dinh. Bo truyen dong hoat dong tot. Nen ve sinh sen va can chinh phanh truoc khi giao.',
  },
];

export async function fetchInspectorReports(inspectorId: number): Promise<InspectorReport[]> {
  return fetchWithFallback(
    `${BASE_URL}/inspector-reports/inspector/${inspectorId}`,
    () => MOCK_REPORTS.filter(report => report.inspectorId === inspectorId),
    (data) => Array.isArray(data) ? data.map(normalizeInspectorReport) : []
  );
}

export async function fetchProductReports(productId: number): Promise<InspectorReport[]> {
  return fetchWithFallback(
    `${BASE_URL}/inspector-reports/product/${productId}`,
    () => MOCK_REPORTS.filter(report => report.productId === productId),
    (data) => Array.isArray(data) ? data.map(normalizeInspectorReport) : []
  );
}

export async function fetchLatestProductReport(productId: number): Promise<InspectorReport | null> {
  return fetchWithFallback(
    `${BASE_URL}/inspector-reports/product/${productId}/latest`,
    () => MOCK_REPORTS.find(report => report.productId === productId) ?? null,
    (data) => data ? normalizeInspectorReport(data) : null
  );
}

export async function createInspectorReport(payload: InspectorReportPayload): Promise<InspectorReport> {
  const response = await fetch(`${BASE_URL}/inspector-reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseApiResponse<any>(response, 'Tao bao cao kiem dinh that bai');
  return normalizeInspectorReport(data);
}

export async function updateInspectorReport(reportId: number, payload: Partial<InspectorReportPayload>): Promise<InspectorReport> {
  const response = await fetch(`${BASE_URL}/inspector-reports/${reportId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseApiResponse<any>(response, 'Cap nhat bao cao kiem dinh that bai');
  return normalizeInspectorReport(data);
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
