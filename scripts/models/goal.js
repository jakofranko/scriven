// tracker.categories_collection set in tracker.js
// tracker.intervals_collection set in tracker.js

const GoalModel = Backbone.Model.extend({
    defaults: {
        id: null,
        name: null,
        unit: null,
        amount: null,
        category_id: null,
        interval_id: null
    },
    validate: function(attrs, options) {
        if(typeof Number(attrs.amount) !== "number" || isNaN(attrs.amount))
            return "Amount must be a number";
        if(attrs.category_id === null || attrs.category_id === '')
            return "Please set category";
        if(attrs.interval_id === null || attrs.interval_id === '')
            return "Please set interval";
    }
});

const GoalsCollection = Backbone.Collection.extend({
    url: 'http://localhost:3000/goals',
    model: GoalModel,
    parse: function(data) {
        return data.goals;
    }
});