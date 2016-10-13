function DataFaker(app) {
    this.app = app;
    this.buildings = buildings;
    this.current = 0;
}

DataFaker.prototype.init = function() {
    this.app.objects = [];
    for (var i = 0, l = this.buildings.length; i < l; i++) {
        var building = new Building(this.app, this.buildings[i]);
        this.app.objects.push(building);
        if (i < 1) {
            var card = new Card(this.app, building);
            this.app.cards.push(card);
        }
    }
};

DataFaker.prototype.get = function(searchQuery) {
    // http://nominatim.openstreetmap.org/details.php?place_id=158832524
    // http://polygons.openstreetmap.fr/index.py
    var poly = amsterdam,
        center = {lat: 52.3745403, lng: 5.09797550561798},
        zoom = 11;
    return {
        poly: poly,
        center: center,
        zoom: zoom,
        buildings: this.buildings
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