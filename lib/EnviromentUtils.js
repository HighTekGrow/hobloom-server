class EnviromentUtils {
    static getAverageReadingFromSensors(sensorManager) {
        var readings = [];
        var enviromentSensors = sensorManager.getTempAndHumiditySensors();
        for (var i = 0; i < enviromentSensors.length; i++) {
            var enviromentReading = enviromentSensors[i].read();
            if (this.isEnviromentReadingValid(enviromentReading)) {
                readings.push(enviromentReading);
                sensorManager.sensors[i].last_reading = enviromentReading;
                sensorManager.sensors[i].last_reading_time = new Date();
            }
        }
        if (readings.length) {
            return this.getAverageFromReadings(readings);
        }
        return false;
    }

    static isEnviromentReadingValid(reading) {
        return (typeof reading != 'undefined') && (typeof reading.temp != 'undefined') && typeof (reading.humidity != 'undefined');
    }

    static getAverageFromReadings(readings) {
        var temp = 0;
        var humidity = 0;
        for (var x = 0; x < readings.length; x++) {
            temp += readings[x].temp;
            humidity += readings[x].humidity;
        }
        return { temperature:  Math.floor(temp / readings.length), humidity: Math.floor(humidity / readings.length) };
    }
}

module.exports = EnviromentUtils;