Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    items: [
        {
        xtype: 'container',
        itemId: 'pulldown-container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        }
    }],

    myStore: undefined,
    myGrid: undefined,

    launch: function() {

        console.log("Our second App!");

        this._loadIterations();
    },

    _loadIterations: function() {
        const me = this;

        let iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
            itemId: 'iteration-combobox',
            fieldLabel: 'Iteration',
            labelAlign: 'right',
            listeners: {
                ready: me._loadSeverities,
                select: me._loadData,
                scope: me
            },
            width: 480,
        });
        
        this.down('#pulldown-container').add(iterComboBox);
    },

    _loadSeverities: function() {
        const me = this;
        let severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
            itemId: 'severity-combobox',
            model: 'Defect',
            field: 'Severity',
            fieldLabel: 'Severity',
            labelAlign: 'right',
            listeners: {
                ready: me._loadData,
                select: me._loadData,
                scope: me
             }
        });

        this.down('#pulldown-container').add(severityComboBox);
    },

    // construct filters for defects with given iteration (ref) / severity value
    _getFilters: function(iterationValue, severityValue) {
        let iterationFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Iteration',
            opertation: '=',
            value: iterationValue
        });

        let severityFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Severity',
            opertation: '=',
            value: severityValue
        });

        return iterationFilter.and(severityFilter);
    },
    
    _loadData: function() {
        const me = this;

        let selectedIterRef = this.down('#iteration-combobox').getRecord().get('_ref');
        let selectedSeverityValue = this.down('#severity-combobox').getRecord().get('value');
    
        let myFilters = this._getFilters(selectedIterRef, selectedSeverityValue);

        console.log("Combo Filter", myFilters.toString());

        // if store exists, just load new data
        if (me.defectStore) {
            me.defectStore.setFilter(myFilters);
            me.defectStore.load();

        } else {
            // create store
            me.defectStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'Defect',
                autoLoad: true,
                filters: myFilters,
                listeners: {
                    load: function(myStore, myData, success) {
                        if (!me.myGrid) {
                            me._createGrid(myStore);
                        }
                    },
                    scope: me
                },
                fetch: ['FormattedID', 'Name', 'Severity', 'Iteration']
            });
        }
    },

    _createGrid: function(myStoryStore) {
        const me = this;
        me.myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: myStoryStore,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration'
            ]
        });

        me.add(me.myGrid);
    }

});
