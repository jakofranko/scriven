const MilestoneModel = Backbone.Model.extend({
    defaults: {
        id: null,
        goal_id: null,
        name: null,
        done: 0
    }
});

const MilestonesCollection = Backbone.Collection.extend({
    url: 'http://localhost:3000/milestones',
    model: MilestoneModel,
    parse: function(data) {
        return data.milestones;
    }
});