const xpresser = require("xpresser");

xpresser({
    server: {
      port: 7777
    },
    paths: {
        base: __dirname,
        backend: "base://",
        public: "dist"
    }
});