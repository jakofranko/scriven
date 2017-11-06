function Progress(tracker) {
    this.goals = tracker.categories;
    this.logs = tracker.logs;
    this.intervals = ['day', 'week', 'month', 'year'];
    this.dayGoals = {};
    this.weekGoals = {};
    this.monthGoals = {};
    this.yearGoals = {};

    // Sort goals into proper bins
    this.goals.forEach(category => {
        category.goals.forEach(goal => {
            let interval = goal.interval;
            if(interval != "milestone") this[interval + "Goals"][goal.name] = goal.amount;
        });
    });

    // HTML
    this.el = document.createElement("div");
    this.el.id = "progress";
    this.el

    let header = document.createElement("h2");
    header.classList = "mb4";
    header.textContent="Progress";
    this.el.appendChild(header);
}

Progress.prototype.install = function() {
    let section, header, progress, progressBar;
    const row = document.createElement("div");
    row.classList = "r mb3";

    this.intervals.forEach((int, i, arr) => {
        section = document.createElement("div");
        section.id = int;
        section.classList = "c3";

        if(i === 0)
            section.classList.add("pr2", "pv2");
        else if(i === arr.length - 1)
            section.classList.add("pl2", "pv2");
        else
            section.classList.add("p2");

        header = document.createElement("h3");
        header.classList = "lht mb4 p1 bb";
        header.textContent = int.toUpperCase();

        section.appendChild(header);

        for(let goal in this[int + "Goals"]) {
            header = document.createElement("h4");
            header.classList = "lht";
            header.textContent = goal.toUpperCase();

            progress = document.createElement("div");
            progress.classList = "progress mb3 ba br1";
            progressBar = document.createElement("div");
            progressBar.classList = "progress-bar br1";
            progressBar.id = goal.replace(/\s/g, '');

            progress.appendChild(progressBar);

            section.appendChild(header);
            section.appendChild(progress);
        }

        row.appendChild(section);
    });

    this.el.appendChild(row);
    document.body.appendChild(this.el);
    this.update();
};

Progress.prototype.update = function() {
    let progress;
    this.intervals.forEach(int => {
        let i = int.replace(/^(\w)/, (match, p1) => (p1.toUpperCase()));
        progress = this["calc" + i + "Progress"]();

        for(let task in progress) {
            let bar = document.getElementById(task.replace(/\s/g, ''));
            bar.style.width = progress[task] + "%";
        }
    });
};

Progress.prototype.calcDayProgress = function(logs) {
    // Return an object, where the keys are task names, and the values are percentages
    let progress = {};
    const l = logs || this.logs;
    const now = new Date();
    const dayLogs = l.filter(log => {
        let date = log.date.split("-");
        return log.task in this.dayGoals && date[2] == now.getDate();
    });

    dayLogs.forEach(log => {
        if(!progress[log.task]) progress[log.task] = 0;
        progress[log.task] += Math.min(100, (log.amount / this.dayGoals[log.task]) * 100)
        if(progress[log.task] > 100) progress[log.task] = 100;
    });

    return progress;
};

Progress.prototype.calcWeekProgress = function(logs) {
    // Return an object, where the keys are task names, and the values are percentages
    let progress = {};
    const l = logs || this.logs;
    const now = new Date();
    const weekBeginning = now.getDate() - now.getDay();
    const weekEnd = now.getDate() + now.getDay();
    const weekLogs = l.filter(log => {
        let date = log.date.split("-").map(num => (+num));
        return log.task in this.weekGoals && date[2] < weekEnd && date[2] > weekBeginning;
    });

    weekLogs.forEach(log => {
        if(!progress[log.task]) progress[log.task] = 0;
        progress[log.task] += Math.min(100, (log.amount / this.weekGoals[log.task]) * 100)
        if(progress[log.task] > 100) progress[log.task] = 100;
    });

    return progress;
};

Progress.prototype.calcMonthProgress = function(logs) {
    // Return an object, where the keys are task names, and the values are percentages
    let progress = {};
    const l = logs || this.logs;
    const now = new Date();
    const monthLogs = l.filter(log => {
        let date = log.date.split("-");
        return log.task in this.monthGoals && date[1] == now.getMonth() + 1;
    });

    monthLogs.forEach(log => {
        if(!progress[log.task]) progress[log.task] = 0;
        progress[log.task] += Math.min(100, (log.amount / this.monthGoals[log.task]) * 100)
        if(progress[log.task] > 100) progress[log.task] = 100;
    });

    return progress;
};

Progress.prototype.calcYearProgress = function(logs) {
    // Return an object, where the keys are task names, and the values are percentages
    let progress = {};
    const l = logs || this.logs;
    const now = new Date();
    const yearLogs = l.filter(log => {
        let date = log.date.split("-");
        return log.task in this.yearGoals && date[0] == now.getYear();
    });

    yearLogs.forEach(log => {
        if(!progress[log.task]) progress[log.task] = 0;
        progress[log.task] += Math.min(100, (log.amount / this.yearGoals[log.task]) * 100)
        if(progress[log.task] > 100) progress[log.task] = 100;
    });

    return progress;
};
