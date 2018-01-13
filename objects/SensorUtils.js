class SensorUtils {
    static isSensor(type) {
        return [ 'dht11', 'dht22', 'fire'].indexOf(type) != -1;
    }
}

module.exports = SensorUtils;