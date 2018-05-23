const LogModel = Backbone.Model.extend({
    defaults: {
        description: "",
        goal_id: null,
        milestone_id: null,
        amount: null,
        date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
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
    url: API + '/logs',
    model: LogModel,
    comparator: function(modelA, modelB) {
        // Sort by date descending (newest log first)
        let a = new Date(modelA.get('date') + "T00:00:00").getTime();
        let b = new Date(modelB.get('date') + "T00:00:00").getTime();
        return a < b ? 1 : a > b ? -1 : 0;
    },
    parse: function(data) {
        return data.logs;
    }
});