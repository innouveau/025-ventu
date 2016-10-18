function Map(app) {
    this.app = app;
    this.icon = {
        standard: './img/markers/standard-marker.png',
        selected: './img/markers/selected-marker.png'
    };
    this.map = null;
    this.poly = null;
    this.markers = [];
    this.cards = [];
    this.init();
}

Map.prototype.init = function() {
    var myOptions = {
        zoom: 8,
        center: new google.maps.LatLng(51.7,4.6),
        sensor: 'true',
        draggable: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        }
    };
    this.map = new google.maps.Map(document.getElementById("ventu-canvas"), myOptions);
};


Map.prototype.draw = function(data) {
    var self = this;
    this._removePoly();
    this._removeMarkers();
    this._removeCards();
    this._drawPoly(data);
    this._createMarkers(data.buildings);
    this._createCards();
    
    setTimeout(function(){
        self._showMarkers();
    }, 1000);

    setTimeout(function(){
        // init launch cascade
        self.cards[0].launch();
    }, 2000);
};



// poly

Map.prototype._drawPoly = function(data) {
    this.poly = new google.maps.Polygon({
        paths: data.poly,
        strokeColor: 'transparent',
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: '#000',
        fillOpacity: 0.4
    });
    this.poly.setMap(this.map);
    this.map.setCenter(data.center);
    this.map.setZoom(data.zoom);
};

Map.prototype._removePoly = function(markers) {
    if (this.poly) {
        this.poly.setMap(null);
    }
};



// markers

Map.prototype._removeMarkers = function() {
    for (var i = 0, l = this.markers.length; i < l; i++) {
        this.markers[i].setMap(null);
    }
    this.markers = [];
};

Map.prototype._createMarkers = function(markers) {
    for (var i = 0, l = markers.length; i < l; i++) {
        var icon = i === 0 ? this.icon.selected : this.icon.standard,
            marker = new Marker(this.app, this, markers[i], icon);
        this.markers.push(marker);
    }
};

Map.prototype._showMarkers = function() {
    var self = this,
        counter = 0,
        timer;
    timer = setInterval(function(){
        self.markers[counter].show();
        counter++;
        if (counter === self.markers.length) {
            clearInterval(timer);
        }
    }, 100)
};



// cards

Map.prototype._removeCards = function() {
    for (var i = 0, l = this.cards.length; i < l; i++) {
        this.cards[i].destroy();
    }
    this.cards = [];
};

Map.prototype._createCards = function() {
    for (var i = 0; i < this.app.config.stack.n; i++) {
        this._createCard(this.app.objects[i], i);
    }
};

Map.prototype._createCard = function(building, index) {
    var card,
        launcher = 1;
    if (index === 0 && window.environment.intro) {
        launcher = 0;
    }
    card = new Card(this.app, building, this.markers[index], index, launcher);
    this.cards.push(card);
};


