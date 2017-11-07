const LogModel = Backbone.Model.extend({
    defaults: {
        goal_id: null,
        amount: null,
        datetime: new Date().toISOString()
    },
    validate: function(attrs, options) {
        if(!attrs.goal_id)
            return "You must pick a goal/task";
        if(!attrs.amount)
            return "Please specify an amount";
        if(!attrs.datetime)
            return "You must select a date";
    }
});

const LogsCollection = Backbone.Collection.extend({
    url: 'http://localhost:3000/logs',
    model: LogModel,
    parse: function(data) {
        return data.logs;
    }
});

const LogsTableRowView = Backbone.View.extend({
    tagName: 'tr',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        this.$el.html(null);
        ['goal_id', 'amount', 'datetime'].forEach(col => {
            if(col === 'goal_id') {
                let goal_model = tracker.goals_collection.get(this.model.get(col));
                this.$el.append(`<td>${goal_model.get('name')}</td>`);
            } else {
                this.$el.append(`<td>${this.model.get(col)}</td>`);
            }
        });

        return this;
    }
});

const LogsTableView = Backbone.View.extend({
    el: "#logs",
    initialize: function() {
        this.collection.fetch();
        this.listenTo(this.collection, 'sync change add remove', this.render);
        this.listenTo(tracker.goals_collection, 'sync change add remove', this.render);
    },
    render: function() {
        let $table = this.$("#logs-list"),
            tr;

        $table.html(null);
        this.collection.each(model => {
            tr = new LogsTableRowView({ model });
            $table.append(tr.render().$el);
        });
    }
});

// For adding logs to the DB. Will populate a dropdown list of goals, and should update when these are updated.
// Will also provide an input for the amount completed, and a date picker
const LoggerView = Backbone.View.extend({
    el: "#logger",
    initialize: function() {
        // Since the only thing that needs to be updated is the dropdown, and this updates itself,
        // place all elements on initialization
        let goal_picker   = new GoalsDropdownView({ collection: tracker.goals_collection }).render(),
            goal_label    = document.createElement('label'),
            amount_input  = document.createElement('input'),
            amount_label  = document.createElement('label'),
            date_picker   = document.createElement('input'),
            date_label    = document.createElement('label'),
            submit        = document.createElement('button'),
            row = document.createElement('div'),
            col3 = document.createElement('div'),
            col, r;

        // Set attributes and text
        row.classList = 'r';
        col3.classList = 'c3';
        goal_label.textContent = "Goal/Task";
        goal_label.classList = "mr3 mb3";
        amount_input.type = 'number';
        amount_input.name = 'amount';
        amount_label.textContent = "Amount";
        amount_label.classList = "amount-label mr3 mb3";
        date_picker.type = "date";
        date_picker.name = "datetime";
        date_label.textContent = "Select Date & Time";
        date_label.classList = "mr3 mb3";
        submit.type = "button";
        submit.classList = "submit pv2 ph3";
        submit.textContent = "Log";

        // Place elements
        r = row.cloneNode();
        col = col3.cloneNode();
        col.appendChild(goal_label);
        $(col).append(goal_picker.$el);
        r.appendChild(col);

        col = col3.cloneNode();
        col.appendChild(amount_label);
        col.appendChild(amount_input);
        r.appendChild(col);

        col = col3.cloneNode();
        col.appendChild(date_label);
        col.appendChild(date_picker);
        r.appendChild(col);

        col = col3.cloneNode();
        col.appendChild(submit);
        r.appendChild(col);

        this.$el.append(r);

        // Add an additional row for error messages
        r = row.cloneNode();
        r.classList = "errors red mv3";

        this.$el.append(r);
    },
    events: {
        'click .submit': 'onSubmit'
    },
    onSubmit: function() {
        const inputs = this.$el.find('input').add('select');
        let log = new LogModel(),
            attrs = {};

        inputs.each((i, el) => attrs[el.name] = el.value);

        log.set(attrs);

        if(log.isValid()) {
            // Add the model to the collection, save it, and blank out the inputs
            this.collection.add(log);
            log.save();
            inputs.each((i, el) => $(el).val(null));
            this.$('.errors').text(null);
        } else {
            // Add a validation message
            this.$('.errors').text(log.validationError);
        }
    }
});