-- Insert Locations/Districts
INSERT INTO locations (name, district, region) VALUES
('Central', 'Central', 'Hong Kong Island'),
('Causeway Bay', 'Causeway Bay', 'Hong Kong Island'),
('Admiralty', 'Admiralty', 'Hong Kong Island'),
('Wan Chai', 'Wan Chai', 'Hong Kong Island'),
('Tai Koo', 'Tai Koo', 'Hong Kong Island'),
('Fortress Hill', 'Fortress Hill', 'Hong Kong Island'),
('Mong Kok', 'Mong Kok', 'Kowloon'),
('Tsim Sha Tsui', 'Tsim Sha Tsui', 'Kowloon'),
('Jordan', 'Jordan', 'Kowloon'),
('Kowloon Bay', 'Kowloon Bay', 'Kowloon'),
('Sha Tin', 'Sha Tin', 'New Territories'),
('Repulse Bay', 'Repulse Bay', 'Hong Kong Island');

-- Insert Providers
INSERT INTO providers (name, email, phone, website) VALUES
('Premium Spaces HK', 'info@premiumspaces.hk', '+852 2234 5678', 'www.premiumspaces.hk'),
('Central Business Hub', 'contact@centralbiz.hk', '+852 2567 8901', 'www.centralbiz.hk'),
('Kowloon Office Solutions', 'hello@kowloonoffice.hk', '+852 2789 0123', 'www.kowloonoffice.hk'),
('New Territories Workspace', 'info@ntwspace.hk', '+852 2901 2345', 'www.ntwspace.hk'),
('Creative Hub HK', 'contact@creativehub.hk', '+852 3012 3456', 'www.creativehub.hk'),
('Executive Suites', 'sales@execsuites.hk', '+852 3123 4567', 'www.execsuites.hk');

-- Insert Offices
INSERT INTO offices (name, providerId, locationId, address, description, thumbnailUrl, rating, reviewCount, amenitiesJson) VALUES
(
  'Central Premium Tower',
  1,
  1,
  '88 Des Voeux Road Central, Central',
  'Luxury serviced office with floor-to-ceiling windows overlooking Victoria Harbour. Premium finishes, state-of-the-art technology, and exclusive business lounge.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-1-central-HmbXF8vdwB8t8jtvEngsKf.webp',
  4.8,
  124,
  JSON_ARRAY('High-speed WiFi', 'Meeting Rooms', 'Reception Service', 'Parking', 'Café', 'Gym Access')
),
(
  'Causeway Bay Creative Space',
  5,
  2,
  '500 Causeway Road, Causeway Bay',
  'Modern open-plan office ideal for startups and creative teams. Collaborative workspace with flexible layouts and vibrant atmosphere.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-2-causeway-mvx5AtpuVUpFEJRnKTkYqQ.webp',
  4.6,
  98,
  JSON_ARRAY('High-speed WiFi', 'Flexible Desks', 'Event Space', 'Kitchen', 'Lounge Area', 'Bike Storage')
),
(
  'Admiralty Executive Suite',
  2,
  3,
  '1 Admiralty Centre, Admiralty',
  'Premium executive offices with panoramic views. Perfect for established companies and corporate headquarters.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-3-admiralty-6H7HipLyZ8CpzUm7fqjgwL.webp',
  4.9,
  156,
  JSON_ARRAY('Executive Lounge', 'Conference Rooms', 'Private Parking', 'Concierge', 'Catering', 'Security 24/7')
),
(
  'Mong Kok Business Center',
  3,
  7,
  '180 Mong Kok Road, Mong Kok',
  'Affordable and accessible serviced office for SMEs and startups. Modern amenities at competitive rates.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-4-mong-kok-SWKcWRx4jsAtBJztziskk4.webp',
  4.5,
  87,
  JSON_ARRAY('High-speed WiFi', 'Meeting Rooms', 'Printing Services', 'Mailbox Service', 'Kitchen', 'Lounge')
),
(
  'Tsim Sha Tsui Luxury Office',
  6,
  8,
  '100 Nathan Road, Tsim Sha Tsui',
  'Ultra-premium serviced office with Victoria Harbour views. Marble reception, high-end finishes, and exclusive amenities.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-5-tsim-sha-tsui-VxoweseivMWcKRgop4pQJN.webp',
  4.9,
  142,
  JSON_ARRAY('Marble Reception', 'Executive Lounge', 'Premium Parking', 'Concierge Service', 'Fine Dining', 'Spa Access')
),
(
  'Sha Tin Tech Hub',
  4,
  11,
  '288 Sha Tin Centre, Sha Tin',
  'Modern tech-friendly office space in New Territories. Perfect for growing tech companies and enterprises.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-6-shatin-JUVWjL5oxfiAuh6gBwZcgz.webp',
  4.7,
  103,
  JSON_ARRAY('High-speed WiFi', 'Tech Support', 'Server Room', 'Meeting Rooms', 'Cafeteria', 'Parking')
),
(
  'Quarry Bay Industrial Loft',
  5,
  2,
  '1 Kowloon Bay Road, Quarry Bay',
  'Creative industrial-chic office space with exposed brick. Ideal for design, media, and creative agencies.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-7-quarry-bay-gi4kdXCxwDUYfJfoebxbEm.webp',
  4.6,
  92,
  JSON_ARRAY('High-speed WiFi', 'Studio Space', 'Meeting Rooms', 'Lounge', 'Kitchen', 'Event Space')
),
(
  'Wan Chai Professional Office',
  2,
  4,
  '99 Queensway, Wan Chai',
  'Professional serviced office with modern meeting facilities. Great for consultants and professional services.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-8-wan-chai-Kt2QH4o5RA2rQcEd9ouvrs.webp',
  4.7,
  110,
  JSON_ARRAY('High-speed WiFi', 'Meeting Rooms', 'Reception Service', 'Printing', 'Lounge', 'Parking')
),
(
  'Jordan Startup Hub',
  3,
  9,
  '250 Jordan Road, Jordan',
  'Budget-friendly office space perfect for startups and freelancers. Vibrant community atmosphere.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-9-jordan-5axZDEEgcHu6gou9a5vXkY.webp',
  4.4,
  76,
  JSON_ARRAY('High-speed WiFi', 'Hot Desks', 'Meeting Rooms', 'Kitchen', 'Community Events', 'Flexible Terms')
),
(
  'Tai Koo Premium Workspace',
  1,
  5,
  '555 Tai Koo Shing Road, Tai Koo',
  'Premium office space with modern architecture and glass partitions. Excellent for growing companies.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-10-tai-koo-A4GDtupe5NXDDUjkyxNoDD.webp',
  4.8,
  128,
  JSON_ARRAY('High-speed WiFi', 'Meeting Rooms', 'Reception', 'Parking', 'Gym', 'Café')
),
(
  'New Territories Business Complex',
  4,
  11,
  '100 Enterprise Road, Sha Tin',
  'Large-scale office complex with comprehensive facilities. Ideal for enterprises and large teams.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-11-new-territories-DbShYD9EAqe7b6NiqLEZ98.webp',
  4.7,
  115,
  JSON_ARRAY('High-speed WiFi', 'Multiple Meeting Rooms', 'Cafeteria', 'Parking', 'Gym', 'Event Space')
),
(
  'Central Executive Boardroom',
  6,
  1,
  '75 Des Voeux Road Central, Central',
  'Exclusive executive boardroom for premium meetings and presentations. Stunning harbour views.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-12-central-meeting-6HU22V6VKeWv38gH7PP7iQ.webp',
  4.9,
  138,
  JSON_ARRAY('Executive Boardroom', 'AV Equipment', 'Catering', 'Private Parking', 'Concierge', 'Premium Lounge')
),
(
  'Kowloon Bay Tech Office',
  3,
  10,
  '300 Kowloon Bay Road, Kowloon Bay',
  'Modern tech-focused office with collaborative spaces. Perfect for startups and tech companies.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-13-kowloon-bay-ZSVxXnF3SoGyTPRRzJdhj9.webp',
  4.6,
  94,
  JSON_ARRAY('High-speed WiFi', 'Tech Support', 'Meeting Rooms', 'Lounge', 'Kitchen', 'Event Space')
),
(
  'Repulse Bay Boutique Office',
  1,
  12,
  '123 Repulse Bay Road, Repulse Bay',
  'Exclusive boutique office in premium location. Scenic views and luxury finishes.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-14-repulse-bay-YeArMsTHsTJNgF4cxAemnJ.webp',
  4.8,
  105,
  JSON_ARRAY('Premium Location', 'High-speed WiFi', 'Meeting Rooms', 'Lounge', 'Parking', 'Concierge')
),
(
  'Fortress Hill Professional Hub',
  2,
  6,
  '88 Fortress Hill Road, Fortress Hill',
  'Professional office space with modern amenities. Accessible location on Hong Kong Island.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-15-fortress-hill-9f5xaKwLgrfX24GvBe8xJK.webp',
  4.7,
  108,
  JSON_ARRAY('High-speed WiFi', 'Meeting Rooms', 'Reception', 'Printing', 'Lounge', 'Parking')
);

-- Insert Pricing Packages for each office
-- Central Premium Tower
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(1, 'Solo Desk', 8000, 'month', 'Dedicated desk in shared office', 1),
(1, 'Private Office Small', 18000, 'month', 'Private office for 2-3 people', 3),
(1, 'Private Office Large', 35000, 'month', 'Private office for 5-8 people', 8);

-- Causeway Bay Creative Space
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(2, 'Hot Desk', 4500, 'month', 'Flexible hot desk access', 1),
(2, 'Dedicated Desk', 6500, 'month', 'Dedicated desk with locker', 1),
(2, 'Private Office', 15000, 'month', 'Private office for 2-4 people', 4);

-- Admiralty Executive Suite
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(3, 'Private Office Medium', 25000, 'month', 'Premium private office', 4),
(3, 'Private Office Large', 45000, 'month', 'Spacious private office', 8),
(3, 'Executive Suite', 65000, 'month', 'Full executive suite with lounge', 12);

-- Mong Kok Business Center
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(4, 'Hot Desk', 3500, 'month', 'Flexible hot desk access', 1),
(4, 'Dedicated Desk', 5000, 'month', 'Dedicated desk', 1),
(4, 'Small Office', 10000, 'month', 'Small private office', 2);

-- Tsim Sha Tsui Luxury Office
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(5, 'Private Office', 28000, 'month', 'Premium private office', 3),
(5, 'Executive Office', 50000, 'month', 'Executive office with lounge', 6),
(5, 'Penthouse Suite', 85000, 'month', 'Ultra-premium penthouse suite', 15);

-- Sha Tin Tech Hub
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(6, 'Dedicated Desk', 5500, 'month', 'Dedicated tech desk', 1),
(6, 'Small Team Office', 12000, 'month', 'Office for 3-4 people', 4),
(6, 'Large Team Office', 28000, 'month', 'Office for 8-10 people', 10);

-- Quarry Bay Industrial Loft
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(7, 'Studio Space', 7000, 'month', 'Creative studio space', 2),
(7, 'Studio Suite', 14000, 'month', 'Larger creative suite', 5),
(7, 'Full Floor', 35000, 'month', 'Entire floor for creative team', 12);

-- Wan Chai Professional Office
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(8, 'Dedicated Desk', 6000, 'month', 'Professional dedicated desk', 1),
(8, 'Private Office', 16000, 'month', 'Private office for consultants', 3),
(8, 'Suite Office', 32000, 'month', 'Full suite for professional team', 6);

-- Jordan Startup Hub
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(9, 'Hot Desk', 3000, 'month', 'Flexible hot desk', 1),
(9, 'Dedicated Desk', 4500, 'month', 'Dedicated startup desk', 1),
(9, 'Startup Office', 9000, 'month', 'Small office for startup', 2);

-- Tai Koo Premium Workspace
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(10, 'Dedicated Desk', 7000, 'month', 'Premium dedicated desk', 1),
(10, 'Private Office', 17000, 'month', 'Private office for 3 people', 3),
(10, 'Team Office', 38000, 'month', 'Team office for 8 people', 8);

-- New Territories Business Complex
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(11, 'Dedicated Desk', 5000, 'month', 'Dedicated workspace', 1),
(11, 'Small Office', 11000, 'month', 'Small office for 2-3 people', 3),
(11, 'Large Office', 26000, 'month', 'Large office for 10+ people', 12);

-- Central Executive Boardroom
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(12, 'Boardroom Hourly', 2000, 'hour', 'Premium boardroom rental', 20),
(12, 'Boardroom Daily', 12000, 'day', 'Full day boardroom rental', 20),
(12, 'Boardroom Monthly', 55000, 'month', 'Monthly boardroom access', 20);

-- Kowloon Bay Tech Office
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(13, 'Dedicated Desk', 5500, 'month', 'Tech-focused dedicated desk', 1),
(13, 'Small Team', 13000, 'month', 'Office for 3-4 tech team', 4),
(13, 'Medium Team', 28000, 'month', 'Office for 8-10 tech team', 10);

-- Repulse Bay Boutique Office
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(14, 'Private Office', 22000, 'month', 'Premium private office', 3),
(14, 'Executive Office', 42000, 'month', 'Executive office with view', 6),
(14, 'Luxury Suite', 72000, 'month', 'Luxury office suite', 12);

-- Fortress Hill Professional Hub
INSERT INTO pricing (officeId, name, price, billingCycle, description, capacity) VALUES
(15, 'Dedicated Desk', 6000, 'month', 'Professional dedicated desk', 1),
(15, 'Private Office', 15000, 'month', 'Private office for 2-3 people', 3),
(15, 'Team Office', 30000, 'month', 'Team office for 6-8 people', 8);
