const fs = require("fs");
const path = require("path");
const slash = require("slash");


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

            files.push({
                name: file,
                fullPath,
                isDir: fs.lstatSync(fullPath).isDirectory()
            });
        }
        return x.toApi({files, folder});
    }
}


module.exports = FolderController;
