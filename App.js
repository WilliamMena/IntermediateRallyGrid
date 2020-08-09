Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {

        console.log("Our first App!");
        this._loadData();
    },

    _loadData: function() {
        var myStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'User Story',
            autoLoad: true,
            listeners: {
                load: function(myStore, myData, success) {
                    this._loadGrid(myStore);
                },
                scope: this
            },
            fetch: ['FormattedID', 'Name', 'ScheduleState']
        });
    },

    _loadGrid: function(myStoryStore) {

        var myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: myStoryStore,
            columnCfgs: [
                'FormattedID', 'Name', 'ScheduleState'
            ]
        });

        this.add(myGrid);
    }

});
