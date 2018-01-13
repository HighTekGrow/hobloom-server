var DatabaseUtils = require('./DatabaseUtils');
var Setting = require('../objects/Setting');

class SettingUtils {
    static getAllSettings() {
        return new Promise(function(resolve, reject) {
            DatabaseUtils.connect().
            then(function (db) {
                db.all('SELECT key, value FROM settings', function (err, rows) {
                    db.close();
                    if (typeof rows === 'undefined' || !rows.length) {
                        err = 'No settings please run setup script';
                    }
                    if (err) {
                        return reject(err);
                    }
                    resolve(SettingUtils.transformSettings(rows));
                });
            }).
            catch(function (err) {
                reject(err);
            });
        });
    }

    static transformSettings(settings) {
        var all_settings = [];
        for (var i = 0; i < settings.length; i++) {
            all_settings.push(new Setting(settings[i].key, settings[i].value));
        }
        return all_settings;
    }

    static getSettingValueByKey(key, settings) {
        for (var i = 0; i < settings.length; i++) {
            if (settings[i].getKey() === key) {
                return settings[i].value;
            }
        }
    }

    static updateSettings(settings) {
        return new Promise(function(resolve, reject) {
            DatabaseUtils.connect().
            then(function (db) {
                var stmt = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
                for (var i = 0; i < settings.length; i++) {
                    stmt.run([ String(settings[i].value), settings[i].key ]);
                }
                stmt.finalize();
                db.close();
            }).
            then(function () {
                resolve(SettingUtils.getAllSettings());
            }).
            catch(function (err) {
                reject(err);
            });
        });
    }
}

module.exports = SettingUtils;