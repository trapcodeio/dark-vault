// Import Xpresser
const xpresser = require("xpresser");
// Import Configurations
const config = require('./configs/config');
// Start Xpresser
const $ = xpresser(config);

/**
 * If Auth is enabled, add StartDb middleware to app.
 */
if ($.config.auth.enabled) {
    $.on.start(next => require("./backend/boot/LowDb")(next));
}


// Boot Server
$.boot();
