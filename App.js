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
                   this._loadSeverities();
                },
                select: function(combobox, records) {
                    this._loadData();
                },
                scope: this
            },
        });
        
        this.add(this.iterComboBox);
    },

    _loadSeverities: function() {
        this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
            model: 'Defect',
            field: 'Severity',
            listeners: {
                ready: function(combobox) {
                    this._loadData();
                 },
                 select: function(combobox, records) {
                     this._loadData();
                 },
                 scope: this
             }
        });

        this.add(this.severityComboBox);
    },
    
    _loadData: function() {
        let selectedIterRef = this.iterComboBox.getRecord().get('_ref');
        let selectedSeverityValue = this.severityComboBox.getRecord().get('value');
        
        console.log('Selected severity', selectedSeverityValue);
        console.log('selected iter', selectedIterRef);

        let myStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'Defect',
            autoLoad: true,
            filters: [
                {
                    property: 'Iteration',
                    opertation: '=',
                    value: selectedIterRef
                },
                {
                    property: 'Severity',
                    opertation: '=',
                    value: selectedSeverityValue
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
