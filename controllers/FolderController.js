const fs = require("fs");
const path = require("path");
const slash = require("slash");


const DistFolder = $.path.base('dist');
const HasDistFolder = fs.existsSync(DistFolder);


/**
 * FolderController
 * @class
 * @extends $.controller
 */
class FolderController extends $.controller {

    /**
     * middleware - Set Middleware
     * @returns {Object}
     */
    static middleware() {
        return {}
    }

    index({res}) {
        if (!HasDistFolder) {
            return res.send("Dist Folder Not Found!");
        } else {
            return res.sendFile(DistFolder + '/index.html')
        }
    }

    /**
     * Scan Path
     * @param {Xpresser.Http} http
     * @returns {any}
     */
    static scan(http) {
        // eslint-disable-next-line no-undef
        let hasFolderPath = http.body("folder", false);
        let folder = $.path.base();

        if (hasFolderPath !== false) {
            folder = hasFolderPath;
            hasFolderPath = true;
        }

        // Resolve folder to match os paths
        folder = path.resolve(slash(folder));


        if (!fs.existsSync(folder)) {
            return http.toApiFalse({msg: `Folder does not exists: {${folder}}`})
        }

        const folderFiles = fs.readdirSync(folder);

        let files = [];
        if (folderFiles.length) {
            const baseFolder = path.dirname(folder);
            files.push({
                name: '..',
                fullPath: baseFolder,
                encodedPath: $.base64.encode(baseFolder),
                isDir: true
            });
        }

        for (let i = 0; i < folderFiles.length; i++) {
            const file = folderFiles[i];
            const fullPath = slash(path.resolve(hasFolderPath ? (folder + '/' + file) : $.path.base(file)));
            const encodedPath = $.base64.encode(fullPath);
            const dots = file.split('.');
            let ext = dots[dots.length-1];
            if(ext) ext = ext.toLowerCase();



            files.push({
                name: file,
                ext,
                fullPath,
                encodedPath,
                isDir: fs.lstatSync(fullPath).isDirectory()
            });
        }
        return http.toApi({files, folder});
    }

    /**
     * DistNotFound
     * @param {Xpresser.Http} http
     * @returns {any}
     */
    distNotFound(http) {
        const msg = "Dist folder not found! Run 'yarn build' to build your files then restart server.";
        http.res.status(404);

        if (http.req.xhr) {
            return http.toApiFalse({
                msg
            });
        } else {
            return http.res.send(msg);
        }

    }
}


module.exports = FolderController;
