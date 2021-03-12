const fs = require('fs');
const {getInstance} = require('xpresser');
const $ = getInstance()
const route = $.router;


route.path('/api', () => {

    // @routes => /api/data/*
    route.path("data", () => {

        route.get('@config');

    }).controller('Data');

    // @routes => /api/folder/*
    route.path("folder", () => {
        route.post('@scan');
    }).controller('Folder');

    // @routes => /api/file/*
    route.path("file", () => {

        route.post('@read');
        route.post('@move');

    }).controller('File');

});


/**
 * Stop all routes if dist folder does not exists.
 */
if (!fs.existsSync($.path.base('dist'))) {
    route.all('/*', 'Folder@distNotFound');
} else {
    route.all('/*', 'Folder@index');
}
