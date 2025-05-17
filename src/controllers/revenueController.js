const db = require('./connection');
const { logInfo, logError } = require('../utils/logger');



const total = async (req, res) => {
    const { start, end } = req.query;
    const result = await db.query(`
      SELECT 
        SUM((unit_price * quantity) * (1 - discount) + shipping_cost) AS total_revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE date_of_sale BETWEEN $1 AND $2`, [start, end]);

    res.json({ total_revenue: result.rows[0].total_revenue });
};



const byProduct = async (req, res) => {
    const { start, end } = req.query;

    try {
        const result = await db.query(
            `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.date_of_sale BETWEEN $1 AND $2
      GROUP BY p.id, p.name
      ORDER BY total_revenue DESC;
      `,
            [start, end]
        );

        res.json(result.rows);
    } catch (error) {
        logError(`Error in byProduct: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const byCategory = async (req, res) => {
    const { start, end } = req.query;

    try {
        const result = await db.query(
            `
      SELECT 
        p.category,
        SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.date_of_sale BETWEEN $1 AND $2
      GROUP BY p.category
      ORDER BY total_revenue DESC;
      `,
            [start, end]
        );

        res.json(result.rows);
    } catch (error) {
        logError(`Error in byCategory: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const byRegion = async (req, res) => {
    const { start, end } = req.query;

    try {
        const result = await db.query(
            `
      SELECT 
        o.region,
        SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.date_of_sale BETWEEN $1 AND $2
      GROUP BY o.region
      ORDER BY total_revenue DESC;
      `,
            [start, end]
        );

        res.json(result.rows);
    } catch (error) {
        logError(`Error in byRegion: ${error}`);

        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { total, byCategory, byProduct, byRegion };