const MilestoneModel = Backbone.Model.extend({
    defaults: {
        id: null,
        goal_id: null,
        name: null,
        done: 0,
        date: null
    },
    parse: function(data, options) {
        return {
            id: Number(data.id),
            goal_id: Number(data.goal_id),
            name: data.name,
            done: Number(data.done),
            date: data.date
        }
    }
});

const MilestonesCollection = Backbone.Collection.extend({
    url: API + '/milestones',
    model: MilestoneModel,
    parse: function(data) {
        return data.milestones;
    }
});
