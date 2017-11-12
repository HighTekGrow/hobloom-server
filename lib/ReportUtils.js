var DatabaseUtils = require('./DatabaseUtils');

class ReportUtils {
    static getEnviromentReport() {
        return new Promise(function(resolve, reject) {
            DatabaseUtils.connect().
            then(ReportUtils.getEnviromentDataFromDB).
            then(ReportUtils.transformEnviromentReportData).
            then(function (data){
                resolve(data);
            }).
            catch(function (err) {
                reject(err);
            });
        });
    }

    static transformEnviromentReportData(data) {
        return new Promise(function(resolve, reject) {
            if (typeof data == 'undefined' || !data.length) {
                reject('Undefined enviroment data passed to sortEnviromentData method');
            }
            var result = {
                humidity: [],
                temp: []
            };
            data.forEach(function (doc) {
                result.humidity.push(doc.humidity);
                result.temp.push(doc.temperature);
            });
            resolve(result);
        });
    }

    static getEnviromentDataFromDB(db) {
        return new Promise(function(resolve, reject) {
            db.all("SELECT * FROM temp_log ORDER BY timestamp DESC LIMIT 10;", function(err, rows) {
                db.close();
                if (err) {
                    return reject(err);
                }
                resolve(rows.reverse());
            });
        });
    }
}

module.exports = ReportUtils;