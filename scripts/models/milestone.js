const MilestoneModel = Backbone.Model.extend({
    defaults: {
        id: null,
        goal_id: null,
        name: null,
        done: 0,
        date: null
    }
});

const MilestonesCollection = Backbone.Collection.extend({
    url: API + '/milestones',
    model: MilestoneModel,
    parse: function(data) {
        return data.milestones;
    }
});