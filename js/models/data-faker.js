function DataFaker(app) {
    this.app = app;
    this.filter = {
        area : {
            min: 2500,
            max: 10000
        },
        offer: ['Koop', 'Huur'],
        searchCircle: {
            active: false,
            km: 6
        }
    };
}

DataFaker.prototype.getSearchResults = function(searchQuery) {
    return [
        '1077 Amsterdam (postcode)',
        'Amstelveen (stad)',
        'Amstelstraat (straat)',
        'Amstelgebouw (locatie)'
    ]
};

DataFaker.prototype.filterUpdate = function() {
    if (this.filter.searchCircle.active) {
        this.app.select('1077 Amsterdam (postcode)', 'circle');
    } else {
        this.app.select('1077 Amsterdam (postcode)', 'poly')
    }
};

DataFaker.prototype.getList = function(type) {
    if (type === 'love') {
        // var list = buildings.slice(1,4),
        //     toModel = [];
        // for (var i = 0, l = list.length; i < l; i++) {
        //     toModel.push(new Building(this.app, list[i]));
        // }
        // return toModel;
        return [];
    } else {
        return [];
    }
};

DataFaker.prototype.getSelectResults = function(searchQuery, type) {
    // http://nominatim.openstreetmap.org/details.php?place_id=158832524
    // http://polygons.openstreetmap.fr/index.py
    var shape,
        zoomCenter = {lat: 52.34179, lng: 4.9254733},
        zoom = 13;
    switch (type) {
        case 'circle':
            shape = {
                type: type,
                data: {
                    center: {lat: 52.34179, lng: 4.8854733},
                    radius: this.filter.searchCircle.km * 1000
                }
            };
            break;
        case 'poly':
            shape = {
                type: type,
                data: {
                    points: amsterdam
                }
            };
            break
    }
    return {
        shape: shape,
        zoomCenter: zoomCenter,
        zoom: zoom,
        markers: markers,
        objects: objects
    }
};

DataFaker.prototype.translate = function(string) {
    // no need to translate in development modus
    return string;
};

DataFaker.prototype.post = function(id) {
    var n = Math.round((this.buildings.length - 1) * Math.random());
    this.app.objects.push(new Building(this.app, this.buildings[n]))
};

DataFaker.prototype.sessionStore = function(objects) {
    // do nothing
};