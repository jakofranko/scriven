const LogDayHistoryView = Backbone.View.extend({
    el: "#history",
    initialize: function() {
        this.listenTo(this.collection, 'sync change add delete remove', this.render);
    },
    render: function() {
        // https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
        const now = new Date();
        const year = now.getFullYear();
        const start = new Date(year, 0, 0);
        const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        const cell_size = 8;
        const cell_pad = 1.1;
        let curr_date, date_str, curr_day_logs, day_progress, day_complete, cell, x, y = 0;

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

        this.$el.html(null);
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

            // Compare today's progress with the goal amount
            day_complete = !!day_logs.length; // if day_logs is empty, goal_map will be empty
            for(let goal_id in goal_map) {
                if(!goal_map[goal_id]) throw new Error("whaaaa....");
                if(!day_progress[goal_id]) {
                    day_complete = false;
                    break;
                }
                if(day_progress[goal_id] < goal_map[goal_id]) {
                    day_complete = false;
                    break;
                }
            }

            x = i % 7 === 0 ? Math.floor(i / 7) * cell_size * cell_pad : x;
            y = ((i % 7) * cell_size) * cell_pad;

            cell = document.createElement("cell");
            cell.classList = "br4";
            cell.style.height = cell_size + "px";
            cell.style.width = cell_size + "px";
            cell.style.top = y + "px";
            cell.style.left = x + "px";
            cell.style.background = day_complete ? "rebeccapurple" : "none";
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
            if(log.get('datetime') === date) day_logs.push(log);
        });
        return day_logs;
    }
});