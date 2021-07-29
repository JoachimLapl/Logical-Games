const date = new Date();
Object.defineProperties(date, {
    object: {
        get: function () {
            return { years: date.getFullYear(), months: date.getMonth(), days: date.getDay(), hours: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds(), milliseconds: date.getMilliseconds() }
        }
    }
});

class Chronometer {
    constructor() {
        this.path = [];
        this.timeRun = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, days: 0 };
        timeCount = { days: 1e9, hours: 24, minutes: 60, seconds: 60, milliseconds: 1000 };
        calculateTime = (start, end) => {
            this.timeRunV1 = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, days: 0 };
            var left = 0;
            for (t in this.timeRunV1) {
                var n1 = end[t] - start[t] - left;
                if (n1 < 0) {
                    left = 1;
                    n1 += timeCount[t];
                } else { left = 0 };
                this.timeRunV1[t] = n1;
            }
            return this.timeRunV1;
        };
        addTimes = (time1, time2) => {
            this.timeRunV2 = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, days: 0 };
            var left = 0;
            for (t in this.timeRunV2) {
                var n2 = time1[t] + time2[t] + left;
                left = 0;
                while (n2 > timeCount[t]) {
                    left += 1;
                    n2 -= timeCount[t];
                };
                this.timeRunV2[t] = n2;
            };
            return this.timeRunV2;
        };
    };
    reset() { this.path = []; this.timeRun = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, days: 0 }; }
    start() { this.path = [date.object]; }
    pauseStart() {
        var newObjDate = date.object;
        var timePlus = calculateTime(this.path[this.path.length - 1], newObjDate);
        this.path.push(newObjDate);
        this.timeRun = addTimes(this.timeRun, timePlus);
        return this.timeRun;
    };
    pauseEnd() {
        this.path.push(date.object);
    };
    stop() {
        const newObjDate = date.object;
        const timePlus = calculateTime(this.path[this.path.length - 1], newObjDate);
        this.timeRun = addTimes(this.timeRun, timePlus);
        this.path = [];
        setTimeout(() => {
            this.timeRun = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0, days: 0 };
        }, 1)
        return this.timeRun;
    };
};