const LogModel = Backbone.Model.extend({
    defaults: {
        goal_id: null,
        amount: null,
        datetime: new Date().toISOString()
    },
    validate: function(attrs, options) {
        if(attrs.goal_id === "")
            return "You must pick a goal/task";
        if(!attrs.amount)
            return "Please specify an amount";
        if(!attrs.datetime)
            return "You must select a date";
    }
});

const LogsCollection = Backbone.Collection.extend({
    url: 'http://localhost:3000/logs',
    model: LogModel,
    parse: function(data) {
        return data.logs;
    }
});