Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {

        console.log("Our second App!");

        myStore = undefined;
        myGrid = undefined;

        this.pulldownContainer = Ext.create('Ext.container.Container', {
            id: 'pulldown-container-id',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
        });

        this.add(this.pulldownContainer);

        // this._loadData();
        this._loadIteractions();
    },

    _loadIteractions: function() {
        this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
            fieldLabel: 'Iteration',
            labelAlign: 'right',
            listeners: {
               ready: function(combobox) {
                   this._loadSeverities();
                },
                select: function(combobox, records) {
                    this._loadData();
                },
                scope: this
            },
            width: 480,
        });
        
        this.pulldownContainer.add(this.iterComboBox);
    },

    _loadSeverities: function() {
        this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
            model: 'Defect',
            field: 'Severity',
            fieldLabel: 'Severity',
            labelAlign: 'right',
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

        this.pulldownContainer.add(this.severityComboBox);
    },
    
    _loadData: function() {
        let selectedIterRef = this.iterComboBox.getRecord().get('_ref');
        let selectedSeverityValue = this.severityComboBox.getRecord().get('value');
        
        console.log('Selected severity', selectedSeverityValue);
        console.log('selected iter', selectedIterRef);

        let myFilters = [
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
        ];

        // if store exists, just load new data
        if (this.defectStore) {
            this.defectStore.setFilter(myFilters);
            this.defectStore.load();

        } else {
            // create store
            this.defectStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'Defect',
                autoLoad: true,
                filters: myFilters,
                listeners: {
                    load: function(myStore, myData, success) {
                        if (!this.myGrid) {
                            this._createGrid(myStore);
                        }
                    },
                    scope: this
                },
                fetch: ['FormattedID', 'Name', 'Severity', 'Iteration']
            });
        }
    },

    _createGrid: function(myStoryStore) {

        this.myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: myStoryStore,
            columnCfgs: [
                'FormattedID', 'Name', 'Severity', 'Iteration'
            ]
        });

        this.add(this.myGrid);
    }

});
