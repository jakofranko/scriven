// For adding logs to the DB. Will populate a dropdown list of goals, and should update when these are updated.
// Will also provide an input for the amount completed, and a date picker
const LoggerView = Backbone.View.extend({
    el: "#logger",
    initialize: function() {
        this.listenTo(this.collection, 'sync change', this.render);

        // Since this is a mix of static form elements and Backbone views,
        // initialize all of them here and then loop through in render func
        this.description_input   = document.createElement('textarea');
        this.description_label   = document.createElement('label');
        this.goal_picker         = new GoalsDropdownView({ collection: scriven.goals_collection });
        this.goal_label          = document.createElement('label');
        this.milestone_picker    = new MilestonesDropdownView({
            collection: scriven.milestones_collection,
            getDone: false
        });
        this.milestone_label     = document.createElement('label');
        this.amount_input        = document.createElement('input');
        this.amount_label        = document.createElement('label');
        this.units_label         = document.createElement('label');
        this.date_picker         = document.createElement('input');
        this.date_label          = document.createElement('label');
        this.duration_input      = document.createElement('input');
        this.duration_label      = document.createElement('label');
        this.submit              = document.createElement('button');
        this.errors              = document.createElement('div');
        this.elements = [
            this.date_label,
            this.date_picker,
            this.goal_label,
            this.goal_picker,
            this.amount_label,
            this.amount_input,
            this.units_label,
            this.milestone_label,
            this.milestone_picker,
            this.description_label,
            this.description_input,
            this.duration_label,
            this.duration_input,
            this.submit,
            this.errors
        ];

        // Set attributes and text
        this.description_input.name = 'description';
        this.description_input.classList = 'mb3';
        this.description_input.autofocus = true;
        this.description_label.textContent = "Description";
        this.description_label.classList = "description-label mr3 mb3";
        this.goal_label.textContent = "Goal/Task";
        this.goal_label.classList = "mb3";
        this.milestone_label.textContent = "Milestone";
        this.milestone_label.classList = "mb3";
        this.amount_input.type = 'number';
        this.amount_input.classList = 'mb2';
        this.amount_input.name = 'amount';
        this.amount_label.textContent = "Amount";
        this.amount_label.classList = "amount-label mr3";
        this.units_label.classList = "units-label mb4 f6";
        this.date_picker.type = "date";
        this.date_picker.classList = 'mb3';
        this.date_picker.id = 'log-date';
        this.date_picker.name = "date";
        this.date_label.textContent = "Select Date & Time";
        this.date_label.classList = "mr3 mb3";
        this.duration_input.type = 'number';
        this.duration_input.classList = 'mb3';
        this.duration_input.step = '0.01';
        this.duration_input.name = 'duration';
        this.duration_label.textContent = "Duration";
        this.duration_label.classList = "duration-label mr3 mb3";
        this.submit.type = "button";
        this.submit.classList = "submit pv2 ph3";
        this.submit.textContent = "Log";
        this.errors.classList = "r errors red mv3";
    },
    render: function() {
        this.$el.html(null);

        // Place elements
        this.elements.forEach(element => {
            if(element.render)
                this.$el.append(element.render().$el);
            else
                this.$el.append(element);

            this.$el.append("<br />");
        });

        // Load scriven's event handler for the date picker
        $(this.date_picker).change(scriven.handleDateChange.bind(scriven));
    },
    events: {
        'click .submit': 'onSubmit',
        'change .goal-select': 'onChange'
    },
    onSubmit: function() {
        const inputs = this.$el.find('input').add('select').add('textarea').not('.milestone-select');
        const milestone_select = this.$('.milestone-select');
        let log = new LogModel(),
            milestone,
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
            // Add the model to the collection, save it
            this.collection.add(log);
            log.save();

            // If a milestone is selected, mark it as done
            if(milestone_select.val() !== "") {
                milestone = scriven.milestones_collection.get(+milestone_select.val());
                if(milestone)
                    milestone.save({ done: true });
            }

            // Blank out inputs and errors
            inputs.each((i, el) => $(el).val(null));
            this.$('.errors').text(null);
        } else {
            // Add a validation message
            this.$('.errors').text(log.validationError);
        }
    },
    onChange: function(e) {
        // Set units
        var units = $(e.target).find(":selected").data('units');
        this.$('.units-label').html(units);
        
        // Set milestone goal_id
        var goal_id = $(e.target).val();
        this.$('.milestone-select').data('goal_id', +goal_id);

        // Re-render milestone picker
        this.milestone_picker.render();
    }
});