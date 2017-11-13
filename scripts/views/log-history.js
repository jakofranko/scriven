const LogDayHistoryView = Backbone.View.extend({
    el: "#history",
    initialize: function() {
        this.listenTo(this.collection, 'sync change add delete', this.render);
    },
    render: function() {
        // https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
        const now = new Date();
        const year = now.getFullYear();
        const start = new Date(year, 0, 0);
        const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        const cell_size = 5;
        const cell_pad = 2;
        let curr_date, date_str, curr_day_logs, day_progress, day_complete, cell, x, y = 0;

        // Fetch the daily goals
        debugger;
        const day_interval = tracker.intervals_collection.findWhere({ name: 'day' });
        const day_goals = tracker.goals_collection.where({ interval_id: day_interval.get('id') });
        const goal_map = day_goals.reduce((map, goal) => {
            map[goal.get('id')] = goal.get('amount');
            return map;
        }, {});

        // Fetch daily logs
        const day_logs = _.flatten(day_goals.map(goal => {
           return this.collection.where({ goal_id: goal.get('id') });
        }));

        this.$el.html(null);
        for(let i = 0; i < day; i++) {
            // Fetch logs for this day
            curr_date = new Date(year, 0, i);
            if(now.getDate() == curr_date.getDate())
                debugger;
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
            day_complete = true;
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

            x = ((i % 7) * cell_size) * cell_pad;
            y = i % 7 === 0 ? Math.floor(i / 7) * cell_size * cell_pad : y;

            cell = document.createElement("cell");
            cell.classList = "br4 ba";
            cell.style.top = y + "px";
            cell.style.left = x + "px";
            cell.style.background.color = day_complete ? "rebeccapurple" : "none";

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