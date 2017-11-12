var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
var Asset = require('./objects/Asset');
var LogUtils = require('./lib/LogUtils');
var AssetUtils = require('./lib/AssetUtils');
var LightUtils = require('./lib/LightUtils');
var LogManager = require('./objects/LogManager');
var SettingUtils = require('./lib/SettingUtils');
var HumidityUtils = require('./lib/HumidityUtils');
var ReportUtils = require('./lib/ReportUtils');
var EnviromentUtils = require('./lib/EnviromentUtils');
var SensorManager = require('./objects/SensorManager');
var SettingManager = require('./objects/SettingManager');
var TemperatureUtils = require('./lib/TemperatureUtils');
var ApplianceManager = require('./objects/ApplianceManager');
var EnviromentLogEntry = require('./objects/EnviromentLogEntry');

var sensorManager, applianceManager, settingsManager, logManager;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// REST API Endpoints
app.get('/asset', function (req, res) {
    res.send({ status: 200, data: { sensors: sensorManager.getSensors(), appliances: applianceManager.getAppliances() }});
});
app.get('/asset/:assetId', function (req, res) {
    var asset = AssetUtils.getAssetById(req.params.assetId, applianceManager, sensorManager);
    if (!asset) {
        return res.send({ status: 404, data: 'Asset Not Found' });
    }
    return res.send({ status: 200, data: asset });
});
app.post('/asset', function (req, res) {
    AssetUtils.createAsset(new Asset(req.body), sensorManager, applianceManager).
    then(function () {
        var data = { sensors: sensorManager.getSensors(), appliances: applianceManager.getAppliances() };
        res.send({ status: 200, data: data });
    }).
    catch(function (err) {
        res.send({ status: 500, data: err });
        console.log(err);
    });
});
app.delete('/asset/:assetId', function (req, res) {
    AssetUtils.deleteAsset(parseInt(req.params.assetId), sensorManager, applianceManager).
    then(function () {
        res.send({ status: 200, data: {} });
    }).
    catch(function (err) {
        res.send({ status: 500, data: err });
    });
});

app.get('/sensor', function (req, res) {
    res.send({ status: 200, data: sensorManager.getSensors() });
});


app.get('/appliance', function (req, res) {
    res.send({ status: 200, data: applianceManager.getAppliances() });
});

app.get('/settings', function (req, res) {
    res.send({ status: 200, data: settingsManager.getSettings() });
});
app.put('/settings', function (req, res) {
    SettingUtils.updateSettings(req.body.settings).
    then(function (settings) {
        settingsManager = new SettingManager(settings);
    }).
    then(function () {
        res.send({ status: 200, data: settingsManager.getSettings() });
    }).
    catch(function (err) {
        res.send({ status: 500, data: settingsManager.getSettings() });
    });
});

app.get('/cycle', function (req, res) {
    // TODO: one line put in utils to get Day/Night string from isLightOnTime
    if (LightUtils.isLightOnTime(settingsManager)) {
        return res.send({ status: 200, data: { current_cycle: 'Day' } });
    }
    return res.send({ status: 200, data: { current_cycle: 'Night' } });
});

app.get('/report', function (req, res) {
    res.send({ status: 404, data: 'Data Not Found' });
});
app.get('/report/enviroment', function (req, res) {
    ReportUtils.getEnviromentReport().
    then(function (data) {
        res.send({ status: 200, data: data });
    });
});


function init() {
    startServer();
    return new Promise(function(resolve, reject) {
        AssetUtils.getAllAssetsFromDB().
        then(setupAssetManagers).
        then(SettingUtils.getAllSettings).
        then(setupSettingsManagers).
        then(setupLights).
        catch(function (err) {
            reject(err);
        });
    });
}

function startServer() {
    // TODO: Move port number to config
    app.listen(1337, () => console.log('HOBloom listening on port 1337!'));
}

function setupLights() {
    LightUtils.isLightOnTime(settingsManager);
}

function setupAssetManagers(assets) {
    logManager = new LogManager();

    var allAssets = AssetUtils.sortAssets(assets);
    sensorManager = new SensorManager(allAssets.sensors);
    applianceManager = new ApplianceManager(allAssets.appliances);
}

function setupSettingsManagers(settings) {
    settingsManager = new SettingManager(settings);
}

function handleHumidityCheck(humidity) {
    HumidityUtils.handleHumidityReading(humidity, settingsManager, applianceManager);
}

function handleTemperatureCheck(temperature) {
    TemperatureUtils.handleTemperatureCheck(temperature, settingsManager, applianceManager);
}

function mainLoop() {
    LightUtils.updateLightsForCycle(settingsManager, applianceManager);

    var enviromentReading = EnviromentUtils.getAverageReadingFromSensors(sensorManager);
    if (!enviromentReading) {
        return;
    }
    LogUtils.logEnviromentData(new EnviromentLogEntry(enviromentReading.temperature, enviromentReading.humidity), logManager);
    handleHumidityCheck(enviromentReading.humidity);
    handleTemperatureCheck(enviromentReading.temperature);
}

init().
catch(function (err) {
    console.log(err);
});

setInterval(function () { mainLoop(); }, 5 * 1000);