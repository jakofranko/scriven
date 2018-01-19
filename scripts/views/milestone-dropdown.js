const MilestonesDropdownItemView = Backbone.View.extend({
    tagName: 'option',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        this.$el.val(this.model.get('id'));
        this.$el.text(this.model.get('name'));
        return this;
    }
});

const MilestonesDropdownView = Backbone.View.extend({
    tagName: 'select',
    className: 'milestone-select mb3',
    initialize: function() {
        this.$el.attr('name', 'milestone_id');
        this.listenTo(this.collection, 'sync change', this.render);
    },
    render: function() {
        let query = {},
            option, models;

        if(this.getDone && this.getDone === true)
            query.done = 1;
        else if(this.getDone && this.getDone === false)
            query.done = 0;

        // This can be set upon initialization via the options object,
        // or set as a data property on the DOM element itself.
        if(this.goal_id !== undefined || this.$el.data('goal_id') !== undefined)
            query.goal_id = this.goal_id || this.$el.data('goal_id');

        models = this.collection.where(query);

        this.$el.html(null);

        this.$el.append("<option value=''>Select Milestone (optional)</option>");
        models.forEach(model => {
            option = new MilestonesDropdownItemView({ model });
            this.$el.append(option.render().$el);
        });

        return this;
    }
});