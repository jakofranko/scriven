// For adding logs to the DB. Will populate a dropdown list of goals, and should update when these are updated.
// Will also provide an input for the amount completed, and a date picker
const LoggerView = Backbone.View.extend({
    el: "#logger",
    initialize: function() {
        // Since the only thing that needs to be updated is the dropdown, and this updates itself,
        // place all elements on initialization
        let r;
        let description_input   = document.createElement('textarea'),
            description_label   = document.createElement('label'),
            goal_picker         = new GoalsDropdownView({ collection: scriven.goals_collection }).render().$el,
            goal_label          = document.createElement('label'),
            amount_input        = document.createElement('input'),
            amount_label        = document.createElement('label'),
            units_label         = document.createElement('label'),
            date_picker         = document.createElement('input'),
            date_label          = document.createElement('label'),
            duration_input      = document.createElement('input'),
            duration_label      = document.createElement('label'),
            submit              = document.createElement('button'),
            row                 = document.createElement('div'),
            elements = [
                description_label,
                description_input,
                goal_label,
                goal_picker,
                amount_label,
                amount_input,
                units_label,
                date_label,
                date_picker,
                duration_label,
                duration_input,
                submit
            ];

        // Set attributes and text
        description_input.name = 'description';
        description_input.classList = 'mb3';
        description_input.autofocus = true;
        description_label.textContent = "Description";
        description_label.classList = "description-label mr3 mb3";
        goal_picker.addClass("mb3");
        goal_label.textContent = "Goal/Task";
        goal_label.classList = "mb3";
        amount_input.type = 'number';
        amount_input.classList = 'mb2';
        amount_input.name = 'amount';
        amount_label.textContent = "Amount";
        amount_label.classList = "amount-label mr3";
        units_label.classList = "units-label mb4 f6";
        date_picker.type = "date";
        date_picker.classList = 'mb3';
        date_picker.id = 'log-date';
        date_picker.name = "date";
        date_label.textContent = "Select Date & Time";
        date_label.classList = "mr3 mb3";
        duration_input.type = 'number';
        duration_input.classList = 'mb3';
        duration_input.step = '0.01';
        duration_input.name = 'duration';
        duration_label.textContent = "Duration";
        duration_label.classList = "duration-label mr3 mb3";
        submit.type = "button";
        submit.classList = "submit pv2 ph3";
        submit.textContent = "Log";
        row.classList = 'r';

        // Place elements
        elements.forEach(element => {
           this.$el.append(element);
           this.$el.append("<br />");
        });

        // Add an additional row for error messages
        r = row.cloneNode();
        r.classList.add("errors", "red", "mv3");

        this.$el.append(r);
    },
    events: {
        'click .submit': 'onSubmit',
        'change .goal-select': 'onChange'
    },
    onSubmit: function() {
        const inputs = this.$el.find('input').add('select').add('textarea');
        let log = new LogModel(),
            attrs = {};

        inputs.each((i, el) => {
            if(el.value === "")
                return;

            if(el.type === "number" || el.name === "goal_id")
                attrs[el.name] = +el.value;
            else
                attrs[el.name] = el.value;
        });

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
    },
    onChange: function(e) {
        var units = $(e.target).find(":selected").data('units');
        this.$('.units-label').html(units);
    }
});