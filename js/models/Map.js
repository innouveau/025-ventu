function Map(app) {
    this.app = app;
    this.poly = null;
    this.map = null;
    this.marker = {
        standard: './img/markers/standard-marker.png',
        selected: './img/markers/selected-marker.png'
    };
    this.markers = [];
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
    this._drawPoly(data);
    setTimeout(function(){
        self._placeMarkerset(data.buildings);
    }, 1000);
};


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


Map.prototype._removeMarkers = function() {
    for (var i = 0, l = this.markers.length; i < l; i++) {
        this.markers[i].setMap(null);
    }
    this.markers = [];
};

Map.prototype._placeMarkerset = function(markers) {
    var self = this,
        counter = 0,
        timer;
    timer = setInterval(function(){
        var icon = counter === 0 ? self.marker.selected : self.marker.standard,
            marker = new Marker(self.app, self, markers[counter], icon);
        self.markers.push(marker);
        counter++;
        if (counter === markers.length) {
            clearInterval(timer);
        }
    }, 100)
};

