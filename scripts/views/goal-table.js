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
                let category_model = scriven.categories_collection.get(category_id);
                html += `<td>${category_model ? category_model.get('name') : 'unknown'}</td>`;
            } else if(attrs[i] === 'interval_id') {
                let interval_id = this.model.get(attrs[i]);
                let interval_model = scriven.intervals_collection.get(interval_id);
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
            categories = new CategoriesDropdownView({ collection: scriven.categories_collection }).render().$el,
            intervals = new IntervalsDropdownView({collection: scriven.intervals_collection }).render().$el,
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
                select = new CategoriesDropdownView({ collection: scriven.categories_collection });
                $(td).append(select.render().$el);
            } else if(attr === 'interval_id') {
                select = new IntervalsDropdownView({collection: scriven.intervals_collection });
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