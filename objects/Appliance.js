var bs = require('bonescript');
var Asset = require('./Asset');
var util = require('util');

function Appliance(data) {
    Asset.apply(this, arguments);
    this.running = false;
    this.lastPowerChange = null;
    if (typeof data.running != 'undefined') {
        this.running = data.running;
    }
}

util.inherits(Appliance, Asset);

Appliance.prototype.turnOn = function () {
    this.running = true;
    this.lastPowerChange = new Date();
    bs.digitalWrite(this.pin, bs.LOW);
};

Appliance.prototype.turnOff = function () {
    this.running = false;
    this.lastPowerChange = new Date();
    bs.digitalWrite(this.pin, bs.HIGH);
};

Appliance.prototype.isRunning = function () {
    return this.running === true;
};

Appliance.prototype.getLastPowerChange = function () {
    return this.lastPowerChange;
};

module.exports = Appliance;