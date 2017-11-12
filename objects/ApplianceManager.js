var _ = require('underscore');
var Appliance = require('./Appliance');

function ApplianceManager(appliances) {
    this.appliances = appliances;
}

ApplianceManager.prototype.getAppliances = function () {
    return this.appliances;
};

ApplianceManager.prototype.addAppliance = function (appliance) {
    this.appliances.push(appliance);
};

ApplianceManager.prototype.getHumidifier = function () {
    var appliance = _.find(this.appliances, function (appliance) {
        return appliance.getType() === 'humidifier';
    });
    if (typeof appliance != 'undefined') {
        return new Appliance(appliance);
    }
    return null;
};

ApplianceManager.prototype.getDehumidifier = function () {
    var appliance = _.find(this.appliances, function (appliance) {
        return appliance.getType() === 'dehumidifier';
    });
    if (typeof appliance != 'undefined') {
        return new Appliance(appliance);
    }
    return null;
};

ApplianceManager.prototype.getExhaust = function () {
    var appliance = _.find(this.appliances, function (appliance) {
        return appliance.getType() === 'exhaust';
    });
    if (typeof appliance != 'undefined') {
        return new Appliance(appliance);
    }
    return null;
};

ApplianceManager.prototype.getAC = function () {
    var appliance = _.find(this.appliances, function (appliance) {
        return appliance.getType() === 'ac';
    });
    if (typeof appliance != 'undefined') {
        return new Appliance(appliance);
    }
    return null;
};

ApplianceManager.prototype.getHeater = function () {
    var appliance = _.find(this.appliances, function (appliance) {
        return appliance.getType() === 'heater';
    });
    if (typeof appliance != 'undefined') {
        return new Appliance(appliance);
    }
    return null;
};

ApplianceManager.prototype.getLights = function () {
    var lights = [];
    for (var i = 0; i < this.appliances.length; i++) {
        if (this.appliances[i].getType() === 'light') {
            lights.push(this.appliances[i]);
        }
    }
    return lights;
};

ApplianceManager.prototype.getFarRedLights = function () {
    var lights = [];
    for (var i = 0; i < this.appliances.length; i++) {
        if (this.appliances[i].getType() === 'far_red_light') {
            lights.push(this.appliances[i]);
        }
    }
    return lights;
};

ApplianceManager.prototype.getApplianceById = function (id) {
    for (var i = 0; i < this.appliances.length; i++) {
        if (this.appliances[i].getId() === id) {
            return this.appliances[i];
        }
    }
    return false;
};

ApplianceManager.prototype.removeApplianceById = function (id) {
    for (var i = 0; i < this.appliances.length; i++) {
        if (this.appliances[i].getId() === id) {
            return this.appliances.splice(i, 1);
        }
    }
    return false;
};

ApplianceManager.prototype.flipAppliancePower = function (appliance) {
    if (appliance.isRunning()) {
        appliance.turnOff();
    } else {
        appliance.turnOn();
    }
    this.updateAppliance(appliance);
};

ApplianceManager.prototype.updateAppliance = function (appliance) {
    for (var i = 0; i < this.appliances.length; i++) {
        if (this.appliances[i].getId() === appliance.getId()) {
            return this.appliances[i] = appliance;
        }
    }
    return false;
};

module.exports = ApplianceManager;