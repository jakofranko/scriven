if(!Date.prototype.getDayNumber) {
    // https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
    Date.prototype.getDayNumber = function() {
        const start = new Date(this.getFullYear(), 0, 0);
        const diff = (this - start) + ((start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000); // account for TZ offset
        return Math.floor(diff / (1000 * 60 * 60 * 24)); // divide diff, which is in milliseconds, by the amount of milliseconds in a day to get the day number
    }
}