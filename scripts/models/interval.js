const IntervalModel = Backbone.Model.extend({
    defaults: {
        id: null,
        name: null
    }
});

const IntervalsCollection = Backbone.Collection.extend({
    url: "http://localhost:3000/intervals",
    model: IntervalModel,
    initialize: function() {
        // Since this is used by a couple of views, fetch the data immediately
        this.fetch();
    },
    parse: function(data) {
        return data.intervals;
    }
});

const IntervalOptionView = Backbone.View.extend({
    tagName: 'option',
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
        this.$el.attr('value', this.model.get('id'));
        this.$el.text(this.model.get('name'));
        return this;
    }
});

// These views won't be rendered directly, but used by other elements
const IntervalsDropdownView = Backbone.View.extend({
    tagName: 'select',
    initialize: function() {
        this.$el.attr('name', 'interval_id');
        this.collection.fetch();
        this.listenTo(this.collection, 'sync', this.render);
    },
    render: function() {
        this.$el.html(null);
        this.$el.append("<option value=''>Select Interval</option>");
        this.collection.each(model => {
            let view = new IntervalOptionView({ model });
            this.$el.append(view.render().$el);
        });

        return this;
    }
});