const LogsTableRowView = Backbone.View.extend({
    tagName: 'tr',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        this.$el.html(null);
        ['goal_id', 'amount', 'datetime'].forEach(col => {
            if(col === 'goal_id') {
                let goal_model = scriven.goals_collection.get(this.model.get(col));
                let goal_name = goal_model ? goal_model.get('name') : 'removed';
                this.$el.append(`<td>${goal_name}</td>`);
            } else {
                this.$el.append(`<td>${this.model.get(col)}</td>`);
            }
        });

        // Add buttons
        this.$el.append("<td><button type='button' class='edit pv2 ph3 mr2'>Edit</button><button type='button' class='delete pv2 ph3'>Delete</button></td>");

        return this;
    },
    events: {
        'click .edit': 'onEdit',
        'click .delete': 'onDelete',
        'click .update': 'onUpdate'
    },
    onEdit: function() {
        let goal_picker = new GoalsDropdownView({ collection: scriven.goals_collection }).render().$el,
            amount = document.createElement('input'),
            date = document.createElement('input'),
            update = document.createElement('button'),
            inputs = [goal_picker, amount, date, update],
            td;

        amount.placeholder = 'Amount';
        amount.type = 'number';
        amount.name = 'amount';
        date.type = 'date';
        date.name = 'datetime';
        update.textContent = 'Update';
        update.type = 'button';
        update.classList = 'update pv2 ph3';

        this.$el.html(null);
        inputs.forEach(input => {
            td = $('<td />');
            td.append(input);
            this.$el.append(td);
        });
    },
    onDelete: function() {
        let yes = confirm(`Are you sure you want to delete this log from '${this.model.get('datetime')}'?`);
        if(yes)
            this.model.destroy();
    },
    onUpdate: function() {
        let inputs = this.$('input').add('select', this.$el),
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
        this.collection.fetch();
        this.listenTo(this.collection, 'sync change add remove', this.render);
        this.listenTo(scriven.goals_collection, 'sync change add remove', this.render);
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