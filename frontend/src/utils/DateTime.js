class DateTimeUtil {
    constructor(timeStamp) {
        this.date = new Date(timeStamp * 1000);
    };

    unixTimeStampParser() {
        let year = this.date.getFullYear();
        let month = this.date.getMonth();
        let day = this.date.getDay();
        let hours = this.date.getHours();
        let minutes = this.date.getMinutes();
        let seconds = this.date.getSeconds();
        return {
            "year": year,
            "month": month,
            "day": day,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        }
    }
}

export default DateTimeUtil;
