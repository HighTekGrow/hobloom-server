var Asset = require('../objects/Asset');
var Sensor = require('../objects/Sensor');
var SensorUtils = require('./SensorUtils');
var DatabaseUtils = require('./DatabaseUtils');
var Appliance = require('../objects/Appliance');

class AssetUtils {
    static getAllAssetsFromDB() {
        return new Promise(function(resolve, reject) {
            DatabaseUtils.connect().
            then(function (db) {
                resolve(AssetUtils.fetchAssets(db));
            }).
            catch(function (err) {
                reject(err);
            });
        });
    }

    static sortAssets(assets) {
        var all_assets = {
            sensors: [],
            appliances: []
        };
        for (var i = 0; i < assets.length; i++) {
            assets[i] = new Asset(assets[i]);
            if (SensorUtils.isSensor(assets[i].getType())) {
                all_assets.sensors.push(new Sensor(assets[i]));
                continue;
            }
            all_assets.appliances.push(new Appliance(assets[i]));
        }
        return all_assets;
    }

    static fetchAssets(db) {
        return new Promise(function(resolve, reject) {
            db.all("SELECT id, name, type, pin FROM assets WHERE deleted = 0;", function(err, rows) {
                db.close();
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    static getAssetById(id, applianceManager, sensorManager) {
        if (!applianceManager.getApplianceById(id)) {
            return sensorManager.getSensorById(id);
        }
        return applianceManager.getApplianceById(id);
    }

    static createAsset(asset, sensorManager, applianceManager) {
        return new Promise(function(resolve, reject) {
            DatabaseUtils.connect().
            then(function (db) {
                return AssetUtils.insertAssetInDB(db, asset);
            }).
            then(function (asset) {
                resolve(AssetUtils.addAssetToManager(asset, sensorManager, applianceManager));
            }).
            catch(function (err) {
                reject(err);
            });
        });
    }

    static insertAssetInDB(db, asset) {
        return new Promise(function(resolve, reject) {
            db.run("INSERT INTO assets (name, type, pin) VALUES (?,?,?)", [ asset.getName(), asset.getType(), asset.getPin() ], function(err) {
                db.close();
                if (err) {
                    reject(err);
                }
                asset.id = this.lastID;
                resolve(asset);
            });
        });

    }

    static addAssetToManager(asset, sensorManager, applianceManager) {
        if (SensorUtils.isSensor(asset.getType())) {
            return sensorManager.addSensor(new Sensor(asset));
        }
        return applianceManager.addAppliance(new Appliance(asset));
    }

    static deleteAsset(id, sensorManager, applianceManager) {
        return new Promise(function(resolve, reject) {
            AssetUtils.setDeletedFlagInDB(id).
            then(function () {
                AssetUtils.removeAssetFromManager(id, sensorManager, applianceManager);
                resolve();
            }).
            catch(function (err) {
                reject(err);
            });
        });
    }

    static removeAssetFromManager(id, sensorManager, applianceManager) {
        if (sensorManager.getSensorById(id)) {
            return sensorManager.removeSensorById(id);
        }
        return applianceManager.removeApplianceById(id);
    }

    static setDeletedFlagInDB(id) {
        return new Promise(function(resolve, reject) {
            DatabaseUtils.connect().
            then(function (db) {
                db.run("UPDATE assets SET deleted = 1 WHERE id = ?", [ id ], function(err) {
                    if (err) {
                        return reject(err);
                    }
                    db.close();
                    resolve();
                });
            });
        });
    }
}

module.exports = AssetUtils;