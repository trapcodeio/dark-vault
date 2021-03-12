const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const Path = require("xpresser/dist/src/Helpers/Path");


/**
 * LowDb and all database initialization file.
 * @param next
 * @param $
 * @return {*}
 */
module.exports = (next, $) => {
    // Path to database file.
    const databaseFile = $.path.storage('database/db.json');

    // Create storage path if it does not exists.
    Path.makeDirIfNotExist(databaseFile, true);

    // Initialise LowDb
    const adapter = new FileSync(databaseFile);

    // Add db to xpresser global dollar sign
    $.db = low(adapter);

    // Set Database defaults
    $.db.defaults({
        users: []
    }).write();

    // Continue server boot
    return next()
}