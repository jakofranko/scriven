const LogDayHistoryView = Backbone.View.extend({
    el: "#history",
    initialize: function() {
        this.listenTo(this.collection, 'sync change update', this.render);
    },
    render: function() {
        // TODO: Clean up this mess. Vom.
        const now = new Date();
        const day = now.getDayNumber();
        const year = now.getFullYear();
        const cell_pad = 1.5;
        const cell_size = (this.$el.width() / 52) / cell_pad;
        let curr_date, date_str, curr_day_logs, day_progress, percent_complete, cell, x = 0, y = 0;

        // Get the daily goals
        const goal_map = scriven.getGoalsByInterval('day');

        // Get daily logs by fetching them per goal_id
        const day_logs = _.flatten(Object.keys(goal_map).map(goal_id => {
           return this.collection.where({ goal_id: +goal_id });
        }));

        // Clear out existing cells
        this.$('.day-cell').remove();

        // Place new cells
        for(let i = 0; i <= day; i++) {
            // Get logs for this day
            curr_date = new Date(year, 0, i);
            date_str = `${year}-${this.padZero(curr_date.getMonth() + 1)}-${this.padZero(curr_date.getDate())}`;
            curr_day_logs = this.getDayLogs(day_logs, date_str);

            // Calculate this day's total progress
            day_progress = curr_day_logs.reduce((progress, log) => {
               if(!progress[log.get('goal_id')])
                   progress[log.get('goal_id')] = log.get('amount');
               else
                   progress[log.get('goal_id')] += log.get('amount');
               return progress;
            }, {});

            // Calculate percentage of number of goals met
            percent_complete = 0;
            let goals_complete = 0;
            for(let goal_id in goal_map) {
                if(!goal_map.hasOwnProperty(goal_id)) continue;
                if(!goal_map[goal_id]) throw new Error("whaaaa....");
                if(!day_progress[goal_id]) continue;
                if(day_progress[goal_id] >= goal_map[goal_id]) goals_complete++;
            }
            percent_complete = goals_complete ? goals_complete / Object.keys(goal_map).length : 0;

            // Calculate the position of the current cell
            x = i % 7 === 0 ? Math.floor(i / 7) * cell_size * cell_pad : x;
            y = ((i % 7) * cell_size) * cell_pad;

            // Assign attributes
            cell = document.createElement("cell");
            cell.classList = "br1 day-cell";
            cell.style.height = cell_size + "px";
            cell.style.width = cell_size + "px";
            cell.style.top = y + "px";
            cell.style.left = x + "px";
            cell.style.background = d3.interpolateGnBu(percent_complete);
            cell.dataset.date = curr_date;
            cell.addEventListener('click', this.handleClick);

            this.$el.append(cell);
        }
    },
    padZero: function(number) {
        if(number < 10)
            return '0' + number;
        else
            return number;
    },
    getDayLogs: function(logs, date) {
        let day_logs = [];
        logs.forEach(log => {
            if(log.get('date') === date) day_logs.push(log);
        });
        return day_logs;
    },
    handleClick: function(e) {
        const cell = e.target,
              date = new Date(cell.dataset.date),
              day = date.getDate(),
              month = date.getMonth() + 1,
              d = day < 10 ? '0' + day : day,
              m = month < 10 ? '0' + month : month,
              picker = scriven.logger_view.$("#log-date");

        $(cell).parent().find('.active').removeClass('active');
        cell.classList.add('active');

        picker.val(`${date.getFullYear()}-${m}-${d}`);
        picker.trigger('change');
    }
});

const LogWeekHistoryView = Backbone.View.extend({
    el: "#history",
    initialize: function() {
        this.listenTo(this.collection, 'sync change update', this.render);
    },
    render: function() {
        // TODO: Clean up this mess. Vom.
        const now = new Date();
        const day = now.getDayNumber();
        const year = now.getFullYear();
        const cell_pad = 1.5;
        const cell_size = (this.$el.width() / 52) / cell_pad;
        let curr_date, date_str, curr_day_logs, week_progress, percent_complete, cell, x = 0, y = 150;

        // Get the weekly goals
        const goal_map = scriven.getGoalsByInterval('week');

        // Get weekly logs
        const week_logs = _.flatten(Object.keys(goal_map).map(goal_id => {
            return this.collection.where({ goal_id: +goal_id });
        }));

        this.$('.week-cell').remove();
        for(let i = 1; i <= day; i++) { // Start with 1, so that we don't start on 12/31 of last year
            // Get the current date object and logs
            curr_date = new Date(year, 0, i);
            date_str = `${year}-${this.padZero(curr_date.getMonth() + 1)}-${this.padZero(curr_date.getDate())}`;
            curr_day_logs = this.getDayLogs(week_logs, date_str);

            // If it's a new week or the first day, initialize the current week's progress
            if(curr_date.getDay() === 0 || i === 1) {
                week_progress = {};
            }

            // Add the logs for today to the week's total progress
            week_progress = curr_day_logs.reduce((progress, log) => {
                if(!progress[log.get('goal_id')])
                    progress[log.get('goal_id')] = log.get('amount');
                else
                    progress[log.get('goal_id')] += log.get('amount');
                return progress;
            }, week_progress);

            // If it's the end of the week or the current day, calculate percentage of goals met, and add cell
            if(curr_date.getDay() === 6 || i === day) {
                // Calculate percentage of number of goals met
                percent_complete = 0;
                let goals_complete = 0;
                for(let goal_id in goal_map) {
                    if(!goal_map.hasOwnProperty(goal_id)) continue;
                    if(!goal_map[goal_id]) throw new Error("whaaaa....");
                    if(!week_progress[goal_id]) continue;
                    if(week_progress[goal_id] >= goal_map[goal_id]) goals_complete++;
                }
                percent_complete = goals_complete ? goals_complete / Object.keys(goal_map).length : 0;

                // Calculate the position of the current cell
                x = (Math.floor(i / 7) - 1) * cell_size * cell_pad;

                // Assign attributes
                cell = document.createElement("cell");
                cell.classList = "br1 week-cell";
                cell.style.height = cell_size + "px";
                cell.style.width = cell_size + "px";
                cell.style.top = y + "px";
                cell.style.left = x + "px";
                cell.style.background = d3.interpolateGnBu(percent_complete);
                // cell.dataset.date = curr_date;

                this.$el.append(cell);
            }
        }
    },
    padZero: function(number) {
        if(number < 10)
            return '0' + number;
        else
            return number;
    },
    getDayLogs: function(logs, date) {
        let day_logs = [];
        logs.forEach(log => {
            if(log.get('date') === date) day_logs.push(log);
        });
        return day_logs;
    }
});
