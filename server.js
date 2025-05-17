const express = require('express');
const app = express();
const routes = require('./src/controllers/routes/routes');
const cron = require('node-cron');
const axios = require('axios')
const { logInfo, logError } = require('./src/utils/logger');

require('dotenv').config();

app.use(express.json());
app.use('/api', routes);


// Schedule job to run at midnight every day (00:00)
cron.schedule('0 0 * * *', async () => {
  logInfo('[CRON] Scheduled refresh started');
  
  try {
    const res = await axios.post('http://localhost:3000/api/refresh');
    logInfo(`[CRON] Refresh complete: ${res.data.message || 'OK'}`);
  } catch (err) {
    logError('[CRON] Refresh job failed: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logInfo(`Server running on port ${PORT}`);
});
