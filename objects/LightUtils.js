var time = require('time');

class LightUtils {
    static isLightOnTime(settingsManager) {
        var now = new time.Date();
        now.setTimezone("America/New_York");
        var timeNow = now.toLocaleTimeString();
        var timeAry = timeNow.split(':');
        var starAry = settingsManager.getDayStart().split(':');
        var endAry = settingsManager.getDayEnd().split(':');

        if (parseInt(timeAry[0]) >= parseInt(starAry[0]) && parseInt(timeAry[0]) < parseInt(endAry[0])) {
            return true
        }
        return false;
    }

    static updateLightsForCycle(settingsManager, applianceManager) {
        if (typeof applianceManager.getAppliances() === 'undefined' || !applianceManager.getAppliances().length) {
            return;
        }
        var farReds = applianceManager.getFarRedLights();
        for (var x = 0; x < farReds.length; x++) {
            if (farReds[x].isRunning()) {
                if (farReds[x].getLastPowerChange() != null && new Date() - farReds[x].getLastPowerChange() > 15 * 60000) {
                    applianceManager.flipAppliancePower(farReds[x]);
                }
            }
        }
        // TODO: Use applianceManager.getLights instead
        // TODO: On change send socket io 
        for (var i = 0; i < applianceManager.getAppliances().length; i++) {
            if (applianceManager.getAppliances()[i].type !== 'light') {
                continue;
            }
            if (this.isLightOnTime(settingsManager)) {
                if (!applianceManager.getAppliances()[i].isRunning() && applianceManager.getAppliances()[i].type == 'light') {
                    applianceManager.flipAppliancePower(applianceManager.getAppliances()[i]);
                }
                return;
            }
            if (applianceManager.getAppliances()[i].isRunning() && applianceManager.getAppliances()[i].type == 'light') {
                applianceManager.flipAppliancePower(applianceManager.getAppliances()[i]);
                for (var x = 0; x < farReds.length; x++) {
                    if (!farReds[x].isRunning()) {
                        applianceManager.flipAppliancePower(farReds[x]);
                    }
                }
            }
        }
    }
}

module.exports = LightUtils;