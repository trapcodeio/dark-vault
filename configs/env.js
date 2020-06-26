const envLoader = require('@xpresser/env');
const envFile = __dirname + '/../.env';
const env = envLoader(envFile, {
    castBooleans: true,
    required: [
        'NODE_ENV',

        'APP_DOMAIN',
        'APP_PORT',
        'APP_PROTOCOL',

        'VUE_APP_SERVER_URL'
    ]
});

module.exports = env;
