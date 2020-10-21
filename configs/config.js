// Import Path
const path = require('path');
// Import Env configuration
const env = require('./env');
// Import Auth Config
const auth = require('./auth.config');

// Export configurations
module.exports = {
    env: env['NODE_ENV'],
    server: {
        port: env['APP_PORT']
    },

    paths: {
        base: path.resolve(__dirname + '/../'),
        backend: "base://backend",
        public: "dist"
    },

    response: {
        cacheFiles: true
    },

    // Add auth config
    auth
}