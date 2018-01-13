var Promise = require('bluebird');
var sqlite3 = require("sqlite3").verbose();
var config = require('../config/default.json');

class DatabaseUtils {
    static connect() {
        return new Promise(function(resolve, reject) {
            resolve(new sqlite3.Database(config.database));
        });
    }
}

module.exports = DatabaseUtils;