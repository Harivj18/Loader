const fs = require('fs');
const csv = require('fast-csv');
const { Pool } = require('pg');
const pool = new Pool();
require('dotenv').config();
const { logInfo, logError } = require('../utils/logger');


const loadCSV = async (req, res) => {
  let filePath = process.env.filePath
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const customers = new Map();
    const products = new Map();
    const orders = new Map();

    const stream = fs.createReadStream(filePath).pipe(csv.parse({ headers: true }));

    for await (const row of stream) {
      if (!customers.has(row['Customer ID'])) {
        await client.query(`
          INSERT INTO customers (customer_id, name, email, address)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (customer_id) DO NOTHING`,
          [row['Customer ID'], row['Customer Name'], row['Customer Email'], row['Customer Address']]
        );
        customers.set(row['Customer ID'], true);
      }

      if (!products.has(row['Product ID'])) {
        await client.query(`
          INSERT INTO products (product_id, name, category)
          VALUES ($1, $2, $3)
          ON CONFLICT (product_id) DO NOTHING`,
          [row['Product ID'], row['Product Name'], row['Category']]
        );
        products.set(row['Product ID'], true);
      }

      if (!orders.has(row['Order ID'])) {
        const res = await client.query(`SELECT id FROM customers WHERE customer_id = $1`, [row['Customer ID']]);
        const customerDbId = res.rows[0].id;
        await client.query(`
          INSERT INTO orders (order_id, customer_id, region, date_of_sale, payment_method)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (order_id) DO NOTHING`,
          [row['Order ID'], customerDbId, row['Region'], row['Date of Sale'], row['Payment Method']]
        );
        orders.set(row['Order ID'], true);
      }

      const prodRes = await client.query(`SELECT id FROM products WHERE product_id = $1`, [row['Product ID']]);
      const orderRes = await client.query(`SELECT id FROM orders WHERE order_id = $1`, [row['Order ID']]);
      const productDbId = prodRes.rows[0].id;
      const orderDbId = orderRes.rows[0].id;

      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, discount, shipping_cost)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderDbId, productDbId, row['Quantity Sold'],
          row['Unit Price'], row['Discount'], row['Shipping Cost']
        ]
      );
    }

    await client.query(`INSERT INTO refresh_logs (status, message) VALUES ('SUCCESS', 'Loaded CSV successfully')`);
    await client.query('COMMIT');

    res.send('Data Loading Successfully completed');
  } catch (err) {
    await client.query('ROLLBACK');
    await client.query(`INSERT INTO refresh_logs (status, message) VALUES ('FAILURE', $1)`, [err.message]);
    logError(`loader failed: ${err}`);
    res.send('Unable to load data, execution got failed')
  } finally {
    client.release();
  }
}


module.exports = {loadCSV}