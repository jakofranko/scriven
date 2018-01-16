const MilestoneTableRowView = Backbone.View.extend({
    tagName: 'tr',
    className: 'milestone',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        let html = '';

        // Build rows
        const attrs = ['id', 'name', 'goal_id'];
        for(let i = 0; i < attrs.length; i++) {
            if(attrs[i] === 'goal_id') {
                let goal_id = this.model.get(attrs[i]);
                let goal_model = scriven.goals_collection.get(goal_id);
                html += `<td>${goal_model ? goal_model.get('name') : 'unknown'}</td>`;
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
        let yes = confirm(`Are you sure you want to delete the milestone '${this.model.get('name')}'?`);
        if(yes)
            this.model.destroy();
    },
    onEdit: function() {
        // Clear out existing row
        this.$el.html(null);

        let $name = $(`<input type='text' name='name' value='${this.model.get('name')}' placeholder='name'/>`),
            goals = new GoalsDropdownView({ collection: scriven.goals_collection }).render().$el,
            inputs = [$name, goals],
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
            $goal_id = this.$el.find('[name=goal_id]');

        // Remove invalid class (if present), and add the updating class
        this.$el.removeClass('invalid');
        this.$el.addClass('updating');

        this.model.set({
            'name': $name.val(),
            'goal_id': $goal_id.val()
        }, {validate: true});

        this.model.save();
    }
});

const NewMilestoneTableRowView = Backbone.View.extend({
    tagName: 'tr',
    className: 'new-milestone',
    render: function() {
        let html = [];
        let td, select;

        // Add a blank td since we won't be specifying that
        html.push(document.createElement('td'));

        // Add tds for the other attrs
        const attrs = ['name', 'goal_id'];
        attrs.forEach(attr => {
            td = document.createElement('td');
            if(attr === 'goal_id') {
                select = new GoalsDropdownView({ collection: scriven.goals_collection });
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
        debugger;
        let milestone = {};
        const inputs = this.$('input').add(this.$('select'));
        inputs.each((i, el) => {
            const key = el.name;
            const value = el.value;
            milestone[key] = value;
        });

        this.collection.create(milestone);
    }
});

const MilestoneTableView = Backbone.View.extend({
    el: "#milestones",
    initialize: function() {
        this.listenTo(this.collection, 'sync change', this.render);
        this.listenTo(this.collection, 'invalid', this.onInvalid);
    },
    render: function() {
        // If one of the rows is invalid, don't render
        if(this.$('.invalid').length) return;

        let $list = this.$('#milestone-list');
        $list.empty();
        this.$('.errors').text(null);

        this.collection.each(model => {
            let milestone = new MilestoneTableRowView({ model });
            $list.append(milestone.render().$el);
        });

        return this;
    },
    events: {
        'click .add': 'onAdd'
    },
    onAdd: function() {
        debugger;
        const tr = new NewMilestoneTableRowView({ collection: this.collection });
        this.$('#milestone-list').append(tr.render().$el);
    },
    onInvalid: function(model) {
        // Clicking the update button after editing a row will add the updating
        // class to it's row. Find this row, and add the invalid class
        this.$('.updating').addClass('invalid');
        this.$('.errors').text(model.validationError);
    }
});