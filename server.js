// Import Xpresser
const xpresser = require("xpresser");
// Import Configurations
const config = require('./configs/config');
// Start Xpresser
const $ = xpresser(config);
// Boot Server
$.boot();
