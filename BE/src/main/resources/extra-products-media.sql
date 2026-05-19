-- ============================================================
-- REBIKE Extra Products + Product Media
-- Chay sau khi backend da tao bang bang Hibernate.
--
-- Neu database moi tinh:
--   1. docker compose up backend db
--   2. chay file nay trong DBeaver/psql
--
-- Ghi chu:
--   - File nay tu chen seller/brand/category can thiet neu chua co.
--   - Product moi dung id 101-124 de tranh dung seed-data.sql cu.
--   - Muon dung anh that: thay cac gia tri media_url trong bang product_media.
-- ============================================================

-- ==================== REQUIRED SELLERS ====================

INSERT INTO users (id, name, email, phone, password, role, created_at) VALUES
(3, 'Le Minh Dai Ly',       'seller1@rebike.vn',   '0912000001', 'seller123', 'SELLER', NOW()),
(4, 'Pham Hoang Shop',      'proshop@rebike.vn',   '0912000002', 'seller123', 'SELLER', NOW()),
(5, 'Vo Thanh Bike Store',  'bikestore@rebike.vn', '0912000003', 'seller123', 'SELLER', NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;


-- ==================== REQUIRED BRANDS ====================

INSERT INTO brand (id, name) VALUES
(1, 'Pinarello'),
(2, 'Specialized'),
(3, 'Trek'),
(4, 'Giant'),
(5, 'Colnago'),
(6, 'Orbea'),
(7, 'Cannondale'),
(8, 'Bianchi'),
(9, 'Cervelo'),
(10, 'Scott'),
(11, 'Merida'),
(12, 'Santa Cruz'),
(13, 'Canyon'),
(14, 'BMC'),
(15, 'Factor')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('brand', 'id'), COALESCE(MAX(id), 1)) FROM brand;


-- ==================== REQUIRED CATEGORIES ====================

INSERT INTO category (id, name) VALUES
(1, 'Road'),
(2, 'MTB'),
(3, 'Gravel'),
(4, 'E-Bike'),
(5, 'Race Pro')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('category', 'id'), COALESCE(MAX(id), 1)) FROM category;


-- ==================== MEDIA FOR EXISTING SEED PRODUCTS 1-15 ====================
-- Cac dong nay chi insert neu product id 1-15 dang ton tai.

INSERT INTO product_media (id, product_id, media_url, media_type, is_thumbnail)
SELECT *
FROM (VALUES
  (801,  1, 'https://placehold.co/1200x800/111827/ffffff?text=Pinarello+Dogma+F', 'IMAGE', 'true'),
  (802,  1, 'https://placehold.co/1200x800/374151/ffffff?text=Dogma+F+Detail', 'IMAGE', 'false'),
  (803,  2, 'https://placehold.co/1200x800/14532d/ffffff?text=Specialized+Diverge+STR', 'IMAGE', 'true'),
  (804,  2, 'https://placehold.co/1200x800/166534/ffffff?text=Diverge+Cockpit', 'IMAGE', 'false'),
  (805,  3, 'https://placehold.co/1200x800/1e293b/ffffff?text=Trek+Madone+SLR+7', 'IMAGE', 'true'),
  (806,  3, 'https://placehold.co/1200x800/334155/ffffff?text=Madone+Wheelset', 'IMAGE', 'false'),
  (807,  4, 'https://placehold.co/1200x800/1d4ed8/ffffff?text=Giant+Propel+Advanced+SL', 'IMAGE', 'true'),
  (808,  4, 'https://placehold.co/1200x800/2563eb/ffffff?text=Propel+Disc+Brake', 'IMAGE', 'false'),
  (809,  5, 'https://placehold.co/1200x800/ca8a04/111827?text=Colnago+V4Rs', 'IMAGE', 'true'),
  (810,  5, 'https://placehold.co/1200x800/eab308/111827?text=V4Rs+Frameset', 'IMAGE', 'false'),
  (811,  6, 'https://placehold.co/1200x800/18181b/ffffff?text=Orbea+Orca+M20iLTD', 'IMAGE', 'true'),
  (812,  6, 'https://placehold.co/1200x800/27272a/ffffff?text=Orca+Ultegra+Di2', 'IMAGE', 'false'),
  (813,  7, 'https://placehold.co/1200x800/1e40af/ffffff?text=Cannondale+SuperSix+EVO', 'IMAGE', 'true'),
  (814,  7, 'https://placehold.co/1200x800/2563eb/ffffff?text=SuperSix+Carbon', 'IMAGE', 'false'),
  (815,  8, 'https://placehold.co/1200x800/67e8f9/111827?text=Bianchi+Oltre+RC', 'IMAGE', 'true'),
  (816,  8, 'https://placehold.co/1200x800/a5f3fc/111827?text=Oltre+Celeste', 'IMAGE', 'false'),
  (817,  9, 'https://placehold.co/1200x800/854d0e/ffffff?text=Trek+Fuel+EXe+9.9', 'IMAGE', 'true'),
  (818,  9, 'https://placehold.co/1200x800/a16207/ffffff?text=Fuel+EXe+Suspension', 'IMAGE', 'false'),
  (819, 10, 'https://placehold.co/1200x800/0f172a/ffffff?text=Cervelo+S5+Disc', 'IMAGE', 'true'),
  (820, 10, 'https://placehold.co/1200x800/1e293b/ffffff?text=S5+Aero+Bar', 'IMAGE', 'false'),
  (821, 11, 'https://placehold.co/1200x800/64748b/ffffff?text=Pinarello+Nytro+E-Road', 'IMAGE', 'true'),
  (822, 11, 'https://placehold.co/1200x800/94a3b8/111827?text=Nytro+Motor', 'IMAGE', 'false'),
  (823, 12, 'https://placehold.co/1200x800/be123c/ffffff?text=Scott+Addict+RC', 'IMAGE', 'true'),
  (824, 12, 'https://placehold.co/1200x800/e11d48/ffffff?text=Addict+RC+Detail', 'IMAGE', 'false'),
  (825, 13, 'https://placehold.co/1200x800/b91c1c/ffffff?text=Giant+Reign+Advanced+Pro', 'IMAGE', 'true'),
  (826, 13, 'https://placehold.co/1200x800/dc2626/ffffff?text=Reign+Fox+Factory', 'IMAGE', 'false'),
  (827, 14, 'https://placehold.co/1200x800/0e7490/ffffff?text=Specialized+Turbo+Creo+2', 'IMAGE', 'true'),
  (828, 14, 'https://placehold.co/1200x800/0891b2/ffffff?text=Creo+Battery', 'IMAGE', 'false'),
  (829, 15, 'https://placehold.co/1200x800/111827/ffffff?text=Colnago+C68+Disc', 'IMAGE', 'true'),
  (830, 15, 'https://placehold.co/1200x800/374151/ffffff?text=C68+Campagnolo', 'IMAGE', 'false')
) AS media_seed(id, product_id, media_url, media_type, is_thumbnail)
WHERE EXISTS (SELECT 1 FROM product WHERE product.id = media_seed.product_id)
ON CONFLICT (id) DO NOTHING;


-- ==================== EXTRA PRODUCTS 101-124 ====================

INSERT INTO product (id, title, price, total, condition_percent, status, seller_id, brand_id, category_id, created_at, updated_at) VALUES
(101, 'Canyon Aeroad CF SLX 8 Di2 2025 size M',                         56000000, 1, 94, 'PUBLISHED', 3, 13, 1, NOW(), NOW()),
(102, 'BMC Teammachine SLR01 Ultegra Di2 size 54',                      44500000, 1, 88, 'PUBLISHED', 3, 14, 1, NOW(), NOW()),
(103, 'Factor Ostro VAM SRAM Force AXS carbon wheelset',                68000000, 1, 96, 'PUBLISHED', 3, 15, 5, NOW(), NOW()),
(104, 'Merida Reacto 8000 Shimano Ultegra Di2',                         36500000, 1, 84, 'PUBLISHED', 3, 11, 1, NOW(), NOW()),
(105, 'Santa Cruz Blur C GX AXS 29er full suspension',                  52000000, 1, 87, 'PUBLISHED', 3, 12, 2, NOW(), NOW()),
(106, 'Trek Checkpoint SL 6 AXS gravel carbon',                         33500000, 1, 82, 'PUBLISHED', 3, 3, 3, NOW(), NOW()),
(107, 'Specialized Tarmac SL7 Comp Rival eTap AXS',                     41000000, 2, 89, 'PUBLISHED', 4, 2, 1, NOW(), NOW()),
(108, 'Giant TCR Advanced Pro 1 Disc KOM',                              28500000, 1, 79, 'PUBLISHED', 4, 4, 1, NOW(), NOW()),
(109, 'Cannondale Scalpel Carbon SE LTD Lefty Ocho',                    47000000, 1, 86, 'PUBLISHED', 4, 7, 2, NOW(), NOW()),
(110, 'Bianchi Sprint 105 Di2 celeste size 53',                         24000000, 1, 78, 'PUBLISHED', 4, 8, 1, NOW(), NOW()),
(111, 'Orbea Terra M30 Team gravel GRX carbon',                         30000000, 1, 83, 'PUBLISHED', 4, 6, 3, NOW(), NOW()),
(112, 'Scott Spark RC Team Issue AXS 29 inch',                          43000000, 1, 85, 'PUBLISHED', 4, 10, 2, NOW(), NOW()),
(113, 'Pinarello Grevil F gravel Shimano GRX Di2',                      46000000, 1, 91, 'PUBLISHED', 5, 1, 3, NOW(), NOW()),
(114, 'Colnago G3-X gravel Ekar 1x13 carbon',                           39500000, 1, 90, 'PUBLISHED', 5, 5, 3, NOW(), NOW()),
(115, 'Cervelo Caledonia-5 Ultegra Di2 endurance road',                 42000000, 1, 87, 'PUBLISHED', 5, 9, 1, NOW(), NOW()),
(116, 'Specialized Epic EVO Expert Carbon 29',                          54000000, 1, 92, 'PUBLISHED', 5, 2, 2, NOW(), NOW()),
(117, 'Giant Trance X Advanced E Plus Elite eMTB',                      62000000, 1, 93, 'PUBLISHED', 5, 4, 4, NOW(), NOW()),
(118, 'Trek Domane Plus SLR 7 eTap e-road',                             71000000, 1, 95, 'PUBLISHED', 5, 3, 4, NOW(), NOW()),
(119, 'Merida Silex 7000 gravel carbon size M',                         27000000, 1, 81, 'PUBLISHED', 3, 11, 3, NOW(), NOW()),
(120, 'Canyon Grizl CF SL 8 Trail suspension fork',                     32000000, 1, 86, 'PUBLISHED', 3, 13, 3, NOW(), NOW()),
(121, 'BMC Fourstroke 01 Two XC race 29er',                             59000000, 1, 90, 'PUBLISHED', 4, 14, 2, NOW(), NOW()),
(122, 'Factor LS gravel SRAM Rival XPLR AXS',                           50000000, 1, 92, 'PUBLISHED', 4, 15, 3, NOW(), NOW()),
(123, 'Scott Solace eRide 20 dropbar e-bike',                           48000000, 1, 88, 'PUBLISHED', 5, 10, 4, NOW(), NOW()),
(124, 'Pinarello F5 105 Di2 endurance road bike',                       36000000, 1, 89, 'PUBLISHED', 5, 1, 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('product', 'id'), COALESCE(MAX(id), 1)) FROM product;


-- ==================== BIKE SPECS FOR PRODUCTS 101-124 ====================

INSERT INTO bikes (id, frame_size, wheel_size, is_verified, min_rider_height, max_rider_height, max_weight_capacity_kg, weight_kg, color) VALUES
(101, 'M (54cm)',  '700c', true,  170, 182, 110, 7.1,  'Stealth Black'),
(102, 'M (54cm)',  '700c', true,  168, 180, 110, 7.3,  'Red Carbon'),
(103, 'M (54cm)',  '700c', true,  170, 182, 110, 6.8,  'Pearl White'),
(104, 'S (52cm)',  '700c', false, 162, 174, 105, 7.9,  'Team Bahrain'),
(105, 'M (17in)',  '29"',  true,  168, 182, 130, 11.8, 'Matte Purple'),
(106, 'L (56cm)',  '700c', true,  175, 188, 120, 9.1,  'Dark Olive'),
(107, 'M (54cm)',  '700c', true,  170, 182, 110, 7.6,  'Gloss Red'),
(108, 'S (51cm)',  '700c', false, 160, 172, 105, 7.4,  'Blue Ashes'),
(109, 'M (17in)',  '29"',  true,  168, 182, 130, 10.9, 'Black Pearl'),
(110, 'S (53cm)',  '700c', false, 163, 174, 105, 8.8,  'Celeste'),
(111, 'M (54cm)',  '700c', true,  168, 180, 120, 8.7,  'Copper'),
(112, 'L (19in)',  '29"',  true,  176, 190, 130, 11.2, 'White/Black'),
(113, 'M (54cm)',  '700c', true,  170, 182, 120, 8.5,  'Forest Green'),
(114, 'M (54cm)',  '700c', true,  170, 182, 120, 8.9,  'Sand Beige'),
(115, 'L (56cm)',  '700c', true,  175, 188, 115, 7.7,  'Deep Blue'),
(116, 'M (17in)',  '29"',  true,  168, 182, 130, 11.6, 'Satin Black'),
(117, 'M (17in)',  '29"',  true,  168, 182, 135, 18.2, 'Electric Blue'),
(118, 'M (54cm)',  '700c', true,  170, 182, 120, 12.1, 'Plasma Grey'),
(119, 'M (54cm)',  '700c', false, 168, 180, 120, 8.8,  'Teal'),
(120, 'L (56cm)',  '700c', true,  175, 188, 125, 9.4,  'Curry Powder'),
(121, 'M (17in)',  '29"',  true,  168, 182, 130, 10.7, 'Raw Carbon'),
(122, 'M (54cm)',  '700c', true,  170, 182, 120, 8.4,  'Metallic Silver'),
(123, 'S (52cm)',  '700c', true,  162, 174, 120, 11.6, 'Moon Grey'),
(124, 'M (54cm)',  '700c', true,  170, 182, 110, 8.1,  'Racing Blue')
ON CONFLICT (id) DO NOTHING;


-- ==================== PRODUCT MEDIA FOR PRODUCTS 101-124 ====================
-- Doi link o cot media_url thanh link anh/video that cua ban neu muon.
-- media_type nen la IMAGE hoac VIDEO.
-- Moi san pham nen co 1 dong is_thumbnail = 'true'.

INSERT INTO product_media (id, product_id, media_url, media_type, is_thumbnail) VALUES
(1001, 101, 'https://placehold.co/1200x800/111827/ffffff?text=Canyon+Aeroad+CF+SLX', 'IMAGE', 'true'),
(1002, 101, 'https://placehold.co/1200x800/374151/ffffff?text=Aeroad+Drivetrain', 'IMAGE', 'false'),
(1003, 102, 'https://placehold.co/1200x800/991b1b/ffffff?text=BMC+Teammachine+SLR01', 'IMAGE', 'true'),
(1004, 102, 'https://placehold.co/1200x800/b91c1c/ffffff?text=Teammachine+Cockpit', 'IMAGE', 'false'),
(1005, 103, 'https://placehold.co/1200x800/f8fafc/111827?text=Factor+Ostro+VAM', 'IMAGE', 'true'),
(1006, 103, 'https://placehold.co/1200x800/e5e7eb/111827?text=Ostro+VAM+Wheelset', 'IMAGE', 'false'),
(1007, 104, 'https://placehold.co/1200x800/0f172a/ffffff?text=Merida+Reacto+8000', 'IMAGE', 'true'),
(1008, 104, 'https://placehold.co/1200x800/1e293b/ffffff?text=Reacto+Ultegra+Di2', 'IMAGE', 'false'),
(1009, 105, 'https://placehold.co/1200x800/581c87/ffffff?text=Santa+Cruz+Blur+C', 'IMAGE', 'true'),
(1010, 105, 'https://placehold.co/1200x800/7e22ce/ffffff?text=Blur+Suspension', 'IMAGE', 'false'),
(1011, 106, 'https://placehold.co/1200x800/365314/ffffff?text=Trek+Checkpoint+SL+6', 'IMAGE', 'true'),
(1012, 106, 'https://placehold.co/1200x800/4d7c0f/ffffff?text=Checkpoint+Gravel', 'IMAGE', 'false'),
(1013, 107, 'https://placehold.co/1200x800/b91c1c/ffffff?text=Specialized+Tarmac+SL7', 'IMAGE', 'true'),
(1014, 107, 'https://placehold.co/1200x800/dc2626/ffffff?text=Tarmac+AXS', 'IMAGE', 'false'),
(1015, 108, 'https://placehold.co/1200x800/1d4ed8/ffffff?text=Giant+TCR+Advanced+Pro', 'IMAGE', 'true'),
(1016, 108, 'https://placehold.co/1200x800/2563eb/ffffff?text=TCR+KOM', 'IMAGE', 'false'),
(1017, 109, 'https://placehold.co/1200x800/111827/ffffff?text=Cannondale+Scalpel+Carbon', 'IMAGE', 'true'),
(1018, 109, 'https://placehold.co/1200x800/374151/ffffff?text=Scalpel+Lefty+Ocho', 'IMAGE', 'false'),
(1019, 110, 'https://placehold.co/1200x800/67e8f9/111827?text=Bianchi+Sprint+105+Di2', 'IMAGE', 'true'),
(1020, 110, 'https://placehold.co/1200x800/a5f3fc/111827?text=Sprint+Celeste', 'IMAGE', 'false'),
(1021, 111, 'https://placehold.co/1200x800/92400e/ffffff?text=Orbea+Terra+M30', 'IMAGE', 'true'),
(1022, 111, 'https://placehold.co/1200x800/b45309/ffffff?text=Terra+GRX', 'IMAGE', 'false'),
(1023, 112, 'https://placehold.co/1200x800/f8fafc/111827?text=Scott+Spark+RC', 'IMAGE', 'true'),
(1024, 112, 'https://placehold.co/1200x800/e2e8f0/111827?text=Spark+AXS+29', 'IMAGE', 'false'),
(1025, 113, 'https://placehold.co/1200x800/14532d/ffffff?text=Pinarello+Grevil+F', 'IMAGE', 'true'),
(1026, 113, 'https://placehold.co/1200x800/166534/ffffff?text=Grevil+GRX+Di2', 'IMAGE', 'false'),
(1027, 114, 'https://placehold.co/1200x800/a16207/ffffff?text=Colnago+G3-X', 'IMAGE', 'true'),
(1028, 114, 'https://placehold.co/1200x800/ca8a04/111827?text=G3-X+Ekar', 'IMAGE', 'false'),
(1029, 115, 'https://placehold.co/1200x800/1e3a8a/ffffff?text=Cervelo+Caledonia-5', 'IMAGE', 'true'),
(1030, 115, 'https://placehold.co/1200x800/1d4ed8/ffffff?text=Caledonia+Endurance', 'IMAGE', 'false'),
(1031, 116, 'https://placehold.co/1200x800/111827/ffffff?text=Specialized+Epic+EVO', 'IMAGE', 'true'),
(1032, 116, 'https://placehold.co/1200x800/374151/ffffff?text=Epic+Carbon+29', 'IMAGE', 'false'),
(1033, 117, 'https://placehold.co/1200x800/0e7490/ffffff?text=Giant+Trance+X+E-Plus', 'IMAGE', 'true'),
(1034, 117, 'https://placehold.co/1200x800/0891b2/ffffff?text=Trance+E-MTB', 'IMAGE', 'false'),
(1035, 118, 'https://placehold.co/1200x800/334155/ffffff?text=Trek+Domane+Plus+SLR', 'IMAGE', 'true'),
(1036, 118, 'https://placehold.co/1200x800/475569/ffffff?text=Domane+E-Road', 'IMAGE', 'false'),
(1037, 119, 'https://placehold.co/1200x800/0f766e/ffffff?text=Merida+Silex+7000', 'IMAGE', 'true'),
(1038, 119, 'https://placehold.co/1200x800/14b8a6/111827?text=Silex+Gravel', 'IMAGE', 'false'),
(1039, 120, 'https://placehold.co/1200x800/ca8a04/111827?text=Canyon+Grizl+CF+SL', 'IMAGE', 'true'),
(1040, 120, 'https://placehold.co/1200x800/eab308/111827?text=Grizl+Trail', 'IMAGE', 'false'),
(1041, 121, 'https://placehold.co/1200x800/111827/ffffff?text=BMC+Fourstroke+01', 'IMAGE', 'true'),
(1042, 121, 'https://placehold.co/1200x800/374151/ffffff?text=Fourstroke+XC', 'IMAGE', 'false'),
(1043, 122, 'https://placehold.co/1200x800/71717a/ffffff?text=Factor+LS+Gravel', 'IMAGE', 'true'),
(1044, 122, 'https://placehold.co/1200x800/a1a1aa/111827?text=LS+XPLR+AXS', 'IMAGE', 'false'),
(1045, 123, 'https://placehold.co/1200x800/52525b/ffffff?text=Scott+Solace+eRide', 'IMAGE', 'true'),
(1046, 123, 'https://placehold.co/1200x800/71717a/ffffff?text=Solace+E-Bike', 'IMAGE', 'false'),
(1047, 124, 'https://placehold.co/1200x800/1d4ed8/ffffff?text=Pinarello+F5+105+Di2', 'IMAGE', 'true'),
(1048, 124, 'https://placehold.co/1200x800/2563eb/ffffff?text=F5+Endurance', 'IMAGE', 'false')
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE
  product_media_seq_name text;
BEGIN
  SELECT pg_get_serial_sequence('product_media', 'id') INTO product_media_seq_name;
  IF product_media_seq_name IS NOT NULL THEN
    EXECUTE format(
      'SELECT setval(%L, (SELECT COALESCE(MAX(id), 1) FROM product_media))',
      product_media_seq_name
    );
  END IF;

  IF to_regclass('product_media_seq') IS NOT NULL THEN
    PERFORM setval('product_media_seq', (SELECT COALESCE(MAX(id), 1) FROM product_media));
  END IF;
END $$;


-- ==================== QUICK CUSTOM MEDIA TEMPLATE ====================
-- Neu muon tu them link anh cho mot product bat ky, sua product_id va media_url roi chay:
--
-- INSERT INTO product_media (product_id, media_url, media_type, is_thumbnail)
-- VALUES
-- (101, 'https://link-anh-cua-ban-1.jpg', 'IMAGE', 'true'),
-- (101, 'https://link-anh-cua-ban-2.jpg', 'IMAGE', 'false');
