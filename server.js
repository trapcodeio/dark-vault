require('dotenv').config();
const xpresser = require("xpresser");

const env = process.env;
xpresser({
    server: {
        port: env.APP_PORT
    },
    paths: {
        base: __dirname,
        backend: "base://",
        public: "dist"
    },
    response: {
        cacheFiles: true
    }
});

// Boot Server
$.boot();
