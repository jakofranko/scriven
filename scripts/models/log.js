const LogModel = Backbone.Model.extend({
    defaults: {
        description: "",
        goal_id: null,
        amount: null,
        date: `${new Date().getYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
        duration: null
    },
    validate: function(attrs, options) {
        if((attrs.goal_id === "" || attrs.goal_id === null) && attrs.description === "")
            return "You must pick a goal/task OR a description";
        if(attrs.goal_id !== "" && attrs.goal_id !== null && !attrs.amount)
            return "If specifying a goal_id, you must specify an amount";
        if(!attrs.date)
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