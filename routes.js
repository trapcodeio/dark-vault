const fs = require('fs');
const route = $.router;

route.path('/api', () => {

    route.path("folder", () => {
        route.post('@scan')
    }).controller('Folder');

    route.path("file", () => {
        route.post('@read')
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
