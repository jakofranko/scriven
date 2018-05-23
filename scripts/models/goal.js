// scriven.categories_collection set in scriven.js
// scriven.intervals_collection set in scriven.js

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
    url: API + '/goals',
    model: GoalModel,
    parse: function(data) {
        return data.goals;
    }
});