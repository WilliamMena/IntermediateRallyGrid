Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {

        console.log("Our second App!");
        // this._loadData();
        this._loadIteractions();
    },

    _loadIteractions: function() {
        this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
            listeners: {
               ready: function(combobox) {
                   this._loadData();
                },
                select: function(combobox, records) {
                    this._loadData();
                },
                scope: this
            },
        });
        
        this.add(this.iterComboBox);
    },
    
    _loadData: function() {
        let selectedIterRef = this.iterComboBox.getRecord().get('_ref');

        console.log('selected iter', selectedIterRef);

        let myStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'Defect',
            autoLoad: true,
            filters: [
                {
                    property: 'Iteration',
                    opertation: '=',
                    value: selectedIterRef
                }
            ],
            listeners: {
                load: function(myStore, myData, success) {
                    this._loadGrid(myStore);
                },
                scope: this
            },
            fetch: ['FormattedID', 'Name', 'Severity', 'Iteration']
        });
    },

    _loadGrid: function(myStoryStore) {

        let myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: myStoryStore,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration'
            ]
        });

        this.add(myGrid);
    }

});
