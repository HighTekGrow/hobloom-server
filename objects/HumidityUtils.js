class HumidityUtils {
    static humidityAboveRange(humidity, settingsManager) {
        return humidity > settingsManager.getMaxHumidity();
    }

    static humidityBelowRange(humidity, settingsManager) {
        return humidity < this.getHumidifierOnTemp(settingsManager);
    }

    static getHumidifierOnTemp(settingsManger) {
        return Math.ceil(settingsManger.getMinHumidity() + ((settingsManger.getMaxHumidity() - settingsManger.getMinHumidity()) / 5));
    }


    static handleHumidityReading(humidity, settingsManager, applianceManager) {
        if (!settingsManager.getControlHumidity()) {
            return;
        }
        if (this.humidityAboveRange(humidity, settingsManager)) {
            if (applianceManager.getHumidifier() != null && applianceManager.getHumidifier().isRunning()) {
                applianceManager.flipAppliancePower(applianceManager.getHumidifier());
            }
            if (applianceManager.getDehumidifier() != null && !applianceManager.getDehumidifier().isRunning()) {
                applianceManager.flipAppliancePower(applianceManager.getDehumidifier());
            }
            if (applianceManager.getExhaust() != null && !applianceManager.getExhaust().isRunning()) {
                applianceManager.flipAppliancePower(applianceManager.getExhaust());
            }
            return;
        }
        if (this.humidityBelowRange(humidity, settingsManager)) {
            if (applianceManager.getHumidifier() != null && !applianceManager.getHumidifier().isRunning()) {
                applianceManager.flipAppliancePower(applianceManager.getHumidifier());
            }
            if (applianceManager.getExhaust() != null && applianceManager.getExhaust().isRunning()) {
                applianceManager.flipAppliancePower(applianceManager.getExhaust());
            }
            if (applianceManager.getDehumidifier() != null && applianceManager.getDehumidifier().isRunning()) {
                applianceManager.flipAppliancePower(applianceManager.getDehumidifier());
            }
            return;
        }
        if (applianceManager.getHumidifier() != null && applianceManager.getHumidifier().isRunning()) {
            applianceManager.flipAppliancePower(applianceManager.getHumidifier());
        }
        if (applianceManager.getExhaust() != null && applianceManager.getExhaust().isRunning()) {
            applianceManager.flipAppliancePower(applianceManager.getExhaust());
        }
        if (applianceManager.getDehumidifier() != null && applianceManager.getDehumidifier().isRunning()) {
            applianceManager.flipAppliancePower(applianceManager.getDehumidifier());
        }
    }
}

module.exports = HumidityUtils;