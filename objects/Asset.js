function Asset(data) {
    this.id = data.id;
    this.type = data.type;
    this.pin = data.pin;
    this.name = data.name;
}

Asset.prototype.getId = function () {
    return parseInt(this.id);
};

Asset.prototype.getType = function () {
    return this.type;
};

Asset.prototype.getPin = function () {
    return this.pin;
};

Asset.prototype.getName = function () {
    return this.name;
};


module.exports = Asset;