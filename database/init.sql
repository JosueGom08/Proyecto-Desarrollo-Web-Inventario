SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS app_db
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;
USE app_db;

-- Tabla User alamacenará usuarios dependiendo de su nivel podran eliminar o solo consultar
CREATE TABLE IF NOT EXISTS User (
    id CHAR(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
    name VARCHAR(80) NOT NULL,
    password VARCHAR(12) NOT NULL,
    role VARCHAR(25) NOT NULL,
    email VARCHAR(50) NOT NULL
);

-- Tabla Category alamcenará la categoria de productos (muebles o tecnologicos)
CREATE TABLE IF NOT EXISTS Category (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    category VARCHAR(80) NOT NULL,
    type VARCHAR(80) NOT NULL
);

-- Tabla Element almacenará los productos (muebles, componentes de computadora, compotuadoras, ect) alamacenados en la bodega
CREATE TABLE IF NOT EXISTS Element (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(160),
    quantity INT NOT NULL,
    entryDate DATETIME NOT NULL,
    img TEXT NOT NULL,
    categoryId INT NOT NULL,
    CONSTRAINT fk_element_category 
        FOREIGN KEY (categoryId) 
        REFERENCES Category(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Tabla Movements para registrar movimientos en los elementos (insercciones, actualizaciones y eliminaciones)
CREATE TABLE IF NOT EXISTS Movements (
    id CHAR(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
    Type VARCHAR(15) NOT NULL,
    lastModification DATETIME,
    newModification DATETIME NOT NULL,
    description VARCHAR(80) NOT NULL,
    elementId INT DEFAULT NULL,
        CONSTRAINT fk_element_movement 
        FOREIGN KEY (elementId) 
        REFERENCES Element(id) 
        ON DELETE SET NULL -- Para cuando se elimine un elemento de la base de datos, se guarde el movimiento, pero donde estaba la info de Element, sera remplazada por null
        ON UPDATE CASCADE
);

INSERT INTO User (name, password, role, email) VALUES 
('Carlos Mendoza', 'Admin2026!', 'administrador', 'admin@gmail.com'),
('David Velasquez', 'ing123', 'administrador', 'admin2@gmail.com'),  -- acceso ingeniero
('Ana López', 'Consult123!', 'consultor', 'consultor@gmail.com');

-- Insertar Categorías
INSERT INTO Category (category, type) VALUES 
('Computadora', 'Electrónico'),
('Teléfono', 'Electrónico'),
('Mesa', 'Mueble'),
('Periféricos', 'Electrónico'), 
('Sillas', 'Mueble');

-- Insertar 50 Elementos con imágenes exactas según el producto
INSERT INTO Element (name, quantity, description, entryDate, img, categoryId) VALUES 
('MacBook Pro 16 M3 Pro', 12, 'Computadora portátil de alto rendimiento para profesionales', '2026-01-15 09:15:00', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 1),
('iPhone 15 Pro Max 256GB', 25, 'Teléfono inteligente de titanio con cámara avanzada', '2026-01-10 10:30:00', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 2),
('Mesa de Escritorio Ejecutivo Roble', 8, 'Escritorio de madera resistente para oficina ejecutiva', '2026-01-12 11:45:00', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500', 3),
('Teclado Mecánico Logitech G Pro X', 25, 'Teclado con interruptores intercambiables para gaming', '2026-01-14 14:20:00', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', 4),
('Silla ergonómica Herman Miller Aeron', 5, 'Silla de oficina premium diseñada para máximo soporte lumbar', '2026-01-11 16:00:00', 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500', 5),
('Dell XPS 15 9530', 8, 'Laptop con pantalla de alta resolución ideal para diseño', '2026-01-20 08:45:00', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', 1),
('Samsung Galaxy S24 Ultra', 20, 'Smartphone con S-Pen integrado e inteligencia artificial', '2026-01-18 12:10:00', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', 2),
('Mesa Gamer Altura Ajustable Elevable', 15, 'Escritorio con motor eléctrico para trabajar de pie o sentado', '2026-01-22 15:35:00', 'https://images.unsplash.com/photo-1520032525096-7bd04a94b5a2?w=500', 3),
('Mouse Inalámbrico Razer DeathAdder V3 Pro', 30, 'Ratón ergonómico ligero de alta precisión', '2026-01-19 16:50:00', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500', 4),
('Silla Gamer Secretlab Titan EVO 2024', 12, 'Silla ajusatable diseñada para largas jornadas de uso', '2026-01-17 17:15:00', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500', 5),
('Lenovo ThinkPad X1 Carbon', 15, 'Laptop empresarial ultraligera con alta durabilidad', '2026-02-01 09:30:00', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', 1),
('Google Pixel 8 Pro', 14, 'Teléfono móvil con procesamiento de imagen avanzado', '2026-01-25 11:00:00', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 2),
('Mesa de Comedor de Madera Parota 8 Sillas', 4, 'Mesa amplia de madera sólida con capacidad para 8 personas', '2026-01-28 13:25:00', 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=500', 3),
('Monitor Gamer Asus ROG Swift 27 240Hz', 12, 'Pantalla de alta tasa de refresco para respuesta rápida', '2026-01-26 14:40:00', 'https://images.unsplash.com/photo-1585792180666-f7347cc46c33?w=500', 4),
('Silla de Oficina Ejecutiva Malla Transpirable', 20, 'Silla ergonómica con respaldo fresco para trabajo diario', '2026-01-24 18:00:00', 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500', 5),
('Asus ROG Strix G16', 6, 'Laptop para videojuegos con sistema avanzado de ventilación', '2026-02-10 10:15:00', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', 1),
('Xiaomi 14 Ultra', 18, 'Smartphone enfocado en fotografía profesional con óptica Leica', '2026-02-02 12:45:00', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 2),
('Mesa Centro de Cristal Templado', 10, 'Mesa de centro moderna para salas de estar o recepción', '2026-02-05 14:10:00', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500', 3),
('Audífonos HyperX Cloud Alpha Wireless', 18, 'Auriculares con sonido envolvente y gran autonomía de batería', '2026-02-03 15:55:00', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 4),
('Silla Gamer Corsair T3 Rush', 15, 'Silla acolchada con acabado en tela suave transpirable', '2026-02-01 16:30:00', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', 5),
('HP Spectre x360', 10, 'Computadora convertible 2 en 1 con pantalla táctil', '2026-02-12 08:20:00', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', 1),
('OnePlus 12 5G', 11, 'Dispositivo de alta velocidad con carga rápida avanzada', '2026-02-08 11:15:00', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500', 2),
('Mesa Plegable de Jardín Rattan', 22, 'Mesa resistente a la intemperie para exteriores y terraza', '2026-02-11 13:50:00', 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=500', 3),
('Micrófono USB Elgato Wave:3', 15, 'Micrófono de condensador ideal para transmisión y podcasts', '2026-02-09 15:05:00', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', 4),
('Silla Ergonómica Autonomous ErgoChair Pro', 9, 'Silla totalmente reclinable con ajuste personalizado', '2026-02-07 17:40:00', 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=500', 5),
('Acer Predator Helios 16', 5, 'Laptop gaming potente con gráficos de última generación', '2026-02-18 09:10:00', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500', 1),
('Motorola Edge 50 Ultra', 15, 'Teléfono con diseño premium y acabado elegante', '2026-02-15 10:45:00', 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500', 2),
('Mesa de Conferencia Ovalada 12 Personas', 2, 'Mesa grande para salas de reuniones y juntas directivas', '2026-02-16 12:30:00', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500', 3),
('Cámara Web Logitech Brio 4K', 20, 'Cámara web Ultra HD para videoconferencias de alta calidad', '2026-02-14 14:15:00', 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500', 4),
('Silla Operativa Básica con Ruedas', 35, 'Silla sencilla y funcional para escritorios de trabajo', '2026-02-13 16:25:00', 'https://images.unsplash.com/photo-1688578736341-b88a87211116?w=500', 5),
('Apple iMac 24 M3', 7, 'Computadora de escritorio todo en uno con diseño ultra delgado', '2026-02-22 08:50:00', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', 1),
('Samsung Galaxy Z Fold 5', 7, 'Smartphone plegable de gran formato para multitarea', '2026-02-20 11:20:00', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500', 2),
('Mesa Auxiliar Estilo Industrial Metal', 18, 'Mesa compacta con estructura metálica y acabado rústico', '2026-02-21 13:00:00', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500', 3),
('Stream Deck Elgato MK.2 15 Teclas', 10, 'Controlador con teclas LCD personalizables para contenido en vivo', '2026-02-22 15:10:00', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500', 4),
('Silla Reclinable con Reposapiés para Gamer', 8, 'Silla deportiva con inclinación profunda y soporte para piernas', '2026-02-19 17:05:00', 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500', 5),
('MSI Raider GE78', 4, 'Equipo portátil para tareas pesadas y renderizado 3D', '2026-03-01 09:40:00', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500', 1),
('iPhone 14 128GB', 30, 'Teléfono inteligente versátil y de gran rendimiento', '2026-02-28 10:15:00', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 2),
('Mesa L-Desk para Oficina Moderna', 9, 'Escritorio en forma de L ideal para optimizar el espacio', '2026-02-26 12:00:00', 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500', 3),
('Alfombrilla XL Corsair MM300 PRO', 40, 'Mousepad de tela antidesgarro con superficie extra grande', '2026-02-27 14:35:00', 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=500', 4),
('Sillón de Piel Sintética para Dirección', 6, 'Sillón ejecutivo elegante con acolchado de alta densidad', '2026-02-25 16:50:00', 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500', 5),
('Microsoft Surface Laptop 6', 9, 'Laptop moderna con diseño elegante y batería de larga duración', '2026-03-05 08:30:00', 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500', 1),
('Nothing Phone (2)', 12, 'Smartphone con diseño transparente e interfaz de luces Glyph', '2026-03-02 11:50:00', 'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?w=500', 2),
('Mesa de Noche de Pino Minimalista', 25, 'Mesa pequeña de madera clara para recámara', '2026-03-04 13:15:00', 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=500', 3),
('Bocinas de Escritorio Bose Companion 2', 8, 'Sistema de altavoces estéreo con sonido claro y profundo', '2026-03-03 15:25:00', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500', 4),
('Silla de Comedor Apilable Nórdica', 28, 'Silla de diseño minimalista fácil de almacenar', '2026-03-02 17:10:00', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=500', 5),
('PC Escritorio Gaming Custom i9', 3, 'Computadora ensamblada con componentes de gama alta', '2026-03-10 09:15:00', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500', 1),
('ASUS ROG Phone 8', 6, 'Dispositivo móvil optimizado para juegos de alto nivel', '2026-03-08 10:40:00', 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500', 2),
('Mesa Plegable de Pared para Estudiar', 14, 'Mesa abatible ideal para espacios pequeños', '2026-03-09 12:20:00', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500', 3),
('Hub USB-C Satechi 9 en 1', 22, 'Adaptador multipuerto de aluminio para expansión de conectividad', '2026-03-08 14:05:00', 'https://images.unsplash.com/photo-1616440342232-211fa2e9df8f?w=500', 4),
('Silla de Conferencia Fija Base Trineo', 16, 'Silla fija para visitantes o salas de espera', '2026-03-07 16:30:00', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500', 5);

INSERT INTO Movements (Type, lastModification, newModification, elementId, description) VALUES
-- Computadoras
('INSERT', NULL, '2026-01-15', (SELECT id FROM Element WHERE name = 'MacBook Pro 16 M3 Pro' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-01-20', (SELECT id FROM Element WHERE name = 'Dell XPS 15 9530' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-01', (SELECT id FROM Element WHERE name = 'Lenovo ThinkPad X1 Carbon' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-10', (SELECT id FROM Element WHERE name = 'Asus ROG Strix G16' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-12', (SELECT id FROM Element WHERE name = 'HP Spectre x360' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-18', (SELECT id FROM Element WHERE name = 'Acer Predator Helios 16' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-22', (SELECT id FROM Element WHERE name = 'Apple iMac 24 M3' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-01', (SELECT id FROM Element WHERE name = 'MSI Raider GE78' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-05', (SELECT id FROM Element WHERE name = 'Microsoft Surface Laptop 6' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-10', (SELECT id FROM Element WHERE name = 'PC Escritorio Gaming Custom i9' LIMIT 1), 'Inserción'),

-- Teléfonos
('INSERT', NULL, '2026-01-10', (SELECT id FROM Element WHERE name = 'iPhone 15 Pro Max 256GB' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-01-18', (SELECT id FROM Element WHERE name = 'Samsung Galaxy S24 Ultra' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-01-25', (SELECT id FROM Element WHERE name = 'Google Pixel 8 Pro' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-02', (SELECT id FROM Element WHERE name = 'Xiaomi 14 Ultra' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-08', (SELECT id FROM Element WHERE name = 'OnePlus 12 5G' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-15', (SELECT id FROM Element WHERE name = 'Motorola Edge 50 Ultra' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-20', (SELECT id FROM Element WHERE name = 'Samsung Galaxy Z Fold 5' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-28', (SELECT id FROM Element WHERE name = 'iPhone 14 128GB' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-02', (SELECT id FROM Element WHERE name = 'Nothing Phone (2)' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-08', (SELECT id FROM Element WHERE name = 'ASUS ROG Phone 8' LIMIT 1), 'Inserción'),

-- Mesas
('INSERT', NULL, '2026-01-12', (SELECT id FROM Element WHERE name = 'Mesa de Escritorio Ejecutivo Roble' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-01-22', (SELECT id FROM Element WHERE name = 'Mesa Gamer Altura Ajustable Elevable' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-01-28', (SELECT id FROM Element WHERE name = 'Mesa de Comedor de Madera Parota 8 Sillas' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-05', (SELECT id FROM Element WHERE name = 'Mesa Centro de Cristal Templado' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-11', (SELECT id FROM Element WHERE name = 'Mesa Plegable de Jardín Rattan' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-16', (SELECT id FROM Element WHERE name = 'Mesa de Conferencia Ovalada 12 Personas' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-21', (SELECT id FROM Element WHERE name = 'Mesa Auxiliar Estilo Industrial Metal' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-26', (SELECT id FROM Element WHERE name = 'Mesa L-Desk para Oficina Moderna' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-04', (SELECT id FROM Element WHERE name = 'Mesa de Noche de Pino Minimalista' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-09', (SELECT id FROM Element WHERE name = 'Mesa Plegable de Pared para Estudiar' LIMIT 1), 'Inserción'),

-- Periféricos
('INSERT', NULL, '2026-01-14', (SELECT id FROM Element WHERE name = 'Teclado Mecánico Logitech G Pro X' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-01-19', (SELECT id FROM Element WHERE name = 'Mouse Inalámbrico Razer DeathAdder V3 Pro' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-01-26', (SELECT id FROM Element WHERE name = 'Monitor Gamer Asus ROG Swift 27 240Hz' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-03', (SELECT id FROM Element WHERE name = 'Audífonos HyperX Cloud Alpha Wireless' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-09', (SELECT id FROM Element WHERE name = 'Micrófono USB Elgato Wave:3' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-14', (SELECT id FROM Element WHERE name = 'Cámara Web Logitech Brio 4K' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-22', (SELECT id FROM Element WHERE name = 'Stream Deck Elgato MK.2 15 Teclas' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-27', (SELECT id FROM Element WHERE name = 'Alfombrilla XL Corsair MM300 PRO' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-03', (SELECT id FROM Element WHERE name = 'Bocinas de Escritorio Bose Companion 2' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-08', (SELECT id FROM Element WHERE name = 'Hub USB-C Satechi 9 en 1' LIMIT 1), 'Inserción'),

-- Sillas
('INSERT', NULL, '2026-01-11', (SELECT id FROM Element WHERE name = 'Silla ergonómica Herman Miller Aeron' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-01-17', (SELECT id FROM Element WHERE name = 'Silla Gamer Secretlab Titan EVO 2024' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-01-24', (SELECT id FROM Element WHERE name = 'Silla de Oficina Ejecutiva Malla Transpirable' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-01', (SELECT id FROM Element WHERE name = 'Silla Gamer Corsair T3 Rush' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-07', (SELECT id FROM Element WHERE name = 'Silla Ergonómica Autonomous ErgoChair Pro' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-13', (SELECT id FROM Element WHERE name = 'Silla Operativa Básica con Ruedas' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-19', (SELECT id FROM Element WHERE name = 'Silla Reclinable con Reposapiés para Gamer' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-02-25', (SELECT id FROM Element WHERE name = 'Sillón de Piel Sintética para Dirección' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-02', (SELECT id FROM Element WHERE name = 'Silla de Comedor Apilable Nórdica' LIMIT 1), 'Inserción'),
('INSERT', NULL, '2026-03-07', (SELECT id FROM Element WHERE name = 'Silla de Conferencia Fija Base Trineo' LIMIT 1), 'Inserción');
