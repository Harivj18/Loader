const express = require('express');
const router = express.Router();
const revenueController = require('../revenueController');
const logController = require('../logController');
const loader = require('../inboundLoader')

router.get('/revenue/total', revenueController.total);
router.get('/revenue/by-product', revenueController.byProduct);
router.get('/revenue/by-category', revenueController.byCategory);
router.get('/revenue/by-region', revenueController.byRegion);
router.post('/refresh', loader.loadCSV);
router.post('/loader', loader.loadCSV);
router.get('/refresh/logs', logController.refreshLogs);


module.exports = router;
