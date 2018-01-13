class TimeUtils {
    static translateTimeSetting(time) {
        if (time < 10) {
            time = "0" + time;
        }
        return time + ":00:00"
    }
}

module.exports = TimeUtils;