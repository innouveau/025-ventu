function DataFaker() {
    this.searchResults = [];
    this.filter = {
        area : {
            min: 1800,
            max: 12000
        },
        offer: ['Koop', 'Huur'],
        type: ['kantoor', 'bedrijfsruimte', 'distributie', 'winkel', 'horeca', 'grond', 'overige'],
        searchArea: {
            type: 'none',
            km1: 3,
            km2: 2
        }
    };
}

DataFaker.prototype.getSearchResults = function(searchQuery, searchResultsCallback) {
    var results = [
        '1077 Amsterdam (postcode)',
        'Amstelveen (stad)',
        'Amstelstraat (straat)',
        'Amstelgebouw (locatie)'
    ];
    this.searchResults = results;
    searchResultsCallback(results);
};

DataFaker.prototype.filterUpdate = function() {

    switch (this.filter.searchArea.type) {
        case 'none':
            window.ventu.select('1077 Amsterdam (postcode)', 'poly');
            break;
        case 'circle':
            window.ventu.select('1077 Amsterdam (postcode)', 'circle');
            break;
        case 'rect':
            window.ventu.select('1077 Amsterdam (postcode)', 'rect');
            break;
    }
};

DataFaker.prototype.getList = function(type, listFillCallback) {
    var list = [],
        listToModel = [];
    if (type === 'love') {
        list = [];
    } else {
        list = [];
    }
    for (var i = 0, l = list.length; i < l; i++) {
        listToModel.push(new Building (window.ventu, list[i]));
    }
    listFillCallback(listToModel);
};

DataFaker.prototype.getSelectResults = function(searchQuery, selectCallback) {
    // http://nominatim.openstreetmap.org/details.php?place_id=158832524
    // http://polygons.openstreetmap.fr/index.py
    var selectResults,
        shape,
        zoomCenter = {lat: 52.34179, lng: 4.9254733},
        zoom = 13;
    switch (this.filter.searchArea.type) {
        case 'circle':
            shape = {
                type: 'circle',
                data: {
                    center: {lat: 52.34179, lng: 4.8854733},
                    radius: this.filter.searchArea.km1 * 1000
                }
            };
            break;
        case 'none':
            shape = {
                type: 'poly',
                data: {
                    points: amsterdam
                }
            };
            break;
        case 'rect':
            shape = {
                type: 'rect',
                data: {
                    north: 52.32179,
                    south: 52.36179,
                    west: 4.8454733,
                    east: 4.9254733
                }
            };
            break
    }
    selectResults = {
        shape: shape,
        zoomCenter: zoomCenter,
        zoom: zoom,
        markers: markers,
        objects: objects
    };
    selectCallback(selectResults);
};

DataFaker.prototype.translate = function(string) {
    // no need to translate in development modus
    return string;
};

DataFaker.prototype.post = function(id) {
    var n = Math.round((this.buildings.length - 1) * Math.random());
    window.ventu.objects.push(new Building(this.buildings[n]))
};

DataFaker.prototype.sessionStore = function(objects) {
    // do nothing
};