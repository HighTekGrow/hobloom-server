function EnviromentLogEntry(temp, humidity) {
    this.temp = temp;
    this.humidity = humidity;
    this.time = Date.now();
}

module.exports = EnviromentLogEntry;