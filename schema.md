Customers :

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  customer_id VARCHAR UNIQUE,
  name VARCHAR,
  email VARCHAR,
  address TEXT
);

Products :
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR UNIQUE,
  name VARCHAR,
  category VARCHAR
);

Orders :

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR UNIQUE,
  customer_id INT REFERENCES customers(id),
  region VARCHAR,
  date_of_sale DATE,
  payment_method VARCHAR
);

Order Items :

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT,
  unit_price NUMERIC(10,2),
  discount NUMERIC(5,2),
  shipping_cost NUMERIC(10,2)
);

Refresh Logs :

CREATE TABLE refresh_logs (
  id SERIAL PRIMARY KEY,
  refresh_time TIMESTAMP DEFAULT NOW(),
  status VARCHAR,  -- 'SUCCESS' | 'FAILURE'
  message TEXT
);
