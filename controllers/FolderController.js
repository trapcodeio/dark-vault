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

    static scan(x) {
        // eslint-disable-next-line no-undef
        let hasFolderPath = x.get("folder", false);
        let folder = $.path.base();

        if (hasFolderPath !== false) {
            folder = hasFolderPath;
            hasFolderPath = true;
        }


        // Resolve folder to match os paths
        folder = path.resolve(slash(folder));


        if (!fs.existsSync(folder)) {
            return x.toApiFalse(`Folder does not exists: {${folder}}`)
        }

        const folderFiles = fs.readdirSync(folder);

        let files = [];
        for (let i = 0; i < folderFiles.length; i++) {
            const file = folderFiles[i];
            const fullPath = slash(path.resolve(hasFolderPath ? (folder + '/' + file) : $.path.base(file)));
            const encodedPath = $.base64.encode(fullPath);

            files.push({
                name: file,
                fullPath,
                encodedPath,
                isDir: fs.lstatSync(fullPath).isDirectory()
            });
        }
        return x.toApi({files, folder});
    }

    distNotFound(x) {
        const msg = "Dist folder not found! Run 'yarn build' to build your files then restart server.";
        x.res.status(404);

        if (x.req.xhr) {
            return x.toApiFalse({
                msg
            });
        } else {
            return x.res.send(msg);
        }

    }
}


module.exports = FolderController;
