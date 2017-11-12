var TimeUtils = require('../lib/TimeUtils');
var SettingUtils = require('../lib/SettingUtils');

function SettingsManager(settings) {
    this.settings = settings;
}

SettingsManager.prototype.getSettings = function () {
    return this.settings;
};

SettingsManager.prototype.getMinHumidity = function () {
    return parseInt(SettingUtils.getSettingValueByKey('MIN_HUMIDITY', this.settings));
};

SettingsManager.prototype.getMaxHumidity = function () {
    return parseInt(SettingUtils.getSettingValueByKey('MAX_HUMIDITY', this.settings));
};

SettingsManager.prototype.getMinHeat = function () {
    return parseInt(SettingUtils.getSettingValueByKey('MIN_HEAT', this.settings));
};

SettingsManager.prototype.getMaxHeat = function () {
    return parseInt(SettingUtils.getSettingValueByKey('MAX_HEAT', this.settings));
};

SettingsManager.prototype.getControlHeat = function () {
    return SettingUtils.getSettingValueByKey('CONTROL_HEAT', this.settings);
};

SettingsManager.prototype.getControlHumidity = function () {
    return SettingUtils.getSettingValueByKey('CONTROL_HUMIDITY', this.settings);
};

SettingsManager.prototype.getDayStart = function () {
    return TimeUtils.translateTimeSetting(SettingUtils.getSettingValueByKey('START_DAY', this.settings));
};

SettingsManager.prototype.getDayEnd = function () {
    return TimeUtils.translateTimeSetting(SettingUtils.getSettingValueByKey('END_DAY', this.settings));
};

module.exports = SettingsManager;