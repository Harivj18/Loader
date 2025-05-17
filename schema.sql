-- Drop tables if they exist 
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS refresh_logs CASCADE;

-- Customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100)
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    region VARCHAR(100),
    date_of_sale DATE,
    payment_method VARCHAR(50)
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER CHECK (quantity >= 0),
    unit_price NUMERIC(10, 2) CHECK (unit_price >= 0),
    discount NUMERIC(4, 2) CHECK (discount >= 0 AND discount <= 1),
    shipping_cost NUMERIC(10, 2) CHECK (shipping_cost >= 0)
);

-- Refresh logs table
CREATE TABLE refresh_logs (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL, 
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
