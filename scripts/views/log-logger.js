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