const fs = require("fs");
const path = require("path");
const base64Img = require('base64-img');

/**
 * FileController
 * @class
 * @extends $.controller
 */
class FileController extends $.controller {

    /**
     * middleware - Set Middleware
     * @returns {Object}
     */
    static middleware() {
        return {}
    }

    static read(x) {
        const encodedPath = x.get("file", null);
        const decodedPath = $.base64.decode(encodedPath);
        const exists = fs.existsSync(decodedPath);
        const directory = path.dirname(decodedPath);
        const fileName = path.basename(decodedPath);
        const ext = path.extname(fileName);
        let type = 'file';


        const Images = [
            '.png',
            '.jpg',
            '.svg',
            '.gif'
        ];

        if (Images.includes(ext)) type = 'image';

        let content = 'Cannot read this content';

        if (exists && fs.lstatSync(decodedPath).isFile()) {
            if (type === 'image') {
                content = base64Img.base64Sync(decodedPath);
            } else {
                content = fs.readFileSync(decodedPath).toString()
            }
        }

        return x.toApi({
            type,
            exists,
            fullPath: decodedPath,
            fileName,
            ext,
            encodedPath,
            directory,
            encodedDirectory: $.base64.encode(directory),
            content
        });
    }

    /**
     * Scan Path
     * @param {XpresserHttp.Engine} x
     * @returns {any}
     */
    static move(x) {
        const neededData = ['file', 'folder'];
        if (!x.body().exists(neededData)) {
            return x.toApiFalse({});
        }

        let {file, folder} = x.body().pick(neededData);
        file = $.base64.decode(file);
        folder = $.base64.decode(folder);

        if (fs.existsSync(file) && fs.existsSync(folder)) {
            const fileName = path.basename(file);
            const fileDestination = path.resolve(folder, fileName);

            fs.copyFileSync(file, fileDestination);
            fs.unlinkSync(file);

        }
        // console.log([file, folder]);

        return x.toApi({moved: true});
    }
}


module.exports = FileController;
