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
        const now = new Date();
        let today = [],
            total = 0,
            date,
            day;
        logs.forEach(log => {
            date = log.get('date');
            day = Number(date.split("-")[2]);
            if(day === now.getDate()) today.push(log);
        });

        today.forEach(log => total += log.get('amount'));

        return Math.min(100, (total / this.model.get('amount')) * 100);
    },
    calculateWeekProgress: function(logs) {
        const now = new Date(),
            weekBeginning = now.getDate() - now.getDay(),
            weekEnd = now.getDate() + (6 - now.getDay());
        let week = [],
            total = 0,
            date,
            day;
        logs.forEach(log => {
            date = log.get('date');
            day = Number(date.split("-")[2]);
            if(day <= weekEnd && day >= weekBeginning) week.push(log);
        });

        week.forEach(log => total += log.get('amount'));

        return Math.min(100, (total / this.model.get('amount')) * 100);
    },
    calculateMonthProgress: function(logs) {
        const now = new Date();
        let month = [],
            total = 0,
            date,
            log_month;
        logs.forEach(log => {
            date = log.get('date');
            log_month = Number(date.split("-")[1]);
            if(log_month === now.getMonth() + 1) month.push(log);
        });

        month.forEach(log => total += log.get('amount'));

        return Math.min(100, (total / this.model.get('amount')) * 100);
    },
    calculateYearProgress: function(logs) {
        const now = new Date();
        let year = [],
            total = 0,
            date,
            log_year;
        logs.forEach(log => {
            date = log.get('date');
            log_year = Number(date.split("-")[0]);
            if(log_year === now.getYear()) year.push(log);
        });

        year.forEach(log => total += log.get('amount'));

        return Math.min(100, (total / this.model.get('amount')) * 100);
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