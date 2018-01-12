const GoalProgressBar = Backbone.View.extend({
    tagName: 'div', // TODO: use the progress tag?
    className: 'progress mb3 ba br1',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        const interval = scriven.intervals_collection.get(this.model.get('interval_id')).get('name');
        const logs = scriven.logs_collection.where({ goal_id: this.model.get('id') });
        const progress_bar = document.createElement('div');
        let percentage;

        progress_bar.classList = 'progress-bar br1';

        // Depending on the goal's interval type, calculate progress differently
        switch(interval) {
            case 'day':
                percentage = this.calculateDayProgress(logs);
                break;
            case 'week':
                percentage = this.calculateWeekProgress(logs);
                break;
            case 'month':
                percentage = this.calculateMonthProgress(logs);
                break;
            case 'year':
                percentage = this.calculateYearProgress(logs);
                break;
            default:
                percentage = 0;
                break;
        }

        progress_bar.style.width = percentage + "%";
        this.$el.append(progress_bar);
        return this;
    },
    calculateDayProgress: function(logs) {
        const now = this.getCurrentDate();
        let today = [],
            total = 0,
            date, day, month, year;

        logs.forEach(log => {
            date = log.get('date').split("-");
            day = Number(date[2]);
            month = Number(date[1]);
            year = Number(date[0]);
            if(day === now.getDate() && month === now.getMonth() + 1 && year === now.getFullYear())
                today.push(log);
        });

        today.forEach(log => total += log.get('amount'));

        return Math.min(100, (total / this.model.get('amount')) * 100);
    },
    calculateWeekProgress: function(logs) {
        const now = this.getCurrentDate(),
            weekBeginning = now.getDate() - now.getDay(),
            weekEnd = now.getDate() + (6 - now.getDay());
        let week = [],
            total = 0,
            date, day, month, year;
        logs.forEach(log => {
            date = log.get('date').split("-");
            day = Number(date[2]);
            month = Number(date[1]);
            year = Number(date[0]);
            if(day <= weekEnd && day >= weekBeginning && month === now.getMonth() + 1 && year === now.getFullYear())
                week.push(log);
        });

        week.forEach(log => total += log.get('amount'));

        return Math.min(100, (total / this.model.get('amount')) * 100);
    },
    calculateMonthProgress: function(logs) {
        const now = this.getCurrentDate();
        let month = [],
            total = 0,
            date, log_month, year;
        logs.forEach(log => {
            date = log.get('date').split("-");
            log_month = Number(date[1]);
            year = Number(date[0]);
            if(log_month === now.getMonth() + 1 && year === now.getFullYear())
                month.push(log);
        });

        month.forEach(log => total += log.get('amount'));

        return Math.min(100, (total / this.model.get('amount')) * 100);
    },
    calculateYearProgress: function(logs) {
        const now = this.getCurrentDate();
        let year = [],
            total = 0,
            date,
            log_year;
        logs.forEach(log => {
            date = log.get('date');
            log_year = Number(date.split("-")[0]);
            if(log_year === now.getYear())
                year.push(log);
        });

        year.forEach(log => total += log.get('amount'));

        return Math.min(100, (total / this.model.get('amount')) * 100);
    },
    getCurrentDate: function() {
        // If a date is set in the logger date-picker, use that date,
        // otherwise, just use the current date.
        let date_el = scriven.logger_view.$('#log-date');
        let date = date_el ? date_el.val() : '';
        return date === '' || date === undefined ? new Date() : new Date(date + "T00:00:00");
    }
});

const GoalsProgressView = Backbone.View.extend({
    el: "#progress",
    initialize: function() {
        this.listenTo(this.collection, 'sync change add remove', this.render);
        this.listenTo(scriven.logs_collection, 'sync change add remove', this.render);
    },
    render: function() {
        const interval_ids = _.uniq(this.collection.pluck("interval_id")).filter(id => typeof id === "number"),
            col_size = Math.round(12 / interval_ids.length),
            row = $("<div class='r mb4' />");
        let interval, col, h, goals, progress, label;

        this.$el.html(null);
        interval_ids.forEach(interval_id => {
            col = $(`<div class='c${col_size} pr3' />`);
            interval = scriven.intervals_collection.get(interval_id);
            h = $(`<h3 class="mb3">${interval.get('name')}</h3>`);
            col.append(h);

            goals = this.collection.where({ interval_id });
            goals.forEach(model => {
                label = $(`<label>${model.get('name')}</label>`);
                progress = new GoalProgressBar({ model });
                col.append(label);
                col.append(progress.render().$el);
            });

            row.append(col);
        });

        this.$el.append(row);
    }
});