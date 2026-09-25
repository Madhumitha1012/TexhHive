CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    company_name VARCHAR(200),
    email VARCHAR(200) NOT NULL UNIQUE,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    address VARCHAR(300),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(120) NOT NULL,
    material VARCHAR(150),
    product_type VARCHAR(120),
    price DECIMAL(12,2),
    unit VARCHAR(30),
    moq DECIMAL(12,2),
    available_qty DECIMAL(12,2),
    location VARCHAR(150),
    color VARCHAR(80),
    gsm VARCHAR(50),
    width VARCHAR(80),
    weave VARCHAR(120),
    finish VARCHAR(120),
    description TEXT,
    image LONGTEXT,
    supplier_id VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rfqs (
    id VARCHAR(100) PRIMARY KEY,
    buyer_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    supplier_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(200),
    quantity DECIMAL(12,2),
    unit VARCHAR(30),
    required_delivery_date DATE,
    delivery_location VARCHAR(200),
    requirements TEXT,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotations (
    id VARCHAR(100) PRIMARY KEY,
    rfq_id VARCHAR(100) NOT NULL,
    buyer_id VARCHAR(100) NOT NULL,
    supplier_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(200),
    quantity DECIMAL(12,2),
    unit VARCHAR(30),
    unit_price DECIMAL(12,2),
    moq DECIMAL(12,2),
    delivery_days INT,
    payment_terms VARCHAR(300),
    total_price DECIMAL(14,2),
    status VARCHAR(30) DEFAULT 'SENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    buyer_id VARCHAR(100) NOT NULL,
    buyer_name VARCHAR(150),
    buyer_company VARCHAR(200),
    buyer_phone VARCHAR(50),
    supplier_id VARCHAR(100) NOT NULL,
    supplier_name VARCHAR(150),
    supplier_company VARCHAR(200),
    supplier_location VARCHAR(200),
    quotation_id VARCHAR(100),
    product_id VARCHAR(100),
    product_name VARCHAR(200),
    category VARCHAR(120),
    quantity DECIMAL(12,2),
    unit VARCHAR(30),
    moq DECIMAL(12,2),
    unit_price DECIMAL(12,2),
    total_amount DECIMAL(14,2),
    delivery_days INT,
    payment_terms VARCHAR(300),
    required_delivery_date DATE,
    delivery_location VARCHAR(200),
    expected_date DATE,
    status VARCHAR(30) DEFAULT 'CONFIRMED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(100) PRIMARY KEY,
    buyer_id VARCHAR(100) NOT NULL,
    order_id VARCHAR(100),
    amount DECIMAL(14,2),
    method VARCHAR(80),
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
