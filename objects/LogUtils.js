var DatabaseUtils = require('./DatabaseUtils');

class LogUtils {
    static logEnviromentData(logEntry, logManager) {
        if (logEntry.temp == null || logEntry.humidity == null) {
            return;
        }
        logManager.addEnviromentLog({ temp: logEntry.temperature, humidity: logEntry.humidity, time: Date.now() });
        return new Promise(function(resolve, reject) {
            DatabaseUtils.connect().
            then(function (db) {
                resolve(LogUtils.writeEnviromentLogToDB(db, logEntry));
            }).
            catch(function (err) {
                reject(err);
            });
        });
    }

    static writeEnviromentLogToDB(db, logEntry) {
        return db.run("INSERT INTO temp_log (temperature, humidity, timestamp) VALUES (?,?,?)", [ logEntry.temp, logEntry.humidity, logEntry.time ]);
    }
}

module.exports = LogUtils;