const fs = require("fs");
const path = require("path");

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
    static middleware(){
        return {}
    }

    read(x) {
        const encodedPath = x.get("file", null);
        const decodedPath = $.base64.decode(encodedPath);
        const exists = fs.existsSync(decodedPath);

        let content = null;
        if(exists && fs.lstatSync(decodedPath).isFile()){
            content = fs.readFileSync(decodedPath).toString()
        }

        return x.toApi({
            exists,
            fullPath: decodedPath,
            encodedPath,
            content
        });
    }

}


module.exports = FileController;
