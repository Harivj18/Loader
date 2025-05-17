const logInfo = (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`);
const logError = (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`);

module.exports = { logInfo, logError };
