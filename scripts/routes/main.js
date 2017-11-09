const Router = Backbone.Router.extend({
    routes: {
        // "*anything": "anything",
        "logger": "showLogger",
        "logs": "showLogs",
        "config": "showConfig"
    },
    showLogger: function() {
        this.toggleSection("logger-view");
    },
    showLogs: function() {
        this.toggleSection("logs-table-view");
    },
    showConfig: function() {
        this.toggleSection("config-view");
    },
    toggleSection: function(section_id) {
        $("section").each((i, el) => {
           if($(el).attr('id') === section_id) $(el).show();
           else $(el).hide();
        });
    }
});