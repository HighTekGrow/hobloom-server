function Setting(key, value) {
    this.key = key;
    this.value = value;
}

Setting.prototype.getKey = function () {
    return this.key;
};

Setting.prototype.getValue = function () {
    return this.value;
};

module.exports = Setting;