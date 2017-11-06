
/**
 * Created by jdfrankl on 10/5/17.
 */
// Goals are organized into broad categories, which can be further organized into subcategories. Each category has a
// set of goals associated with it. Each goal has an interval for how often that goal should be met (once a day, a week
// a month etc.), and an arbitrary unit of measurement, as well as a name.

function Category(properties) {
    this.name = properties.name;
    this.goals = [];
}

Category.prototype.add = function(goal) {
    const INTERVALS = ['day', 'minute', 'week', 'month', 'year', 'milestone'];
    if(!INTERVALS.includes(goal.interval)) throw Error(`Invalid interval ${goal.interval} for goal ${goal.name}`);
    this.goals.push(goal);
}

function Goal(properties) {
    this.name = properties.name;
    this.interval = properties.interval;
    this.unit = properties.unit;
    this.amount = properties.amount;
}