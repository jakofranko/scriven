// The scriven will take my logs, and compare them to my goals and milestones in order to give me an idea of three things:
// 1) What I've done -- To be able to view my areas of expertise (or lack), and effectively communicate my value to others
// 2) What I'm doing -- Awareness is necessary for effective and efficient change
// 3) What I need to do -- Given my actions, past and present, I can make intelligent decisions on what to do next
// An interface can then be built to visualize my past, analyze my present, and advise my future.
// Inspirations:
// - http://wiki.xxiivv.com/Horaire
// - https://www.craze.co.uk/chronologicon/
// - http://log.v-os.ca/
// - https://joshavanier.github.io/wiki/horology/log/

function Scriven() {
    // Initialize collections
    this.categories_collection  = new CategoriesCollection();
    this.intervals_collection   = new IntervalsCollection();
    this.goals_collection       = new GoalsCollection();
    this.logs_collection        = new LogsCollection();
    this.milestones_collection  = new MilestonesCollection();

    // Router
    this.router = new Router();
    this.router.on("route:showLogger", function() { this.showLogger(); });
    this.router.on("route:showLogs", function()   { this.showLogs(); });
    this.router.on("route:showConfig", function() { this.showConfig(); });
    Backbone.history.start();
}
Scriven.prototype.install = function() {
    // Load views
    this.categories_view    = new CategoriesView({ collection: this.categories_collection });
    this.goals_view         = new GoalsTableView({ collection: this.goals_collection });
    this.milestones_view    = new MilestoneTableView({ collection: this.milestones_collection });
    this.logs_table_view    = new LogsTableView({ collection: this.logs_collection });
    this.logger_view        = new LoggerView({ collection: this.logs_collection });
    this.progress_view      = new GoalsProgressView({ collection: this.goals_collection });
    this.history_day_view   = new LogDayHistoryView({ collection: this.logs_collection });
    this.history_week_view  = new LogWeekHistoryView({ collection: this.logs_collection });

    // Cross-view event-listeners
    this.logger_view.$("#log-date").change(this.handleDateChange.bind(this));

    // Finally, fetch the data
    this.categories_collection.fetch();
    this.intervals_collection.fetch();
    this.goals_collection.fetch();
    this.logs_collection.fetch();
    this.milestones_collection.fetch();
};
Scriven.prototype.getGoalsByInterval = function(interval) {
    const i = this.intervals_collection.findWhere({ name: interval });
    const goals = this.goals_collection.where({ interval_id: i.get('id') });
    return goals.reduce((map, goal) => {
        map[goal.get('id')] = goal.get('amount');
        return map;
    }, {});
};
Scriven.prototype.handleDateChange = function(e) {
    let date = new Date(e.target.value + 'T00:00:00'),
        day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear();

    // Render progress on change
    this.progress_view.render();

    // Set corresponding history cell to active
    this.history_day_view.$('cell.active').removeClass('active');
    this.history_day_view.$('cell').each((i, el) => {
        if(el.dataset.date) {
            let d = new Date(el.dataset.date);
            if(d.getDate() === day && d.getMonth() === month && d.getFullYear() === year)
                el.classList.add('active');
        }
    });
};