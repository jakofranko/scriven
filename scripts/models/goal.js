// tracker.categories_collection set in tracker.js
// tracker.intervals_collection set in tracker.js

const GoalModel = Backbone.Model.extend({
    defaults: {
        id: null,
        name: null,
        unit: null,
        amount: null,
        category_id: null,
        interval_id: null
    },
    validate: function(attrs, options) {
        if(typeof Number(attrs.amount) !== "number" || isNaN(attrs.amount))
            return "Amount must be a number";
        if(attrs.category_id === null || attrs.category_id === '')
            return "Please set category";
        if(attrs.interval_id === null || attrs.interval_id === '')
            return "Please set interval";
    }
});

const GoalsCollection = Backbone.Collection.extend({
    url: 'http://localhost:3000/goals',
    model: GoalModel,
    parse: function(data) {
        return data.goals;
    }
});

const GoalsTableRowView = Backbone.View.extend({
    tagName: 'tr',
    className: 'goal',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        let html = '';

        // Build rows
        const attrs = ['id', 'name', 'unit', 'amount', 'category_id', 'interval_id'];
        for(let i = 0; i < attrs.length; i++) {
            if(attrs[i] === 'category_id') {
                let category_id = this.model.get(attrs[i]);
                let category_model = tracker.categories_collection.get(category_id);
                html += `<td>${category_model ? category_model.get('name') : 'unknown'}</td>`;
            } else if(attrs[i] === 'interval_id') {
                let interval_id = this.model.get(attrs[i]);
                let interval_model = tracker.intervals_collection.get(interval_id);
                html += `<td>${interval_model ? interval_model.get('name') : 'unknown'}</td>`;
            } else {
                html += `<td>${this.model.get(attrs[i])}</td>`;
            }
        }

        // Add buttons
        html += "<td>" +
                    "<button type='button' class='edit ph2 pv1 mr2'>Edit</button>" +
                    "<button type='button' class='delete ph2 pv1'>Delete</button>" +
                "</td>";

        // Add rows
        this.$el.html(html);
        return this;
    },
    events: {
        'click .delete': 'onDelete',
        'click .edit': 'onEdit',
        'click .update': 'onUpdate'
    },
    onDelete: function() {
        let yes = confirm(`Are you sure you want to delete the goal '${this.model.get('name')}'?`);
        if(yes)
            this.model.destroy();
    },
    onEdit: function() {
        // Clear out existing row
        this.$el.html(null);

        let $name = $(`<input type='text' name='name' value='${this.model.get('name')}' placeholder='name'/>`),
            $unit= $(`<input type='text' name='unit' value='${this.model.get('unit')}' placeholder='unit'/>`),
            $amount= $(`<input type='text' name='amount' value='${this.model.get('amount')}' placeholder='amount'/>`),
            categories = new CategoriesDropdownView({ collection: tracker.categories_collection }).render().$el,
            intervals = new IntervalsDropdownView({collection: tracker.intervals_collection }).render().$el,
            inputs = [$name, $unit, $amount, categories, intervals],
            $td;

        // Blank cell for id
        this.$el.append("<td></td>");
        inputs.forEach(input => {
            $td = $('<td />');
            $td.append(input);
            this.$el.append($td);
        });

        // Button
        this.$el.append("<td><button type='button' class='update ph2 pv1'>Update</button></td>");
    },
    onUpdate: function() {
        let $name = this.$el.find('[name=name]'),
            $unit = this.$el.find('[name=unit]'),
            $amount = this.$el.find('[name=amount]'),
            $category_id = this.$el.find('[name=category_id]'),
            $interval_id = this.$el.find('[name=interval_id]');

        // Remove invalid class (if present), and add the updating class
        this.$el.removeClass('invalid');
        this.$el.addClass('updating');

        this.model.set({
            'name': $name.val(),
            'unit': $unit.val(),
            'amount': $amount.val(),
            'category_id': $category_id.val(),
            'interval_id': $interval_id.val()
        }, {validate: true});

        this.model.save();
    }
});

const NewGoalsTableRowView = Backbone.View.extend({
    tagName: 'tr',
    className: 'new-goal',
    render: function() {
        let html = [];
        let td, select;

        // Add a blank td since we won't be specifying that
        html.push(document.createElement('td'));

        // Add tds for the other attrs
        const attrs = ['name', 'unit', 'amount', 'category_id', 'interval_id'];
        attrs.forEach(attr => {
            td = document.createElement('td');
            if(attr === 'category_id') {
                select = new CategoriesDropdownView({ collection: tracker.categories_collection });
                $(td).append(select.render().$el);
            } else if(attr === 'interval_id') {
                select = new IntervalsDropdownView({collection: tracker.intervals_collection });
                $(td).append(select.render().$el);
            } else if(attr === 'amount') {
                $(td).append(`<input type="number" name="${attr}" class="wf" placeholder="${attr}"/>`);
            } else {
                $(td).append(`<input type="text" name="${attr}" class="wf" placeholder="${attr}"/>`);
            }

            html.push(td);
        });

        // Create button
        td = document.createElement('td');
        $(td).append('<button type="button" class="create ph2 pv1">Create</button>');
        html.push(td);

        // Add columns
        html.forEach(col => this.$el.append(col));
        return this;
    },
    events: {
        'click .create': 'onCreate'
    },
    onCreate: function() {
        let goal = {};
        const inputs = this.$('input').add(this.$('select'));
        inputs.each((i, el) => {
            const key = el.name;
            const value = el.value;
            goal[key] = value;
        });

        this.collection.create(goal);
    }
});

const GoalsTableView = Backbone.View.extend({
    el: '#goals',
    initialize: function() {
        this.collection.fetch();
        this.listenTo(this.collection, 'sync change', this.render);
        this.listenTo(this.collection, 'invalid', this.onInvalid);
    },
    render: function() {
        // If one of the rows is invalid, don't render
        if(this.$('.invalid').length) return;

        let $list = this.$('#goals-list');
        $list.empty();
        this.$('.errors').text(null);

        this.collection.each(model => {
            let goal = new GoalsTableRowView({ model });
            $list.append(goal.render().$el);
        });

        return this;
    },
    events: {
        'click .add': 'onAdd'
    },
    onAdd: function() {
        const tr = new NewGoalsTableRowView({ collection: this.collection });
        this.$('#goals-list').append(tr.render().$el);
    },
    onInvalid: function(model) {
        // Clicking the update button after editing a row will add the updating
        // class to it's row. Find this row, and add the invalid class
        this.$('.updating').addClass('invalid');
        this.$('.errors').text(model.validationError);
    }
});

const GoalsDropdownItemView = Backbone.View.extend({
    tagName: 'option',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        this.$el.val(this.model.get('id'));
        this.$el.text(this.model.get('name'));
        return this;
    }
});

const GoalsDropdownView = Backbone.View.extend({
    tagName: 'select',
    className: 'goal-select',
    initialize: function() {
        this.$el.attr('name', 'goal_id');
        this.collection.fetch();
        this.listenTo(this.collection, 'sync change', this.render);
    },
    render: function() {
        let option;
        this.$el.html(null);
        this.$el.append("<option value=''>Select Goal/Task</option>");
        this.collection.each(model => {
            option = new GoalsDropdownItemView({ model });
            this.$el.append(option.render().$el);
        });

        return this;
    }
});

const GoalProgressBar = Backbone.View.extend({
    tagName: 'div', // TODO: use the progress tag?
    className: 'progress mb3 ba br1',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        const interval = tracker.intervals_collection.get(this.model.get('interval_id')).get('name');
        const logs = tracker.logs_collection.where({ goal_id: this.model.get('id') });
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
            date = log.get('datetime');
            day = Number(date.split("-")[2]);
            if(day === now.getDate()) today.push(log);
        });

        today.forEach(log => total += log.get('amount'));

        return Math.min(100, (total / this.model.get('amount')) * 100);
    },
    calculateWeekProgress: function(logs) {
        const now = new Date(),
              weekBeginning = now.getDate() - now.getDay(),
              weekEnd = now.getDate() + now.getDay();
        let week = [],
            total = 0,
            date,
            day;
        logs.forEach(log => {
            date = log.get('datetime');
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
            date = log.get('datetime');
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
            date = log.get('datetime');
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
       this.listenTo(tracker.logs_collection, 'sync change add remove', this.render);
    },
    render: function() {
        const interval_ids = _.uniq(this.collection.pluck("interval_id")).filter(id => typeof id === "number"),
              col_size = Math.round(12 / interval_ids.length),
              row = $("<div class='r mb4' />");
        let interval, col, h, goals, progress, label;

        this.$el.html(null);
        interval_ids.forEach(interval_id => {
            col = $(`<div class='c${col_size} pr3' />`);
            interval = tracker.intervals_collection.get(interval_id);
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