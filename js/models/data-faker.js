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
            km: 1
        }
    }
}

DataFaker.prototype.getSearchResults = function(searchQuery) {
    return [
        'Amsterdam (stad)',
        'Amstelveen (stad)',
        'Amstelstraat (straat)',
        'Amstelgebouw (locatie)'
    ]
};

DataFaker.prototype.filterUpdate = function() {

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

DataFaker.prototype.getSelectResults = function(searchQuery) {
    // http://nominatim.openstreetmap.org/details.php?place_id=158832524
    // http://polygons.openstreetmap.fr/index.py
    var poly = amsterdam,
        center = {lat: 52.3745403, lng: 5.09797550561798},
        zoom = 11;
    return {
        poly: poly,
        center: center,
        zoom: zoom,
        buildings: buildings
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