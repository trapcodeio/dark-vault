const fs = require('fs');
const route = $.router;

route.path("/folder", () => {
    route.all('@scan')
}).controller('Folder');

/**
 * Stop all routes if dist folder does not exists.
 */
if(!fs.existsSync($.path.base('dist'))){
    route.all('/*', 'Folder@distNotFound');
}
