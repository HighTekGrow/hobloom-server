function LogManager() {
    this.enviroment = [];
}

LogManager.prototype.addEnviromentLog = function (reading) {
    this.enviroment.push(reading)
};

module.exports = LogManager;