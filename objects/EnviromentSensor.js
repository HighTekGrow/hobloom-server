var util = require('util');
var Sensor = require('./Sensor');
var dht = require('beaglebone-dht');

function EnviromentSensor(data) {
    Sensor.apply(this, arguments);
    dht.sensor(this.getType().toUpperCase());
}

util.inherits(EnviromentSensor, Sensor);

EnviromentSensor.prototype.read = function () {
    var dht_data = null;
    var tries = 0;
    var max_tries = 15;
    while (dht_data == null && tries <= max_tries) {
        dht_data = dht.read(this.pin);
        if (typeof dht_data !== 'undefined' && dht_data.humidity < 120) {
            dht_data.humidity = Math.floor(dht_data.humidity);
            dht_data.temp = Math.floor(dht_data.fahrenheit);
            return dht_data;
        } else {
            tries++;
        }
    }
};

module.exports = EnviromentSensor;