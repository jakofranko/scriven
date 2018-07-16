const LogsTableRowView = Backbone.View.extend({
    tagName: 'tr',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        this.$el.html(null);

        const goal_id = this.model.get('goal_id');
        let goal_model = scriven.goals_collection.get(goal_id);
        let goal_name = goal_model ? goal_model.get('name') : '';

        this.$el.append(`<td>${goal_name}</td>`);

        ['description', 'amount', 'date', 'duration'].forEach(col => {
            this.$el.append(`<td>${this.model.get(col)}</td>`);
        });

        // Add buttons
        this.$el.append("<td><button type='button' class='edit pv2 ph3 mr2'>Edit</button><button type='button' class='delete pv2 ph3'>Delete</button></td>");

        return this;
    },
    events: {
        'click .edit': 'onEdit',
        'click .cancel': 'onCancel',
        'click .delete': 'onDelete',
        'click .update': 'onUpdate'
    },
    onEdit: function() {
        let goal_picker = new GoalsDropdownView({ collection: scriven.goals_collection }).render().$el,
            description = document.createElement('textarea'),
            amount = document.createElement('input'),
            date = document.createElement('input'),
            duration = document.createElement('input'),
            update = document.createElement('button'),
            cancel = document.createElement('button'),
            inputs = [description, goal_picker, amount, date, duration],
            td;

        goal_picker.val(this.model.get('goal_id'));
        description.placeholder = 'Log Entry';
        description.name = 'description';
        description.textContent = this.model.get('description');
        amount.placeholder = 'Amount';
        amount.type = 'number';
        amount.name = 'amount';
        amount.value = this.model.get('amount');
        date.type = 'date';
        date.name = 'date';
        date.value = this.model.get('date');
        duration.placeholder = 'Duration (Hours)';
        duration.type = 'number';
        duration.name = 'duration';
        duration.step = "0.01";
        duration.value = this.model.get('duration');
        update.textContent = 'Update';
        update.type = 'button';
        update.classList = 'update pv2 ph3 mr2';
        cancel.textContent = 'Cancel';
        cancel.type = 'button';
        cancel.classList = 'cancel pv2 ph3';

        this.$el.html(null);
        inputs.forEach(input => {
            td = $('<td />');
            td.append(input);
            this.$el.append(td);
        });

        // Add buttons
        td = $('<td />');
        td.append(update);
        td.append(cancel);
        this.$el.append(td);
    },
    onCancel: function() {
        this.render();
    },
    onDelete: function() {
        let yes = confirm(`Are you sure you want to delete this log entry from '${this.model.get('date')}'?`);
        if(yes)
            this.model.destroy();
    },
    onUpdate: function() {
        let inputs = this.$('input').add('select', this.$el).add('textarea', this.$el),
            log = {};

        inputs.each((i, el) => {
            log[el.name] = $(el).val();
        });

        this.model.set(log);
        if(this.model.isValid())
            this.model.save();
        else
            alert(this.model.validationError);
    }
});

const LogsTableView = Backbone.View.extend({
    el: "#logs",
    initialize: function() {
        this.listenTo(this.collection, 'sync change update', this.render);
        this.listenTo(scriven.goals_collection, 'sync change update', this.render);
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
