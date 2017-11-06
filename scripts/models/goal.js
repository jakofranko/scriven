// tracker.categories_collection set in tracker.js
// tracker.intervals_collection set in tracker.js

const GoalModel = Backbone.Model.extend({
    defaults: {
        id: null,
        name: null,
        unit: null,
        category_id: null,
        interval_id: null
    }
});

const GoalsCollection = Backbone.Collection.extend({
    url: 'http://localhost:3000/goals',
    model: GoalModel,
    parse: function(data) {
        return data.goals;
    }
});

const GoalItemView = Backbone.View.extend({
    tagName: 'tr',
    className: 'goal',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        let html = '';

        // Build rows
        const attrs = ['id', 'name', 'unit', 'category_id', 'interval_id'];
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

        // Add delete button
        html += "<td><button type='button' class='delete ph2 pv1'>Delete</button></td>";
        // Add rows
        this.$el.html(html);
        return this;
    },
    events: {
        'click .delete': 'onDelete'
    },
    onDelete: function() {
        let yes = confirm(`Are you sure you want to delete the goal '${this.model.get('name')}'?`);
        if(yes)
            this.model.destroy();
    }
});

const NewGoalItemView = Backbone.View.extend({
    tagName: 'tr',
    className: 'new-goal',
    render: function() {
        let html = [];
        let td, select;

        // Add a blank td since we won't be specifying that
        html.push(document.createElement('td'));

        // Add tds for the other attrs
        const attrs = ['name', 'unit', 'category_id', 'interval_id'];
        attrs.forEach(attr => {
            td = document.createElement('td');
            if(attr === 'category_id') {
                select = new CategoriesDropdownView({ collection: tracker.categories_collection });
                $(td).append(select.render().$el);
            } else if(attr === 'interval_id') {
                select = new IntervalsDropdownView({collection: tracker.intervals_collection });
                $(td).append(select.render().$el);
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

const GoalsView = Backbone.View.extend({
    el: '#goals',
    initialize: function() {
        this.collection.fetch();
        this.listenTo(this.collection, 'sync change', this.render);
    },
    render: function() {
        let $list = this.$('#goals-list');
        $list.empty();

        this.collection.each(model => {
            let goal = new GoalItemView({ model });
            $list.append(goal.render().$el);
        });

        return this;
    },
    events: {
        'click .add': 'onAdd'
    },
    onAdd: function() {
        const tr = new NewGoalItemView({ collection: this.collection });
        this.$('#goals-list').append(tr.render().$el);
    }
});