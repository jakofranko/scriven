const GoalsDropdownItemView = Backbone.View.extend({
    tagName: 'option',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        this.$el.val(this.model.get('id'));
        this.$el.text(this.model.get('name'));
        this.$el.data('units', this.model.get('unit'));
        return this;
    }
});

const GoalsDropdownView = Backbone.View.extend({
    tagName: 'select',
    className: 'goal-select mb3',
    initialize: function() {
        this.$el.attr('name', 'goal_id');
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