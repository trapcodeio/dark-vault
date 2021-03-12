// Import Xpresser
const xpresser = require('xpresser');
// Import Configurations
const config = require('./configs/config');
// Start Xpresser
const $ = xpresser.init(config, {exposeDollarSign: false});

/**
 * If Auth is enabled, add StartDb middleware to app.
 */
if ($.config.get('auth.enabled')) {
  $.on.start((...args) => require('./backend/boot/LowDb')(...args));
}

// Boot Server
$.boot();
