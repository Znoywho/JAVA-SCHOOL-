-- ============================================================
-- REBIKE Database Seed Data
-- PostgreSQL - Compatible with Spring Boot JPA (ddl-auto: update)
-- ============================================================
-- Chạy sau khi Spring Boot đã tạo tables (ddl-auto: update)
-- Cách chạy: psql -h localhost -p 5432 -U postgres -d rebikedatabase -f seed-data.sql
-- ============================================================

-- ==================== 1. USERS (10 users) ====================
-- Roles: BUYER, SELLER, INSPECTOR, ADMIN
-- Table: users (id, name, email, phone, password, role, created_at)

INSERT INTO users (id, name, email, phone, password, role, created_at) VALUES
-- 2 ADMIN
(1, 'Nguyễn Văn Admin',    'admin@rebike.vn',         '0901000001', 'admin123',   'ADMIN',     NOW()),
(2, 'Trần Thị Quản Lý',    'manager@rebike.vn',       '0901000002', 'admin123',   'ADMIN',     NOW()),

-- 3 SELLER
(3, 'Lê Minh Đại Lý',      'seller1@rebike.vn',       '0912000001', 'seller123',  'SELLER',    NOW()),
(4, 'Phạm Hoàng Shop',     'proshop@rebike.vn',       '0912000002', 'seller123',  'SELLER',    NOW()),
(5, 'Võ Thanh Bike Store',  'bikestore@rebike.vn',     '0912000003', 'seller123',  'SELLER',    NOW()),

-- 3 BUYER
(6, 'Nguyễn Thị Hoa',      'buyer1@gmail.com',        '0933000001', 'buyer123',   'BUYER',     NOW()),
(7, 'Trần Văn Nam',         'buyer2@gmail.com',        '0933000002', 'buyer123',   'BUYER',     NOW()),
(8, 'Lý Minh Tuấn',        'buyer3@gmail.com',        '0933000003', 'buyer123',   'BUYER',     NOW()),

-- 2 INSPECTOR
(9, 'Đỗ Quốc Kiểm Định',   'inspector1@rebike.vn',    '0944000001', 'inspect123', 'INSPECTOR', NOW()),
(10, 'Huỳnh Văn Kỹ Thuật', 'inspector2@rebike.vn',    '0944000002', 'inspect123', 'INSPECTOR', NOW())

ON CONFLICT (id) DO NOTHING;

-- Reset sequence cho id tự động tiếp theo
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;


-- ==================== 2. BRANDS ====================

INSERT INTO brand (id, name) VALUES
(1, 'Pinarello'),
(2, 'Specialized'),
(3, 'Trek'),
(4, 'Giant'),
(5, 'Colnago'),
(6, 'Orbea'),
(7, 'Cannondale'),
(8, 'Bianchi'),
(9, 'Cervélo'),
(10, 'Scott')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('brand', 'id'), COALESCE(MAX(id), 1)) FROM brand;


-- ==================== 3. CATEGORIES ====================

INSERT INTO category (id, name) VALUES
(1, 'Road'),
(2, 'MTB'),
(3, 'Gravel'),
(4, 'E-Bike'),
(5, 'Race Pro')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('category', 'id'), COALESCE(MAX(id), 1)) FROM category;


-- ==================== 4. PRODUCTS (15 xe đạp) ====================
-- Table: product (id, title, price, total, condition_percent, status, seller_id, brand_id, category_id, created_at, updated_at)

INSERT INTO product (id, title, price, total, condition_percent, status, seller_id, brand_id, category_id, created_at, updated_at) VALUES
-- Seller 3 (Lê Minh Đại Lý) - 5 sản phẩm
(1,  'Pinarello Dogma F 2025 Shimano Dura-Ace Di2 / Fulcrum Racing 600',          45000000, 1, 92, 'PUBLISHED', 3, 1, 1, NOW(), NOW()),
(2,  'Specialized Diverge STR Expert SRAM Rival AXS / Roval Terra CLX',            38500000, 1, 85, 'PUBLISHED', 3, 2, 3, NOW(), NOW()),
(3,  'Trek Madone SLR 7 eTap AXS size 54 / Bontrager Aeolus RSL 37',              52000000, 1, 88, 'PUBLISHED', 3, 3, 1, NOW(), NOW()),
(4,  'Giant Propel Advanced SL Disc Shimano Dura-Ace / Cadex 42 Disc',             42000000, 2, 78, 'PUBLISHED', 3, 4, 1, NOW(), NOW()),
(5,  'Colnago V4Rs Pogačar Edition 2025 Shimano Dura-Ace Di2',                     49500000, 1, 95, 'PUBLISHED', 3, 5, 5, NOW(), NOW()),

-- Seller 4 (Phạm Hoàng Shop) - 5 sản phẩm
(6,  'Orbea Orca M20iLTD 2024 Shimano Ultegra Di2 / Vision Metron 45',             35000000, 1, 82, 'PUBLISHED', 4, 6, 1, NOW(), NOW()),
(7,  'Cannondale SuperSix EVO Hi-MOD Disc SRAM Force AXS / HollowGram',            48000000, 1, 89, 'PUBLISHED', 4, 7, 1, NOW(), NOW()),
(8,  'Bianchi Oltre RC Campagnolo Super Record EPS / Fulcrum Speed 40',             58000000, 1, 91, 'PUBLISHED', 4, 8, 5, NOW(), NOW()),
(9,  'Trek Fuel EXe 9.9 XX AXS T-Type / Bontrager Kovee Pro 30 Carbon',            62000000, 1, 86, 'PUBLISHED', 4, 3, 2, NOW(), NOW()),
(10, 'Cervélo S5 Disc Shimano Dura-Ace Di2 / Reserve 63/50 Carbon',                55000000, 1, 90, 'PUBLISHED', 4, 9, 1, NOW(), NOW()),

-- Seller 5 (Võ Thanh Bike Store) - 5 sản phẩm
(11, 'Pinarello Nytro E-Road Shimano Ultegra Di2 / Fulcrum Racing 500',            32000000, 2, 75, 'PUBLISHED', 5, 1, 4, NOW(), NOW()),
(12, 'Scott Addict RC Ultimate Shimano Dura-Ace Di2 / Syncros Capital SL',         47000000, 1, 93, 'PUBLISHED', 5, 10, 5, NOW(), NOW()),
(13, 'Giant Reign Advanced Pro 29 Fox Factory / Shimano Deore XT',                  39000000, 1, 80, 'PUBLISHED', 5, 4, 2, NOW(), NOW()),
(14, 'Specialized Turbo Creo 2 Expert Carbon Shimano GRX Di2',                     65000000, 1, 97, 'PUBLISHED', 5, 2, 4, NOW(), NOW()),
(15, 'Colnago C68 Disc Campagnolo Super Record EPS / Bora Ultra WTO 45',           72000000, 1, 96, 'PUBLISHED', 5, 5, 1, NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('product', 'id'), COALESCE(MAX(id), 1)) FROM product;


-- ==================== 5. BIKES (thông số kỹ thuật cho 15 xe) ====================
-- Table: bikes (id, frame_size, wheel_size, is_verified, min_rider_height, max_rider_height, max_weight_capacity_kg, weight_kg, color)

INSERT INTO bikes (id, frame_size, wheel_size, is_verified, min_rider_height, max_rider_height, max_weight_capacity_kg, weight_kg, color) VALUES
(1,  'M (54cm)',  '700c',  true,  170, 180, 110, 6.8,  'Đen/Đỏ'),
(2,  'L (56cm)',  '700c',  true,  175, 185, 120, 8.5,  'Xanh Lá'),
(3,  'M (54cm)',  '700c',  false, 170, 180, 110, 7.2,  'Đen/Bạc'),
(4,  'S (51cm)',  '700c',  false, 160, 172, 100, 7.5,  'Trắng/Xanh'),
(5,  'S (52cm)',  '700c',  true,  162, 174, 105, 6.5,  'Vàng UAE'),
(6,  'M (53cm)',  '700c',  true,  168, 178, 110, 7.8,  'Đen'),
(7,  'L (56cm)',  '700c',  true,  175, 185, 115, 7.0,  'Xanh Dương'),
(8,  'M (54cm)',  '700c',  true,  170, 180, 110, 6.9,  'Celeste'),
(9,  'L (58cm)',  '29"',   true,  178, 190, 130, 15.2, 'Đen/Vàng'),
(10, 'M (54cm)',  '700c',  true,  170, 182, 110, 7.1,  'Đen Carbon'),
(11, 'M (54cm)',  '700c',  false, 168, 180, 120, 12.5, 'Bạc'),
(12, 'S (52cm)',  '700c',  true,  162, 174, 105, 6.6,  'Trắng/Đỏ'),
(13, 'L (56cm)',  '29"',   false, 175, 188, 130, 14.8, 'Đỏ/Đen'),
(14, 'M (54cm)',  '700c',  true,  170, 182, 120, 11.8, 'Bạc/Xanh'),
(15, 'M (54cm)',  '700c',  true,  170, 180, 110, 6.4,  'Carbon Đen')

ON CONFLICT (id) DO NOTHING;


-- ==================== DONE ====================
-- Tổng: 10 users, 10 brands, 5 categories, 15 products/bikes
-- 
-- Users theo role:
--   ADMIN:     2 (id 1-2)
--   SELLER:    3 (id 3-5)  → mỗi seller có 5 sản phẩm
--   BUYER:     3 (id 6-8)
--   INSPECTOR: 2 (id 9-10)
-- ============================================================
