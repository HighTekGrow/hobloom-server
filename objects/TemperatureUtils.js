class TemperatureUtils {
    static heatAboveRange(temperature, settingsManager) {
        return temperature > settingsManager.getMaxHeat();
    }

    static heatBelowRange(temperature, settingsManager) {
        return temperature < this.getHeaterOnTemp(settingsManager);
    }

    static getHeaterOnTemp(settingsManager) {
        return Math.ceil(settingsManager.getMinHeat() + ((settingsManager.getMaxHeat() - settingsManager.getMinHeat()) / 5));
    }


    static handleTemperatureCheck(temperature, settingsManager, applianceManager) {
        if (!settingsManager.getControlHeat()) {
            return;
        }
        if (this.heatAboveRange(temperature, settingsManager)) {
            if (applianceManager.getHeater() != null && applianceManager.getHeater().isRunning()) {
                applianceManager.flipAppliancePower(applianceManager.getHeater());
            }
            if (applianceManager.getAC() != null && !applianceManager.getAC().isRunning()) {
                applianceManager.flipAppliancePower(applianceManager.getAC());
            }
            return;
        }
        if (this.heatBelowRange(temperature, settingsManager)) {
            if (applianceManager.getHeater() != null && !applianceManager.getHeater().isRunning()) {
                applianceManager.flipAppliancePower(applianceManager.getHeater());
            }
            if (applianceManager.getAC() != null && applianceManager.getAC().isRunning()) {
                applianceManager.flipAppliancePower(applianceManager.getAC());
            }
            return;
        }
        if (applianceManager.getHeater() != null && applianceManager.getHeater().isRunning()) {
            applianceManager.flipAppliancePower(applianceManager.getHeater());
        }
        if (applianceManager.getAC() != null && applianceManager.getAC().isRunning()) {
            applianceManager.flipAppliancePower(applianceManager.getAC());
        }
    }
}

module.exports = TemperatureUtils;