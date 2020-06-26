// Import env variables
const env = require('./env');

// Export App Configuration
module.exports = {
    /**
     * If Enabled your app will be auth protected.
     * All created users will have to login to access.
     */
    enabled: env['UseAuth']
};