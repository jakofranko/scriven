/**
 * Created by jdfrankl on 10/5/17.
 */

// The tracker will take my logs, and compare them to my goals and milestones in order to give me an idea of three things:
// 1) What I've done -- To be able to view my areas of expertise (or lack), and effectively communicate my value to others
// 2) What I'm doing -- Awareness is necessary for effective and efficient change
// 3) What I need to do -- Given my actions, past and present, I can make intelligent decisions on what to do next
// An interface can then be built to visualize my past, analyze my present, and advise my future.
// Inspirations:
// - http://wiki.xxiivv.com/Horaire
// - https://www.craze.co.uk/chronologicon/
// - http://log.v-os.ca/

function Tracker(categories, logs) {
    this.categories = categories;
    this.logs = logs || [];
    this.progress = {};

    this.logger = new Logger(this);
    this.progress = new Progress(this);

    // Load collections
    this.categories_collection = new CategoriesCollection();
    this.intervals_collection = new IntervalsCollection();
    this.goals_collection = new GoalsCollection();

    // Load views
    this.categories_view = new CategoriesView({ collection: this.categories_collection });
    this.goals_view = new GoalsView({ collection: this.goals_collection });

    // Elements
    this.el = document.createElement("div");
    this.el.classList.add('tracker');
    this.el.id = "tracker";
}
Tracker.prototype.install = function() {
    let tracker = this;
    let option = document.createElement("option");


    this.categories.forEach(category => {
        category.goals.forEach(goal => {
            if(goal.interval != "milestone") {

                // Update logger
                this.logger.addTask(goal);
            }
        });
    });

    // Put the logger in the DOM
    document.body.appendChild(this.el);

    // Install other components
    this.logger.install();
    this.progress.install();
};

Tracker.prototype.addLog = function(log) {
    this.logs.push(log);

    for(interval in this.progress) {
        if(this.progress[interval][log.task])
            this.progress[interval][log.task].curr += Number(log.amount);
    }

    this.updateProgress();
};

Tracker.prototype.updateProgress = function() {
    this.progress.update();
};