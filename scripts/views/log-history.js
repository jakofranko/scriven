const LogDayHistoryView = Backbone.View.extend({
    el: "#history",
    initialize: function() {
        this.listenTo(this.collection, 'sync change add delete remove', this.render);
    },
    render: function() {
        // TODO: Clean up this mess. Vom.
        const now = new Date();
        const day = now.getDayNumber();
        const year = now.getYear();
        const cell_size = 10;
        const cell_pad = 1.1;
        let curr_date, date_str, curr_day_logs, day_progress, percent_complete, cell, x = 0, y = 0;

        // Get the daily goals
        const day_interval = scriven.intervals_collection.findWhere({ name: 'day' });
        const day_goals = scriven.goals_collection.where({ interval_id: day_interval.get('id') });
        const goal_map = day_goals.reduce((map, goal) => {
            map[goal.get('id')] = goal.get('amount');
            return map;
        }, {});

        // Get daily logs
        const day_logs = _.flatten(day_goals.map(goal => {
           return this.collection.where({ goal_id: goal.get('id') });
        }));

        this.$('.day-cell').remove();
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

            this.$el.append(cell);
        }
    },
    padZero: function(number) {
        if(number < 9)
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

const LogWeekHistoryView = Backbone.View.extend({
    el: "#history",
    initialize: function() {
        this.listenTo(this.collection, 'sync change add delete remove', this.render);
    },
    render: function() {
        // TODO: Clean up this mess. Vom.
        const now = new Date();
        const day = now.getDayNumber();
        const year = now.getYear();
        const cell_size = 10;
        const cell_pad = 1.1;
        let curr_date, date_str, curr_week, week_start, week_end, curr_week_logs, week_progress, percent_complete, cell, x = 0, y = 0;

        // Get the daily goals
        const week_interval = scriven.intervals_collection.findWhere({ name: 'week' });
        const week_goals = scriven.goals_collection.where({ interval_id: week_interval.get('id') });
        const goal_map = week_goals.reduce((map, goal) => {
            map[goal.get('id')] = goal.get('amount');
            return map;
        }, {});

        // Get daily logs
        const week_logs = _.flatten(day_goals.map(goal => {
            return this.collection.where({ goal_id: goal.get('id') });
        }));

        this.$('.week-cell').remove();
        for(let i = 0; i <= day; i++) {
            // Get logs for this week
            curr_date = new Date(year, 0, i);
            week_start = curr_date.getDate() - curr_date.getDay();
            date_str = `${year}-${this.padZero(curr_date.getMonth() + 1)}-${this.padZero(curr_date.getDate())}`;
            curr_week_logs = this.getDayLogs(week_logs, date_str);

            // Calculate this day's total progress
            week_progress = curr_week_logs.reduce((progress, log) => {
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
                if(!week_progress[goal_id]) continue;
                if(week_progress[goal_id] >= goal_map[goal_id]) goals_complete++;
            }
            percent_complete = goals_complete ? goals_complete / Object.keys(goal_map).length : 0;

            // Calculate the position of the current cell
            x = i % 7 === 0 ? Math.floor(i / 7) * cell_size * cell_pad : x;
            y = ((i % 7) * cell_size) * cell_pad;

            // Assign attributes
            cell = document.createElement("cell");
            cell.classList = "br1 week-cell";
            cell.style.height = cell_size + "px";
            cell.style.width = cell_size + "px";
            cell.style.top = y + "px";
            cell.style.left = x + "px";
            cell.style.background = d3.interpolateGnBu(percent_complete);
            cell.dataset.date = curr_date;

            this.$el.append(cell);
        }
    },
    padZero: function(number) {
        if(number < 9)
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