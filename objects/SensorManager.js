var EnviromentSensor = require('./EnviromentSensor');

function SensorManager(sensors) {
    this.sensors = sensors;
}

SensorManager.prototype.getSensors = function () {
    return this.sensors;
};

SensorManager.prototype.addSensor = function (sensor) {
    this.sensors.push(sensor);
};

SensorManager.prototype.getTempAndHumiditySensors = function () {
    var all_dht = [];
    for (var i = 0; i < this.sensors.length; i++) {
        if (this.sensors[i].getType() === 'dht11' || this.sensors[i].getType() === 'dht22') {
            all_dht.push(new EnviromentSensor(this.sensors[i]));
        }
    }
    return all_dht;
};

SensorManager.prototype.getSensorById = function (id) {
    for (var i = 0; i < this.sensors.length; i++) {
        if (this.sensors[i].getId === id) {
            return this.sensors[i];
        }
    }
    return false;
};

SensorManager.prototype.removeSensorById = function (id) {
    for (var i = 0; i < this.sensors.length; i++) {
        if (this.sensors[i].getId === id) {
            return this.sensors.splice(i, 1);
        }
    }
    return false;
};

module.exports = SensorManager;